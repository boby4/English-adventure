<template>
  <div class="character" :class="[`state-${state}`]" @click="handleClick">
    <div class="character-body">
      <!-- Dinosaur SVG Character -->
      <svg viewBox="0 0 200 200" class="dinosaur-svg">
        <!-- Body -->
        <ellipse cx="100" cy="120" rx="60" ry="50" fill="#4ECDC4" />
        
        <!-- Head -->
        <circle cx="100" cy="70" r="40" fill="#4ECDC4" />
        
        <!-- Eyes -->
        <circle cx="85" cy="60" r="8" fill="white" />
        <circle cx="115" cy="60" r="8" fill="white" />
        <circle cx="87" cy="58" r="4" fill="#2C3E50" />
        <circle cx="117" cy="58" r="4" fill="#2C3E50" />
        
        <!-- Mouth -->
        <path d="M 85 80 Q 100 90 115 80" stroke="#2C3E50" stroke-width="3" fill="none" />
        
        <!-- Arms -->
        <ellipse cx="50" cy="110" rx="15" ry="10" fill="#45B7AA" />
        <ellipse cx="150" cy="110" rx="15" ry="10" fill="#45B7AA" />
        
        <!-- Legs -->
        <ellipse cx="75" cy="160" rx="15" ry="20" fill="#45B7AA" />
        <ellipse cx="125" cy="160" rx="15" ry="20" fill="#45B7AA" />
        
        <!-- Tail -->
        <path d="M 160 120 Q 180 100 170 80" stroke="#45B7AA" stroke-width="15" fill="none" stroke-linecap="round" />
        
        <!-- Spikes -->
        <polygon points="80,30 85,20 90,30" fill="#FF6B6B" />
        <polygon points="95,25 100,15 105,25" fill="#FF6B6B" />
        <polygon points="110,30 115,20 120,30" fill="#FF6B6B" />
      </svg>
      
      <!-- Speech Bubble -->
      <div v-if="showSpeech" class="speech-bubble">
        <span class="speech-text">{{ speechText }}</span>
      </div>
    </div>
    
    <!-- Shadow -->
    <div class="character-shadow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  state?: 'idle' | 'happy' | 'jump' | 'sleep'
}

const props = withDefaults(defineProps<Props>(), {
  state: 'idle'
})

const emit = defineEmits<{
  click: []
}>()

const showSpeech = ref(false)
const speechText = ref('')

// Speech texts for different states
const speechTexts = {
  idle: ['Hello!', 'Hi!', 'Let\'s play!', 'Ready?'],
  happy: ['Yay!', 'Great!', 'Awesome!', 'Good job!'],
  jump: ['Wheee!', 'Jump!', 'Bounce!', 'Fun!'],
  sleep: ['Zzz...', 'Sleepy...', 'Shh...']
}

// Handle click
const handleClick = () => {
  emit('click')
  
  // Show random speech
  const texts = speechTexts[props.state]
  speechText.value = texts[Math.floor(Math.random() * texts.length)]
  showSpeech.value = true
  
  setTimeout(() => {
    showSpeech.value = false
  }, 2000)
}

// Watch for state changes
watch(() => props.state, (newState) => {
  if (newState === 'happy' || newState === 'jump') {
    const texts = speechTexts[newState]
    speechText.value = texts[Math.floor(Math.random() * texts.length)]
    showSpeech.value = true
    
    setTimeout(() => {
      showSpeech.value = false
    }, 2000)
  }
})
</script>

<style scoped>
.character {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.character:hover {
  transform: scale(1.05);
}

.character-body {
  position: relative;
  width: 200px;
  height: 200px;
}

.dinosaur-svg {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

/* Character States */
.state-idle .dinosaur-svg {
  animation: idle 3s ease-in-out infinite;
}

.state-happy .dinosaur-svg {
  animation: happy 0.5s ease-in-out;
}

.state-jump .dinosaur-svg {
  animation: jump 0.5s ease-in-out;
}

.state-sleep .dinosaur-svg {
  animation: sleep 2s ease-in-out infinite;
}

/* Speech Bubble */
.speech-bubble {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease-out;
  white-space: nowrap;
  z-index: 10;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.speech-text {
  font-family: 'Comic Sans MS', cursive;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2C3E50;
}

/* Character Shadow */
.character-shadow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  animation: shadow 3s ease-in-out infinite;
}

/* Animations */
@keyframes idle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(-2deg);
  }
  75% {
    transform: translateY(-5px) rotate(2deg);
  }
}

@keyframes happy {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes jump {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.1);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}

@keyframes sleep {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes shadow {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.1;
  }
}

@keyframes popIn {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%) scale(1.1);
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .character-body {
    width: 150px;
    height: 150px;
  }
  
  .speech-bubble {
    top: -15px;
    padding: 8px 15px;
  }
  
  .speech-text {
    font-size: 1rem;
  }
  
  .character-shadow {
    width: 90px;
    height: 15px;
  }
}

@media (max-width: 480px) {
  .character-body {
    width: 120px;
    height: 120px;
  }
  
  .speech-bubble {
    top: -10px;
    padding: 6px 12px;
  }
  
  .speech-text {
    font-size: 0.9rem;
  }
  
  .character-shadow {
    width: 70px;
    height: 12px;
  }
}
</style>