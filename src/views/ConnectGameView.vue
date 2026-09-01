<template>
  <div class="connect-game">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-button" @click="goHome">
        <span class="back-icon">←</span>
      </button>
      <div class="level-info">
        <span class="level-name">{{ currentLevelData?.name }}</span>
        <span class="level-progress">{{ currentLevel + 1 }} / {{ totalLevels }}</span>
      </div>
      <button class="reset-button" @click="resetLevel">
        <span>🔄</span>
      </button>
    </div>
    
    <!-- Story -->
    <div class="story-bar" v-if="currentLevelData">
      <span class="story-text">{{ currentLevelData.story }}</span>
    </div>
    
    <!-- Game Content -->
    <div class="game-content">
      <ConnectGrid 
        v-if="currentLevelData"
        :level="currentLevelData"
        @complete="handleLevelComplete"
      />
    </div>
    
    <!-- Level Complete Overlay -->
    <div v-if="showComplete" class="complete-overlay">
      <div class="complete-content">
        <div class="stars">⭐ ⭐ ⭐</div>
        <h2 class="complete-title">Amazing!</h2>
        <p class="complete-text">You helped all the animals!</p>
        <button class="next-button" @click="goToNextLevel">
          Next Level →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectStore } from '../stores/connect'
import { connectLevels } from '../data/connectLevels'
import ConnectGrid from '../components/connect/ConnectGrid.vue'

const router = useRouter()
const connectStore = useConnectStore()

const showComplete = ref(false)

// Computed
const currentLevel = computed(() => connectStore.currentLevel)
const totalLevels = computed(() => connectLevels.length)
const currentLevelData = computed(() => connectLevels[currentLevel.value])

// Go back to home
const goHome = () => {
  router.push('/')
}

// Reset level
const resetLevel = () => {
  // Force re-render by changing key
  connectStore.setCurrentLevel(connectStore.currentLevel)
}

// Handle level completion
const handleLevelComplete = () => {
  connectStore.completeLevel(currentLevel.value)
  showComplete.value = true
}

// Go to next level
const goToNextLevel = () => {
  showComplete.value = false
  if (currentLevel.value < totalLevels.value - 1) {
    connectStore.nextLevel()
  } else {
    router.push('/')
  }
}

// Initialize
onMounted(() => {
  connectStore.loadProgress()
})
</script>

<style scoped>
.connect-game {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 30%, #45B7D1 60%, #2C3E50 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.back-button,
.reset-button {
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

.back-button:hover,
.reset-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.level-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  font-family: 'Comic Sans MS', cursive;
}

.level-progress {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.story-bar {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  text-align: center;
}

.story-text {
  font-size: 1.1rem;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  font-style: italic;
}

.game-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Level Complete */
.complete-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

.complete-content {
  background: white;
  border-radius: 30px;
  padding: 3rem;
  text-align: center;
  animation: scaleIn 0.5s ease;
}

.stars {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.complete-title {
  font-size: 3rem;
  color: #FFD93D;
  font-family: 'Comic Sans MS', cursive;
  margin-bottom: 0.5rem;
}

.complete-text {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 2rem;
}

.next-button {
  background: linear-gradient(45deg, #4ECDC4, #44B09E);
  border: none;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
