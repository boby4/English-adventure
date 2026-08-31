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
    
    <!-- Collection Content -->
    <div class="collection-content">
      <div class="words-grid">
        <div 
          v-for="word in words" 
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
            <button class="play-button" @click="playWord(selectedWord.word)">
              <span class="play-icon">🔊</span>
              <span class="play-text">Listen</span>
            </button>
            <button class="replay-button" @click="replayWord(selectedWord)">
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
import { levels } from '../data/levels'

const router = useRouter()
const gameStore = useGameStore()
const selectedWord = ref<any>(null)

// Computed properties
const words = computed(() => levels)
const learnedCount = computed(() => gameStore.completedLevels.length)
const totalCount = computed(() => levels.length)

// Check if word is learned
const isWordLearned = (wordId: string) => {
  return gameStore.completedLevels.includes(levels.findIndex(l => l.id === wordId))
}

// Handle word click
const handleWordClick = (word: any) => {
  if (isWordLearned(word.id)) {
    selectedWord.value = word
  }
}

// Close modal
const closeModal = () => {
  selectedWord.value = null
}

// Play word pronunciation
const playWord = (word: string) => {
  if ('speechSynthesis' in window) {
    // Convert to capitalized form (e.g., CAT -> Cat) so it's read as a word
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
  const levelIndex = levels.findIndex(l => l.id === word.id)
  if (levelIndex >= 0) {
    // Set the current level to this word and go to game
    gameStore.setCurrentLevel(levelIndex)
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

.collection-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.word-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.word-card.learned {
  background: linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%);
  color: white;
}

.word-card.locked {
  background: rgba(255, 255, 255, 0.5);
  color: #666;
}

.word-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.word-card.learned:hover {
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
}

.word-image {
  margin-bottom: 1rem;
}

.emoji {
  font-size: 4rem;
}

.word-text {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  margin-bottom: 0.5rem;
}

.word-status {
  position: absolute;
  top: 10px;
  right: 10px;
}

.status-icon {
  font-size: 1.5rem;
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

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .emoji {
    font-size: 3rem;
  }
  
  .word-text {
    font-size: 1.2rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-emoji {
    font-size: 4rem;
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  .word-card {
    padding: 1rem;
  }
  
  .emoji {
    font-size: 2.5rem;
  }
  
  .word-text {
    font-size: 1rem;
  }
}
</style>