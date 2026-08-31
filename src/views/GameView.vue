<template>
  <div class="game-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-button" @click="goHome">
        <span class="back-icon">←</span>
      </button>
      <div class="progress-info">
        <span class="progress-text">{{ currentLevel + 1 }} / {{ totalLevels }}</span>
      </div>
      <button class="sound-button" @click="toggleSound">
        <span class="sound-icon">{{ soundEnabled ? '🔊' : '🔇' }}</span>
      </button>
    </div>
    
    <!-- Game Content -->
    <div class="game-content">
      <WordScene 
        v-if="currentWord"
        :word="currentWord"
        @complete="handleWordComplete"
      />
    </div>
    
    <!-- Level Complete Overlay -->
    <div v-if="showLevelComplete" class="level-complete-overlay">
      <LevelComplete 
        :word="currentWord"
        @next="goToNextLevel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import WordScene from '../components/game/WordScene.vue'
import LevelComplete from '../components/game/LevelComplete.vue'
import { levels } from '../data/levels'

const router = useRouter()
const gameStore = useGameStore()

const soundEnabled = ref(true)
const showLevelComplete = ref(false)

// Computed properties
const currentLevel = computed(() => gameStore.currentLevel)
const totalLevels = computed(() => levels.length)
const currentWord = computed(() => levels[currentLevel.value])

// Go back to home
const goHome = () => {
  router.push('/')
}

// Toggle sound
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  gameStore.setSoundEnabled(soundEnabled.value)
}

// Handle word completion
const handleWordComplete = () => {
  gameStore.completeLevel(currentLevel.value)
  showLevelComplete.value = true
}

// Go to next level
const goToNextLevel = () => {
  showLevelComplete.value = false
  
  // Find next uncompleted level
  const nextLevel = gameStore.goToNextUncompleted(totalLevels.value)
  
  if (nextLevel === -1) {
    // All levels completed, go to collection
    router.push('/collection')
  }
}

// Initialize game
onMounted(() => {
  gameStore.loadProgress()
  
  // Start from first uncompleted level
  const nextLevel = gameStore.goToNextUncompleted(totalLevels.value)
  if (nextLevel === -1) {
    // All completed, go to collection
    router.push('/collection')
  }
})
</script>

<style scoped>
.game-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #F7DC6F 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.back-button, .sound-button {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-button:hover, .sound-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.back-icon {
  font-weight: bold;
}

.progress-info {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  backdrop-filter: blur(10px);
}

.progress-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2C3E50;
  font-family: 'Comic Sans MS', cursive;
}

.game-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.level-complete-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  .top-bar {
    padding: 0.8rem 1rem;
  }
  
  .back-button, .sound-button {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  
  .progress-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 0.6rem 0.8rem;
  }
  
  .back-button, .sound-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .progress-text {
    font-size: 0.9rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>