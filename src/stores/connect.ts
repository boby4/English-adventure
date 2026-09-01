import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConnectStore = defineStore('connect', () => {
  // State
  const currentLevel = ref(0)
  const completedLevels = ref<number[]>([])
  
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
  
  // Save progress to localStorage
  function saveProgress() {
    const progress = {
      currentLevel: currentLevel.value,
      completedLevels: completedLevels.value
    }
    localStorage.setItem('english-adventure-connect-progress', JSON.stringify(progress))
  }
  
  // Load progress from localStorage
  function loadProgress() {
    const saved = localStorage.getItem('english-adventure-connect-progress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        currentLevel.value = progress.currentLevel || 0
        completedLevels.value = progress.completedLevels || []
      } catch (e) {
        console.error('Failed to load connect progress:', e)
      }
    }
  }
  
  // Reset progress
  function resetProgress() {
    currentLevel.value = 0
    completedLevels.value = []
    localStorage.removeItem('english-adventure-connect-progress')
  }
  
  // Get next uncompleted level
  function getNextUncompletedLevel(totalLevels: number): number {
    for (let i = 0; i < totalLevels; i++) {
      if (!completedLevels.value.includes(i)) {
        return i
      }
    }
    return -1
  }
  
  return {
    currentLevel,
    completedLevels,
    totalStars,
    completeLevel,
    nextLevel,
    setCurrentLevel,
    saveProgress,
    loadProgress,
    resetProgress,
    getNextUncompletedLevel
  }
})
