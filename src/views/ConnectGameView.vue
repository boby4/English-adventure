<template>
  <div class="connect-game">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-button" @click="goHome" title="Back">
        <span class="back-icon">←</span>
      </button>

      <div class="level-info">
        <span class="level-name">{{ currentLevelData?.name }}</span>
        <span class="level-progress">Level {{ currentLevel + 1 }} / {{ totalLevels }}</span>
      </div>

      <button class="reset-button" @click="handleResetLevel" title="Reset Level">
        <span>🔄</span>
      </button>
    </div>

    <!-- Story Banner -->
    <div class="story-bar" v-if="currentLevelData">
      <span class="story-icon">📖</span>
      <span class="story-text">{{ currentLevelData.story }}</span>
    </div>

    <!-- Game Content -->
    <div class="game-content">
      <ConnectGrid
        v-if="currentLevelData"
        ref="gridComponentRef"
        :key="currentLevel"
        :level="currentLevelData"
        @complete="handleLevelComplete"
      />
    </div>

    <!-- Level Complete Overlay -->
    <div v-if="showComplete" class="complete-overlay">
      <div class="complete-content">
        <div class="stars">
          <span class="star-item">⭐</span>
          <span class="star-item">⭐</span>
          <span class="star-item">⭐</span>
        </div>
        <h2 class="complete-title">Amazing!</h2>
        <p class="complete-text">You connected all the words!</p>

        <!-- Learned words in this level -->
        <div class="learned-words-row" v-if="currentLevelData">
          <div
            v-for="target in currentLevelData.targets"
            :key="target.id"
            class="learned-word-pill"
            @click="audioManager.playWord(target.word)"
          >
            <span>{{ target.emoji }}</span>
            <span class="word-text">{{ target.word }}</span>
            <span class="sound-speaker">🔊</span>
          </div>
        </div>

        <button class="next-button" @click="goToNextLevel">
          <span>Next Adventure →</span>
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
import { audioManager } from '../utils/audio'

const router = useRouter()
const connectStore = useConnectStore()

const showComplete = ref(false)
const gridComponentRef = ref<any>(null)

// Computed
const currentLevel = computed(() => connectStore.currentLevel)
const totalLevels = computed(() => connectLevels.length)
const currentLevelData = computed(() => connectLevels[currentLevel.value])

// Go back to home
const goHome = () => {
  audioManager.playPop()
  router.push('/')
}

// Reset level
const handleResetLevel = () => {
  audioManager.playBoing()
  if (gridComponentRef.value?.resetAll) {
    gridComponentRef.value.resetAll()
  }
}

// Handle level completion
const handleLevelComplete = () => {
  connectStore.completeLevel(currentLevel.value)
  showComplete.value = true
}

// Go to next level
const goToNextLevel = () => {
  audioManager.playPop()
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
  background: linear-gradient(180deg, #68d8d6 0%, #07b1ca 40%, #0077b6 80%, #023e8a 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  z-index: 20;
}

.back-button,
.reset-button {
  background: rgba(255, 255, 255, 0.35);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover,
.reset-button:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.level-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.level-progress {
  font-size: 0.9rem;
  font-weight: bold;
  color: #fffa65;
}

.story-bar {
  padding: 0.6rem 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.story-icon {
  font-size: 1.2rem;
}

.story-text {
  font-size: 1.05rem;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.game-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  overflow-y: auto;
}

/* Level Complete Modal */
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
  padding: 1rem;
}

.complete-content {
  background: white;
  border-radius: 32px;
  padding: 2.5rem 2rem;
  text-align: center;
  animation: bouncePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 440px;
  width: 90%;
}

.stars {
  font-size: 3.2rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.star-item {
  display: inline-block;
  animation: starJump 0.6s ease infinite alternate;
}

.star-item:nth-child(2) {
  animation-delay: 0.15s;
}

.star-item:nth-child(3) {
  animation-delay: 0.3s;
}

.complete-title {
  font-size: 2.8rem;
  color: #ff9f43;
  font-family: 'Comic Sans MS', cursive;
  margin-bottom: 0.3rem;
  text-shadow: 2px 2px 0px #ffeaa7;
}

.complete-text {
  font-size: 1.2rem;
  color: #576574;
  margin-bottom: 1.5rem;
  font-family: 'Comic Sans MS', cursive;
}

.learned-words-row {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.learned-word-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f1f2f6;
  border: 2px solid #ff9f43;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.learned-word-pill:hover {
  transform: scale(1.08);
}

.word-text {
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  color: #2f3542;
}

.sound-speaker {
  font-size: 0.9rem;
}

.next-button {
  background: linear-gradient(135deg, #10ac84, #1dd1a1);
  border: none;
  border-radius: 50px;
  padding: 1rem 2.8rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  font-family: 'Comic Sans MS', cursive;
  box-shadow: 0 10px 25px rgba(29, 209, 161, 0.4);
  transition: all 0.2s ease;
}

.next-button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(29, 209, 161, 0.6);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bouncePop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes starJump {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 0.5rem 1rem;
  }
  .level-name {
    font-size: 1.1rem;
  }
  .story-text {
    font-size: 0.9rem;
  }
  .complete-content {
    padding: 2rem 1.5rem;
  }
  .complete-title {
    font-size: 2.2rem;
  }
}
</style>
