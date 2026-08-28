<template>
  <div class="home-view">
    <!-- Top Right Voice Selector -->
    <div class="top-right-controls">
      <VoiceSelector />
    </div>
    
    <div class="home-content">
      <!-- Logo -->
      <div class="logo-container">
        <h1 class="logo">English Adventure</h1>
        <p class="subtitle">Learn English with Fun!</p>
      </div>
      
      <!-- Main Character -->
      <div class="character-container">
        <Character 
          :state="characterState"
          @click="handleCharacterClick"
        />
      </div>
      
      <!-- Main Action Button -->
      <div class="action-container">
        <button class="play-button" @click="startGame">
          <span class="play-icon">▶</span>
          <span class="play-text">LET'S PLAY!</span>
        </button>
      </div>
      
      <!-- Secondary Actions -->
      <div class="secondary-actions">
        <button class="secondary-button" @click="goToCollection">
          <span class="button-icon">📚</span>
          <span class="button-text">My Words</span>
        </button>
      </div>
    </div>
    
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="cloud cloud-1">☁️</div>
      <div class="cloud cloud-2">☁️</div>
      <div class="cloud cloud-3">☁️</div>
      <div class="star star-1">⭐</div>
      <div class="star star-2">⭐</div>
      <div class="star star-3">⭐</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Character from '../components/game/Character.vue'
import VoiceSelector from '../components/common/VoiceSelector.vue'

const router = useRouter()
const characterState = ref<'idle' | 'happy' | 'jump'>('idle')

// Handle character click
const handleCharacterClick = () => {
  characterState.value = 'happy'
  setTimeout(() => {
    characterState.value = 'idle'
  }, 1000)
}

// Start game
const startGame = () => {
  router.push('/game')
}

// Go to collection
const goToCollection = () => {
  router.push('/collection')
}

// Set random character animations
onMounted(() => {
  setInterval(() => {
    if (characterState.value === 'idle') {
      const random = Math.random()
      if (random < 0.1) {
        characterState.value = 'jump'
        setTimeout(() => {
          characterState.value = 'idle'
        }, 1000)
      }
    }
  }, 3000)
})
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 50%, #FFD1FF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.top-right-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 2rem;
  padding: 2rem;
}

.logo-container {
  text-align: center;
  animation: bounceIn 1s ease-out;
}

.logo {
  font-size: 3.5rem;
  color: #FF6B6B;
  text-shadow: 3px 3px 0px #FFD93D, 6px 6px 0px rgba(0,0,0,0.1);
  margin-bottom: 0.5rem;
  font-family: 'Comic Sans MS', cursive;
}

.subtitle {
  font-size: 1.5rem;
  color: #6C5CE7;
  font-weight: bold;
  text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
}

.character-container {
  animation: float 3s ease-in-out infinite;
  cursor: pointer;
}

.action-container {
  margin-top: 1rem;
}

.play-button {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  border: none;
  border-radius: 50px;
  padding: 1.5rem 3rem;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
  min-width: 250px;
  justify-content: center;
}

.play-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
}

.play-button:active {
  transform: scale(0.95);
}

.play-icon {
  font-size: 1.5rem;
}

.play-text {
  font-family: 'Comic Sans MS', cursive;
  letter-spacing: 2px;
}

.secondary-actions {
  margin-top: 1rem;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid white;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.button-icon {
  font-size: 1.5rem;
}

.button-text {
  font-family: 'Comic Sans MS', cursive;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.cloud {
  position: absolute;
  font-size: 4rem;
  opacity: 0.6;
  animation: floatCloud 20s linear infinite;
}

.cloud-1 {
  top: 10%;
  left: -10%;
  animation-delay: 0s;
}

.cloud-2 {
  top: 30%;
  left: -15%;
  animation-delay: 5s;
}

.cloud-3 {
  top: 50%;
  left: -10%;
  animation-delay: 10s;
}

.star {
  position: absolute;
  font-size: 2rem;
  opacity: 0.8;
  animation: twinkle 2s ease-in-out infinite;
}

.star-1 {
  top: 15%;
  right: 10%;
  animation-delay: 0s;
}

.star-2 {
  top: 40%;
  right: 20%;
  animation-delay: 0.5s;
}

.star-3 {
  top: 70%;
  right: 15%;
  animation-delay: 1s;
}

/* Animations */
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 10px 40px rgba(255, 107, 107, 0.6);
  }
  100% {
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  }
}

@keyframes floatCloud {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .logo {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .play-button {
    padding: 1.2rem 2.5rem;
    font-size: 1.5rem;
    min-width: 200px;
  }
  
  .cloud {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .play-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    min-width: 180px;
  }
}
</style>