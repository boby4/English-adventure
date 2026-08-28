<template>
  <div class="voice-selector">
    <button class="voice-btn" @click="togglePanel">
      <span class="voice-icon">🎤</span>
      <span class="voice-text">Voice</span>
    </button>
    
    <div v-if="showPanel" class="voice-panel">
      <div class="panel-header">
        <h3>Choose Voice</h3>
        <button class="close-btn" @click="showPanel = false">×</button>
      </div>
      
      <div class="voice-list">
        <button
          v-for="voice in displayVoices"
          :key="voice.name"
          class="voice-option"
          :class="{ 'active': selectedVoice === voice.name }"
          @click="selectVoice(voice)"
        >
          <span class="voice-info">
            <span class="voice-name">{{ getVoiceDisplayName(voice.name) }}</span>
            <span class="voice-lang">{{ voice.lang }}</span>
          </span>
          <span v-if="selectedVoice === voice.name" class="check-mark">✓</span>
        </button>
        
        <div v-if="displayVoices.length === 0" class="no-voices">
          <p>Loading voices...</p>
          <p class="hint">Please wait or click the button again</p>
        </div>
      </div>
      
      <div class="panel-footer">
        <button class="test-btn" @click="testVoice">
          🔊 Test Voice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const showPanel = ref(false)
const voices = ref<SpeechSynthesisVoice[]>([])

// Preset voice options for browsers that don't return voices
const presetVoices = [
  { name: 'Default', lang: 'en-US', isPreset: true },
  { name: 'Google US English', lang: 'en-US', isPreset: true },
  { name: 'Google UK English', lang: 'en-GB', isPreset: true },
  { name: 'Microsoft David', lang: 'en-US', isPreset: true },
  { name: 'Microsoft Zira', lang: 'en-US', isPreset: true },
]

// Get all available voices (not just English)
const displayVoices = computed(() => {
  if (voices.value.length === 0) {
    // If no voices loaded, show presets
    return presetVoices
  }
  
  // Show English voices first, then others
  const english = voices.value.filter(v => 
    v.lang.startsWith('en') || 
    v.lang === 'en-US' || 
    v.lang === 'en-GB'
  )
  const others = voices.value.filter(v => 
    !v.lang.startsWith('en') && 
    v.lang !== 'en-US' && 
    v.lang !== 'en-GB'
  )
  return [...english, ...others]
})

// Current selected voice
const selectedVoice = computed(() => gameStore.selectedVoiceName)

// Load voices
onMounted(() => {
  // Mobile Chrome needs a user interaction to load voices
  // So we'll load on first click
  loadVoices()
  
  // Listen for voice changes
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      loadVoices()
    }
  }
  
  // Try loading multiple times
  setTimeout(loadVoices, 100)
  setTimeout(loadVoices, 500)
  setTimeout(loadVoices, 1000)
  setTimeout(loadVoices, 2000)
})

const loadVoices = () => {
  const loadedVoices = speechSynthesis.getVoices()
  if (loadedVoices.length > 0) {
    voices.value = loadedVoices
    console.log('Loaded', loadedVoices.length, 'voices')
  }
}

// Toggle panel
const togglePanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    // Mobile Chrome: speak something first to trigger voice loading
    const testUtterance = new SpeechSynthesisUtterance(' ')
    testUtterance.volume = 0
    speechSynthesis.speak(testUtterance)
    
    // Then load voices after a short delay
    setTimeout(loadVoices, 100)
    setTimeout(loadVoices, 300)
    setTimeout(loadVoices, 500)
  }
}

// Find matching system voice
const findMatchingVoice = (voiceName: string): SpeechSynthesisVoice | null => {
  const systemVoices = speechSynthesis.getVoices()
  
  // Try exact match
  let found = systemVoices.find(v => v.name === voiceName)
  if (found) return found
  
  // Try partial match
  found = systemVoices.find(v => v.name.includes(voiceName))
  if (found) return found
  
  // Try matching by language
  if (voiceName.includes('US') || voiceName.includes('David')) {
    found = systemVoices.find(v => v.lang === 'en-US')
  } else if (voiceName.includes('UK') || voiceName.includes('British')) {
    found = systemVoices.find(v => v.lang === 'en-GB')
  }
  
  return found || null
}

// Select voice
const selectVoice = (voice: any) => {
  gameStore.setSelectedVoice(voice.name)
  
  // Play a sample with the selected voice
  const utterance = new SpeechSynthesisUtterance('Hello!')
  utterance.rate = 0.8
  
  // Try to find matching system voice
  const systemVoice = findMatchingVoice(voice.name)
  if (systemVoice) {
    utterance.voice = systemVoice
  }
  
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

// Test voice
const testVoice = () => {
  const utterance = new SpeechSynthesisUtterance('Hello! Let\'s learn English together!')
  utterance.rate = 0.8
  
  // Try to find matching system voice
  const systemVoice = findMatchingVoice(selectedVoice.value)
  if (systemVoice) {
    utterance.voice = systemVoice
    utterance.lang = systemVoice.lang
  } else {
    utterance.lang = 'en-US'
  }
  
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

// Get display name
const getVoiceDisplayName = (name: string): string => {
  return name
    .replace('Microsoft ', '')
    .replace('Google ', '')
    .replace('English (United States)', 'US')
    .replace('English (United Kingdom)', 'UK')
    .replace(/\s*\(.*\)/, '')
    .trim()
}
</script>

<style scoped>
.voice-selector {
  position: relative;
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.voice-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.voice-icon {
  font-size: 1.2rem;
}

.voice-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 300px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.voice-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  max-height: 300px;
}

.voice-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.voice-option:hover {
  background: #f5f5f5;
}

.voice-option.active {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
}

.voice-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.voice-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.voice-lang {
  font-size: 0.8rem;
  opacity: 0.7;
}

.voice-option.active .voice-lang {
  opacity: 0.9;
}

.check-mark {
  font-size: 1.2rem;
  font-weight: bold;
}

.no-voices {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.no-voices .hint {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: #bbb;
}

.panel-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.test-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #4ECDC4, #44B09E);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
}
</style>
