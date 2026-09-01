<template>
  <div class="collection-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-button" @click="goHome">
        <span class="back-icon">←</span>
      </button>
      <h1 class="title">My Words</h1>
      <div class="stats">
        <span class="stats-text">{{ learnedCount }} / {{ totalCount }}</span>
      </div>
    </div>
    
    <!-- Category Tabs -->
    <div class="category-tabs">
      <button
        v-for="cat in allCategories"
        :key="cat.id"
        class="category-tab"
        :class="{ 'active': selectedCategory === cat.id }"
        :style="{ '--cat-color': cat.color }"
        @click="selectedCategory = cat.id"
      >
        <span class="tab-emoji">{{ cat.emoji }}</span>
        <span class="tab-name">{{ cat.name }}</span>
        <span class="tab-count">{{ getCategoryProgress(cat.id) }}</span>
      </button>
    </div>
    
    <!-- Collection Content -->
    <div class="collection-content">
      <div class="words-grid">
        <div 
          v-for="word in filteredWords" 
          :key="word.id"
          class="word-card"
          :class="{ 'learned': isWordLearned(word.id), 'locked': !isWordLearned(word.id) }"
          @click="handleWordClick(word)"
        >
          <div class="word-image">
            <span class="emoji">{{ word.emoji }}</span>
          </div>
          <div class="word-text">{{ word.word }}</div>
          <div class="word-status">
            <span v-if="isWordLearned(word.id)" class="status-icon">✅</span>
            <span v-else class="status-icon">🔒</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Word Detail Modal -->
    <div v-if="selectedWord" class="word-modal-overlay" @click="closeModal">
      <div class="word-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedWord.word }}</h2>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-content">
          <div class="modal-image">
            <span class="modal-emoji">{{ selectedWord.emoji }}</span>
          </div>
          <div class="modal-sentence">{{ selectedWord.sentence }}</div>
          <div class="modal-buttons">
            <button class="play-button" @click.stop="playWord(selectedWord.word)">
              <span class="play-icon">🔊</span>
              <span class="play-text">Listen</span>
            </button>
            <button class="replay-button" @click.stop="replayWord(selectedWord)">
              <span class="play-icon">🔄</span>
              <span class="play-text">Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { levels, categories, type Category } from '../data/levels'

const router = useRouter()
const gameStore = useGameStore()
const selectedWord = ref<any>(null)
const selectedCategory = ref<string>('all')

// Computed properties
const allCategories = computed(() => {
  return [
    { id: 'all', name: 'All', emoji: '🌟', color: '#FFD93D' },
    ...categories
  ]
})

const filteredWords = computed(() => {
  if (selectedCategory.value === 'all') {
    return levels
  }
  return levels.filter(l => l.category === selectedCategory.value)
})

const learnedCount = computed(() => gameStore.completedLevels.length)
const totalCount = computed(() => levels.length)

// Get category progress
const getCategoryProgress = (categoryId: string) => {
  if (categoryId === 'all') {
    return `${learnedCount.value}/${totalCount.value}`
  }
  const categoryWords = levels.filter(l => l.category === categoryId)
  const learnedInCategory = categoryWords.filter((_, index) => {
    const globalIndex = levels.findIndex(l => l.id === categoryWords[index].id)
    return gameStore.completedLevels.includes(globalIndex)
  })
  return `${learnedInCategory.length}/${categoryWords.length}`
}

// Check if word is learned
const isWordLearned = (wordId: string) => {
  return gameStore.completedLevels.includes(levels.findIndex(l => l.id === wordId))
}

// Handle word click
const handleWordClick = (word: any) => {
  selectedWord.value = word
}

// Close modal
const closeModal = () => {
  selectedWord.value = null
}

// Play word pronunciation
const playWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const speakWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(speakWord)
    utterance.lang = 'en-US'
    utterance.rate = 0.7
    utterance.pitch = 1.0
    utterance.volume = 1.0
    speechSynthesis.speak(utterance)
  }
}

// Replay a learned word
const replayWord = (word: any) => {
  console.log('Replay word called:', word)
  const levelIndex = levels.findIndex(l => l.id === word.id)
  console.log('Level index:', levelIndex)
  if (levelIndex >= 0) {
    gameStore.setCurrentLevel(levelIndex)
    gameStore.isReplayMode = true
    closeModal()
    router.push('/game')
  }
}

// Go back to home
const goHome = () => {
  router.push('/')
}

// Initialize
onMounted(() => {
  gameStore.loadProgress()
})
</script>

<style scoped>
.collection-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #A8E6CF 0%, #DCEDC1 50%, #FFD3B6 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.back-button {
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

.back-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.title {
  font-size: 2rem;
  color: #2C3E50;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.5);
}

.stats {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
}

.stats-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2C3E50;
  font-family: 'Comic Sans MS', cursive;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.2);
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid transparent;
  border-radius: 25px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.6);
}

.category-tab.active {
  background: var(--cat-color, #FFD93D);
  color: white;
  border-color: var(--cat-color, #FFD93D);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.tab-emoji {
  font-size: 1.2rem;
}

.tab-name {
  font-weight: 600;
  font-family: 'Comic Sans MS', cursive;
}

.tab-count {
  font-size: 0.8rem;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
}

.collection-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.word-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.word-card.learned {
  background: linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%);
  color: white;
}

.word-card.locked {
  background: rgba(255, 255, 255, 0.5);
  color: #999;
}

.word-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.word-image {
  margin-bottom: 0.5rem;
}

.emoji {
  font-size: 3rem;
}

.word-text {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  margin-bottom: 0.3rem;
}

.word-status {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-icon {
  font-size: 1.2rem;
}

/* Word Modal */
.word-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.word-modal {
  background: white;
  border-radius: 30px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 2.5rem;
  color: #FF6B6B;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 2px 2px 0px #FFD93D;
}

.close-button {
  background: #FF6B6B;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #FF8E53;
  transform: scale(1.1);
}

.modal-content {
  text-align: center;
}

.modal-image {
  margin-bottom: 1.5rem;
}

.modal-emoji {
  font-size: 6rem;
}

.modal-sentence {
  font-size: 1.3rem;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-style: italic;
  font-family: 'Comic Sans MS', cursive;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.play-button {
  background: linear-gradient(45deg, #4ECDC4, #44B09E);
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
  transition: all 0.3s ease;
}

.play-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(78, 205, 196, 0.5);
}

.replay-button {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.replay-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.5);
}

.play-icon {
  font-size: 1.5rem;
}

.play-text {
  font-family: 'Comic Sans MS', cursive;
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

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
  
  .words-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
  }
  
  .emoji {
    font-size: 2.5rem;
  }
  
  .word-text {
    font-size: 1.1rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-emoji {
    font-size: 4rem;
  }
  
  .category-tab {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 0.8rem 1rem;
  }
  
  .title {
    font-size: 1.2rem;
  }
  
  .words-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .word-card {
    padding: 0.75rem;
  }
}
</style>
