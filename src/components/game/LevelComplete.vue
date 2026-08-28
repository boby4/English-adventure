<template>
  <div class="level-complete">
    <div class="complete-content">
      <div class="stars-container">
        <span class="star">⭐</span>
        <span class="star">⭐</span>
        <span class="star">⭐</span>
      </div>
      
      <div class="word-container">
        <span class="word-emoji">{{ word.emoji }}</span>
        <div class="word-text">{{ word.word }}</div>
      </div>
      
      <div class="message">
        <span class="message-text">Great Job!</span>
      </div>
      
      <button class="next-button" @click="handleNext">
        <span class="next-text">Next Word</span>
        <span class="next-icon">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WordLevel } from '../../data/levels'

interface Props {
  word: WordLevel
}

defineProps<Props>()

const emit = defineEmits<{
  next: []
}>()

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.level-complete {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.complete-content {
  text-align: center;
  z-index: 10;
  animation: scaleIn 0.5s ease-out;
}

.stars-container {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.star {
  display: inline-block;
  margin: 0 0.5rem;
  animation: starPop 0.5s ease-out both;
}

.star:nth-child(1) {
  animation-delay: 0.2s;
}

.star:nth-child(2) {
  animation-delay: 0.4s;
}

.star:nth-child(3) {
  animation-delay: 0.6s;
}

.word-container {
  margin-bottom: 2rem;
}

.word-emoji {
  font-size: 8rem;
  display: block;
  margin-bottom: 1rem;
  animation: bounceIn 0.5s ease-out;
}

.word-text {
  font-size: 4rem;
  font-weight: bold;
  color: #2C3E50;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 3px 3px 0px rgba(255, 255, 255, 0.5);
}

.message {
  margin-bottom: 2rem;
}

.message-text {
  font-size: 3rem;
  font-weight: bold;
  color: #FFD93D;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 3px 3px 0px #FF6B6B;
  animation: bounceIn 0.5s ease-out 0.3s both;
}

.next-button {
  background: linear-gradient(45deg, #4ECDC4, #44B09E);
  border: none;
  border-radius: 50px;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
  transition: all 0.3s ease;
  animation: bounceIn 0.5s ease-out 0.5s both;
}

.next-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(78, 205, 196, 0.6);
}

.next-button:active {
  transform: scale(0.95);
}

.next-text {
  font-family: 'Comic Sans MS', cursive;
}

.next-icon {
  font-size: 1.5rem;
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

@keyframes starPop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .stars-container {
    font-size: 3rem;
  }
  
  .word-emoji {
    font-size: 6rem;
  }
  
  .word-text {
    font-size: 3rem;
  }
  
  .message-text {
    font-size: 2.5rem;
  }
  
  .next-button {
    padding: 1.2rem 2.5rem;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .stars-container {
    font-size: 2.5rem;
  }
  
  .star {
    margin: 0 0.3rem;
  }
  
  .word-emoji {
    font-size: 5rem;
  }
  
  .word-text {
    font-size: 2.5rem;
  }
  
  .message-text {
    font-size: 2rem;
  }
  
  .next-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }
}
</style>
