import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // State
  const currentLevel = ref(0)
  const completedLevels = ref<number[]>([])
  const soundEnabled = ref(true)
  const musicEnabled = ref(true)
  const selectedVoiceName = ref('') // Store selected voice name
  
  // Computed
  const totalStars = computed(() => completedLevels.value.length)
  
  // Actions
  function completeLevel(levelIndex: number) {
    if (!completedLevels.value.includes(levelIndex)) {
      completedLevels.value.push(levelIndex)
      saveProgress()
    }
  }
  
  function nextLevel() {
    currentLevel.value++
    saveProgress()
  }
  
  function setCurrentLevel(level: number) {
    currentLevel.value = level
  }
  
  function setSoundEnabled(enabled: boolean) {
    soundEnabled.value = enabled
    saveProgress()
  }
  
  function setMusicEnabled(enabled: boolean) {
    musicEnabled.value = enabled
    saveProgress()
  }
  
  function setSelectedVoice(voiceName: string) {
    selectedVoiceName.value = voiceName
    saveProgress()
  }
  
  // Save progress to localStorage
  function saveProgress() {
    const progress = {
      currentLevel: currentLevel.value,
      completedLevels: completedLevels.value,
      soundEnabled: soundEnabled.value,
      musicEnabled: musicEnabled.value,
      selectedVoiceName: selectedVoiceName.value
    }
    localStorage.setItem('english-adventure-progress', JSON.stringify(progress))
  }
  
  // Load progress from localStorage
  function loadProgress() {
    const saved = localStorage.getItem('english-adventure-progress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        currentLevel.value = progress.currentLevel || 0
        completedLevels.value = progress.completedLevels || []
        soundEnabled.value = progress.soundEnabled !== false
        musicEnabled.value = progress.musicEnabled !== false
        selectedVoiceName.value = progress.selectedVoiceName || ''
      } catch (e) {
        console.error('Failed to load progress:', e)
      }
    }
  }
  
  // Reset progress
  function resetProgress() {
    currentLevel.value = 0
    completedLevels.value = []
    soundEnabled.value = true
    musicEnabled.value = true
    selectedVoiceName.value = ''
    localStorage.removeItem('english-adventure-progress')
  }
  
  return {
    // State
    currentLevel,
    completedLevels,
    soundEnabled,
    musicEnabled,
    selectedVoiceName,
    
    // Computed
    totalStars,
    
    // Actions
    completeLevel,
    nextLevel,
    setCurrentLevel,
    setSoundEnabled,
    setMusicEnabled,
    setSelectedVoice,
    saveProgress,
    loadProgress,
    resetProgress
  }
})