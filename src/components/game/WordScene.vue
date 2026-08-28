<template>
  <div class="word-scene" ref="sceneRef">
    <!-- Word Illustration -->
    <div class="word-illustration">
      <span class="word-emoji" @click="playWord">{{ word.emoji }}</span>
      <div class="word-label">
        {{ word.word }}
        <button class="play-word-btn" @click="playWord" title="Play pronunciation">
          🔊
        </button>
      </div>
    </div>
    
    <!-- Letter Board -->
    <div class="letter-board">
      <!-- Drop Slots -->
      <div class="drop-slots">
        <div 
          v-for="(letter, index) in word.letters" 
          :key="`slot-${index}`"
          class="drop-slot"
          :class="[{ 
            'filled': filledSlots[index],
            'highlight': highlightSlot === index,
            'near': nearSlot === index
          }]"
          :ref="(el) => setSlotRef(el, index)"
          :data-index="index"
        >
          <img v-if="filledSlots[index]" :src="`/img/${letter}.png`" :alt="letter" class="slot-letter-img filled" />
          <img v-else :src="`/img/${letter}.png`" :alt="letter" class="slot-letter-img placeholder" />
        </div>
      </div>
      
      <!-- Draggable Letters -->
      <div class="draggable-letters">
        <div 
          v-for="(letter, index) in shuffledLetters" 
          :key="`letter-${index}`"
          class="draggable-letter"
          :class="[{ 
            'used': usedLetters.includes(index),
            'dragging': draggingIndex === index,
            'near-target': draggingIndex === index && nearSlot !== null
          }]"
          :ref="(el) => setLetterRef(el, index)"
          :data-index="index"
          :style="getLetterStyle(index)"
          @pointerdown="startDrag($event, index)"
        >
          <img :src="`/img/${letter}.png`" :alt="letter" class="letter-img" />
        </div>
      </div>
    </div>
    
    <!-- Floating letter while dragging -->
    <div 
      v-if="draggingIndex !== null" 
      class="floating-letter"
      :class="{ 'struggling': isDragging }"
      :style="floatingStyle"
    >
      <img :src="`/img/${shuffledLetters[draggingIndex]}.png`" :alt="shuffledLetters[draggingIndex]" class="floating-img" />
    </div>
    
    <!-- Sentence Scene (shown after word completion) -->
    <div v-if="showSentence" class="sentence-scene">
      <div class="sentence-container">
        <div class="sentence-text">
          <span 
            v-for="(wordPart, index) in sentenceParts" 
            :key="index"
            class="sentence-word"
            :class="{ 'keyword': wordPart.toLowerCase().includes(word.word.toLowerCase()) }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            {{ wordPart }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="stars">
          <span 
            v-for="i in 3" 
            :key="i"
            class="star"
            :style="{ animationDelay: `${i * 0.15}s` }"
          >
            ⭐
          </span>
        </div>
        <div class="celebration-text">Awesome!</div>
        <div class="confetti-container">
          <div 
            v-for="i in 20" 
            :key="i"
            class="confetti"
            :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: confettiColors[i % confettiColors.length]
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import type { WordLevel } from '../../data/levels'
import { getLetterAnimal, type LetterAnimal } from '../../data/letterAnimals'
import { getLetterShape, type LetterShape } from '../../data/letterShapes'
import { useGameStore } from '../../stores/game'

interface Props {
  word: WordLevel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

// Store
const gameStore = useGameStore()

// Refs
const sceneRef = ref<HTMLElement | null>(null)
const slotRefs = ref<(HTMLElement | null)[]>([])
const letterRefs = ref<(HTMLElement | null)[]>([])

// State
const filledSlots = ref<(string | null)[]>([])
const usedLetters = ref<number[]>([])
const shuffledLetters = ref<string[]>([])
const showSentence = ref(false)
const showCelebration = ref(false)
const isCompleted = ref(false)
const errorCount = ref(0)

// Drag state
const draggingIndex = ref<number | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const hasDragged = ref(false) // Track if user has actually dragged
const letterPositions = ref<{x: number, y: number, rotation: number, style: string}[]>([])
const nearSlot = ref<number | null>(null)
const highlightSlot = ref<number | null>(null)
const isDragging = ref(false) // Track dragging state for animation
const letterSoundInterval = ref<number | null>(null) // For repeating letter sound

// Letter styles: bubble, block, card, star, diamond
const letterStyles = ['bubble', 'block', 'card', 'star', 'diamond']

// Confetti colors
const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A8E6CF', '#FF8E53']

// Computed
const sentenceParts = computed(() => {
  return props.word.sentence.split(' ')
})

const floatingStyle = computed(() => {
  const pos = draggingIndex.value !== null ? letterPositions.value[draggingIndex.value] : null
  return {
    transform: `translate(${currentX.value}px, ${currentY.value}px) scale(1.2)`,
    opacity: 1,
    animation: 'none'
  }
})

// Get floating letter class
const floatingClass = computed(() => {
  if (draggingIndex.value === null) return ''
  const pos = letterPositions.value[draggingIndex.value]
  if (!pos) return ''
  return `letter-${pos.style}`
})

// Helper functions
const setSlotRef = (el: any, index: number) => {
  if (el) slotRefs.value[index] = el as HTMLElement
}

const setLetterRef = (el: any, index: number) => {
  if (el) letterRefs.value[index] = el as HTMLElement
}

const getLetterStyle = (index: number) => {
  if (usedLetters.value.includes(index)) {
    return { opacity: 0, transform: 'scale(0)', pointerEvents: 'none' }
  }
  
  // Hide the letter being dragged
  if (draggingIndex.value === index) {
    return { opacity: 0, pointerEvents: 'none' }
  }
  
  const pos = letterPositions.value[index]
  if (!pos) return {}
  
  return {
    left: `${pos.x}%`,
    top: `${pos.y}px`,
    transform: `translateX(-50%) rotate(${pos.rotation}deg)`
  }
}

// Get letter class based on random style
const getLetterClass = (index: number) => {
  const pos = letterPositions.value[index]
  if (!pos) return ''
  return `letter-${pos.style}`
}

// Get slot animal
const getSlotAnimal = (letter: string) => {
  return getLetterAnimal(letter)
}

// Get slot shape class
const getSlotShapeClass = (letter: string) => {
  const animal = getLetterAnimal(letter)
  return `slot-shape-${animal.shape}`
}

// Get letter shape class
const getLetterShapeClass = (letter: string) => {
  const animal = getLetterAnimal(letter)
  return `letter-shape-${animal.shape}`
}

// Shuffle array
const shuffleArray = (array: string[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Initialize
onMounted(() => {
  initializeWord()
  // Add both pointer and touch events for mobile compatibility
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
  document.addEventListener('touchcancel', onTouchEnd)
})

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
  document.removeEventListener('touchcancel', onTouchEnd)
})

watch(() => props.word, () => {
  initializeWord()
})

const initializeWord = () => {
  filledSlots.value = new Array(props.word.letters.length).fill(null)
  usedLetters.value = []
  shuffledLetters.value = shuffleArray(props.word.letters)
  showSentence.value = false
  showCelebration.value = false
  isCompleted.value = false
  errorCount.value = 0
  
  // Generate random positions for scattered letters
  const count = shuffledLetters.value.length
  
  // Grid-based random positioning to avoid overlap
  // Divide container into a grid and place letters randomly within each cell
  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  
  letterPositions.value = Array.from({ length: count }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    
    // Calculate cell boundaries (with margins)
    const cellWidth = 80 / cols // 80% of width divided by columns
    const cellHeight = 200 / rows // 200px height divided by rows
    
    // Random position within cell
    const x = 10 + col * cellWidth + Math.random() * (cellWidth * 0.7)
    const y = 20 + row * cellHeight + Math.random() * (cellHeight * 0.6)
    
    // Random rotation
    const rotation = (Math.random() - 0.5) * 30
    
    return {
      x: x,
      y: y,
      rotation: rotation,
      style: letterStyles[Math.floor(Math.random() * letterStyles.length)]
    }
  })
  
  // Play word after a short delay
  setTimeout(() => {
    playWord()
  }, 500)
}

// Speech synthesis helper - using browser's built-in TTS
const speak = (text: string, options: { rate?: number; pitch?: number; cancel?: boolean } = {}) => {
  console.log('Attempting to speak:', text)
  
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }
  
  // Only cancel if specified (default true for backward compatibility)
  if (options.cancel !== false) {
    speechSynthesis.cancel()
  }
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = options.rate || 0.9
  utterance.pitch = options.pitch || 1.0
  utterance.volume = 1.0
  
  // Get available voices
  const voices = speechSynthesis.getVoices()
  
  // Try to use user's selected voice
  let selectedVoice = null
  if (gameStore.selectedVoiceName) {
    selectedVoice = voices.find(v => v.name === gameStore.selectedVoiceName)
  }
  
  // Fallback to default voice selection
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.name.includes('Google US English')) ||
                   voices.find(v => v.name.includes('Microsoft David')) ||
                   voices.find(v => v.name.includes('Microsoft Zira')) ||
                   voices.find(v => v.lang === 'en-US') ||
                   voices.find(v => v.lang.startsWith('en'))
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice
    console.log('Using voice:', selectedVoice.name)
  }
  
  // Speak
  speechSynthesis.speak(utterance)
}

// Play letter pronunciation - with cancel=false to allow repeating
const playLetter = (letter: string) => {
  speak(letter, { rate: 0.5, pitch: 1.0, cancel: false })
}

// Play word pronunciation - slow for children
const playWord = () => {
  const word = props.word.word
  const speakWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  console.log('Playing word:', speakWord)
  speak(speakWord, { rate: 0.7, pitch: 1.0 })
}

// Play sentence - slow and clear
const playSentence = () => {
  speak(props.word.sentence, { rate: 0.65, pitch: 1.0 })
}

// Start drag
const startDrag = (event: PointerEvent, index: number) => {
  if (usedLetters.value.includes(index)) return
  
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  draggingIndex.value = index
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  currentX.value = event.clientX - rect.width / 2
  currentY.value = event.clientY - rect.height / 2
  hasDragged.value = false // Reset drag flag
  
  // Capture pointer for smooth tracking (only on desktop)
  if (event.pointerId !== undefined && target.setPointerCapture) {
    try {
      target.setPointerCapture(event.pointerId)
    } catch (e) {
      // Ignore on mobile
    }
  }
  
  // Start repeating letter sound
  const letter = shuffledLetters.value[index]
  playLetter(letter)
  
  // Repeat letter sound while dragging
  letterSoundInterval.value = window.setInterval(() => {
    if (isDragging.value) {
      playLetter(letter)
    }
  }, 800) // Repeat every 800ms
}

// Pointer move
const onPointerMove = (event: PointerEvent) => {
  if (draggingIndex.value === null) return
  
  currentX.value = event.clientX - 40
  currentY.value = event.clientY - 45
  
  // Check if user has dragged more than 20px
  const dx = event.clientX - dragStartX.value
  const dy = event.clientY - dragStartY.value
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance > 20) {
    hasDragged.value = true
  }
  
  // Only check proximity if user has actually dragged
  if (hasDragged.value) {
    checkProximity(event.clientX, event.clientY)
  }
}

// Touch move handler for mobile
const onTouchMove = (event: TouchEvent) => {
  if (draggingIndex.value === null) return
  event.preventDefault() // Prevent scrolling
  
  const touch = event.touches[0]
  currentX.value = touch.clientX - 40
  currentY.value = touch.clientY - 45
  
  // Check if user has dragged more than 20px
  const dx = touch.clientX - dragStartX.value
  const dy = touch.clientY - dragStartY.value
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance > 20) {
    hasDragged.value = true
  }
  
  // Only check proximity if user has actually dragged
  if (hasDragged.value) {
    checkProximity(touch.clientX, touch.clientY)
  }
}

// Touch end handler for mobile
const onTouchEnd = (event: TouchEvent) => {
  console.log('Touch end called')
  
  // Get the last touch position
  const touch = event.changedTouches[0]
  
  // Create a synthetic PointerEvent-like object
  const syntheticEvent = {
    clientX: touch.clientX,
    clientY: touch.clientY
  } as PointerEvent
  
  // Call the same handler as pointerup
  onPointerUp(syntheticEvent)
}

// Check proximity to drop slots
const checkProximity = (x: number, y: number) => {
  let nearestIndex = -1
  let nearestDistance = 60 // Snap distance - smaller for more precise placement
  
  slotRefs.value.forEach((slot, index) => {
    if (!slot || filledSlots.value[index]) return
    
    const rect = slot.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
    
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })
  
  nearSlot.value = nearestIndex >= 0 ? nearestIndex : null
}

// Pointer up
const onPointerUp = (event: PointerEvent) => {
  console.log('Pointer up called, draggingIndex:', draggingIndex.value)
  
  // Always stop sound first
  stopLetterSound()
  isDragging.value = false
  
  if (draggingIndex.value === null) {
    console.log('No letter being dragged, returning')
    return
  }
  
  const letterIndex = draggingIndex.value
  const letter = shuffledLetters.value[letterIndex]
  console.log('Releasing letter:', letter, 'at index:', letterIndex)
  
  // Get final position
  const finalX = event.clientX
  const finalY = event.clientY
  
  // Calculate total drag distance
  const totalDragDistance = Math.sqrt(
    Math.pow(finalX - dragStartX.value, 2) + 
    Math.pow(finalY - dragStartY.value, 2)
  )
  
  // Only allow placement if dragged more than 40px
  const minDragDistance = 40
  
  if (totalDragDistance > minDragDistance) {
    // Check if near a valid slot
    if (nearSlot.value !== null) {
      const slotIndex = nearSlot.value
      const expectedLetter = props.word.letters[slotIndex]
      
      if (letter === expectedLetter) {
        // Correct placement!
        console.log('Correct placement!')
        handleCorrectPlacement(letterIndex, slotIndex)
      } else {
        // Wrong placement
        console.log('Wrong placement, expected:', expectedLetter)
        handleWrongPlacement(letterIndex)
      }
    } else {
      // Not near any slot, bounce back
      console.log('Not near any slot')
      handleWrongPlacement(letterIndex)
    }
  } else {
    // Didn't drag enough, bounce back
    console.log('Did not drag enough')
    handleWrongPlacement(letterIndex)
  }
  
  // Reset drag state - this will make the floating letter disappear
  console.log('Resetting drag state')
  draggingIndex.value = null
  nearSlot.value = null
  hasDragged.value = false
}

// Stop letter sound
const stopLetterSound = () => {
  if (letterSoundInterval.value) {
    clearInterval(letterSoundInterval.value)
    letterSoundInterval.value = null
  }
  speechSynthesis.cancel()
}

// Handle correct placement
const handleCorrectPlacement = (letterIndex: number, slotIndex: number) => {
  const letter = shuffledLetters.value[letterIndex]
  
  // Animate letter to slot
  const slot = slotRefs.value[slotIndex]
  if (slot) {
    slot.classList.add('snap-success')
    setTimeout(() => slot.classList.remove('snap-success'), 500)
  }
  
  // Update state
  filledSlots.value[slotIndex] = letter
  usedLetters.value.push(letterIndex)
  
  // Play success sound
  playSuccessSound()
  
  // Check completion
  checkWordComplete()
}

// Handle wrong placement
const handleWrongPlacement = (letterIndex: number) => {
  // Play error sound
  playErrorSound()
}

// Highlight correct slot
const highlightCorrectSlot = () => {
  const nextEmptySlotIndex = filledSlots.value.findIndex(slot => slot === null)
  if (nextEmptySlotIndex !== -1) {
    highlightSlot.value = nextEmptySlotIndex
    setTimeout(() => {
      highlightSlot.value = null
    }, 2000)
  }
}

// Auto-fill next letter
const autoFillNextLetter = () => {
  const nextEmptySlotIndex = filledSlots.value.findIndex(slot => slot === null)
  if (nextEmptySlotIndex === -1) return
  
  const expectedLetter = props.word.letters[nextEmptySlotIndex]
  const availableIndex = shuffledLetters.value.findIndex(
    (letter, index) => letter === expectedLetter && !usedLetters.value.includes(index)
  )
  
  if (availableIndex !== -1) {
    handleCorrectPlacement(availableIndex, nextEmptySlotIndex)
  }
}

// Check if word is complete
const checkWordComplete = () => {
  const isComplete = filledSlots.value.every(slot => slot !== null)
  
  if (isComplete && !isCompleted.value) {
    isCompleted.value = true
    
    // Play word pronunciation
    setTimeout(() => {
      playWord()
    }, 300)
    
    // Show celebration
    setTimeout(() => {
      showCelebration.value = true
    }, 800)
    
    // Show sentence
    setTimeout(() => {
      showCelebration.value = false
      showSentence.value = true
      playSentence()
    }, 2500)
    
    // Complete level
    setTimeout(() => {
      emit('complete')
    }, 5000)
  }
}

// Sound effects
const playClickSound = () => {
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (e) {}
}

const playSuccessSound = () => {
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (e) {}
}

const playErrorSound = () => {
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch (e) {}
}
</script>

<style scoped>
.word-scene {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem 1rem 1rem;
  position: relative;
  overflow: visible;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  gap: 0.5rem;
}

/* Word Illustration */
.word-illustration {
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.word-emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 0.3rem;
  animation: floatEmoji 3s ease-in-out infinite;
}

.word-label {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2C3E50;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.play-word-btn {
  background: linear-gradient(135deg, #4ECDC4 0%, #44B09E 100%);
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.play-word-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

.play-word-btn:active {
  transform: scale(0.95);
}

/* Letter Board */
.letter-board {
  width: 100%;
  max-width: 700px;
  margin-bottom: 0.5rem;
}

.drop-slots {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 1rem;
}

.drop-slot {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  border: 3px dashed rgba(255, 217, 61, 0.5);
}

/* Letter image in slot */
.slot-letter-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.slot-letter-img.placeholder {
  opacity: 0.25;
  filter: grayscale(80%);
}

.slot-letter-img.filled {
  opacity: 1;
  filter: none;
  animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.drop-slot.filled {
  border-style: solid;
  border-color: #4ECDC4;
  background: rgba(78, 205, 196, 0.2);
}

.drop-slot.highlight {
  border-color: #FFD93D;
  background: rgba(255, 217, 61, 0.2);
  animation: pulse 1s infinite;
}

.drop-slot.near {
  border-color: #4ECDC4;
  background: rgba(78, 205, 196, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
}

.drop-slot.snap-success {
  animation: snapSuccess 0.4s ease-out;
}

.slot-letter-text {
  font-size: 1.8rem;
  font-weight: bold;
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.4;
}

.slot-placeholder .slot-animal-emoji {
  font-size: 2rem;
}

/* Draggable Letters - Scattered Layout */
.draggable-letters {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: 0.5rem;
  overflow: visible;
}

.draggable-letter {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  cursor: grab;
  z-index: 1;
  touch-action: none;
  transition: none;
}

/* Letter image styles */
.letter-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.draggable-letter:hover .letter-img {
  transform: scale(1.1);
}

/* Floating letter styles */
.floating-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.4));
}

/* Struggling animation when dragging */
.floating-letter.struggling {
  animation: struggle 0.15s ease-in-out infinite alternate;
}

@keyframes struggle {
  0% {
    transform: translate(var(--x, 0), var(--y, 0)) rotate(-8deg) scale(1.1);
  }
  100% {
    transform: translate(var(--x, 0), var(--y, 0)) rotate(8deg) scale(1.05);
  }
}

/* Alternative struggle with translate */
.floating-letter.struggling .floating-img {
  animation: struggleImg 0.12s ease-in-out infinite alternate;
}

@keyframes struggleImg {
  0% {
    transform: rotate(-10deg) scale(1.1);
  }
  100% {
    transform: rotate(10deg) scale(1.05);
  }
}

/* Each letter floats at different times */
.draggable-letter:nth-child(1) { animation-delay: 0s, 0s; }
.draggable-letter:nth-child(2) { animation-delay: 0.15s, 0.4s; }
.draggable-letter:nth-child(3) { animation-delay: 0.3s, 0.8s; }
.draggable-letter:nth-child(4) { animation-delay: 0.45s, 1.2s; }
.draggable-letter:nth-child(5) { animation-delay: 0.6s, 1.6s; }

/* Glow effect on edges */
.draggable-letter::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
  z-index: -1;
}

.draggable-letter:hover:not(.used) {
  transform: scale(1.2) translateY(-8px) !important;
  box-shadow: 
    0 20px 50px rgba(255, 107, 107, 0.5),
    0 0 30px rgba(255, 107, 107, 0.3);
  z-index: 10;
  animation-play-state: paused;
}

.draggable-letter:active:not(.used) {
  cursor: grabbing;
  transform: scale(0.95) !important;
  box-shadow: 
    0 4px 15px rgba(255, 107, 107, 0.3),
    inset 0 2px 5px rgba(0, 0, 0, 0.2);
}

.draggable-letter.used {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.draggable-letter.dragging {
  opacity: 0.3;
  transform: scale(0.9);
}

.draggable-letter.near-target {
  background: linear-gradient(135deg, #4ECDC4 0%, #44B09E 100%);
}

.draggable-letter.shake {
  animation: shake 0.5s ease-in-out;
}

/* Floating Letter (follows cursor) */
.floating-letter {
  position: fixed;
  top: 0;
  left: 0;
  width: 85px;
  height: 85px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
  z-index: 1000;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.05s linear;
  gap: 2px;
}

.floating-animal-emoji {
  font-size: 2.5rem;
}

.floating-letter-text {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Floating letter shapes */
.floating-letter.letter-shape-circle {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #FF9999, #FF6B6B 50%, #FF4444 100%);
}

.floating-letter.letter-shape-square {
  width: 78px;
  height: 88px;
  border-radius: 10px;
  background: linear-gradient(145deg, #5DDEAB 0%, #4ECDC4 40%, #3DBFB7 100%);
}

.floating-letter.letter-shape-rounded {
  width: 80px;
  height: 90px;
  border-radius: 20px;
  background: linear-gradient(145deg, #74B9FF 0%, #0984E3 100%);
}

.floating-letter.letter-shape-star {
  width: 90px;
  height: 90px;
  background: radial-gradient(circle at 40% 40%, #DDA0DD, #BA55D3 50%, #9932CC 100%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.floating-letter.letter-shape-diamond {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, #FFE66D 0%, #FFC800 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

/* Sentence Scene */
.sentence-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.3s ease-out;
}

.sentence-container {
  text-align: center;
  padding: 2rem;
}

.sentence-text {
  font-size: 2.2rem;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}

.sentence-word {
  display: inline-block;
  animation: slideUp 0.4s ease-out both;
}

.sentence-word.keyword {
  color: #FFD93D;
  font-weight: bold;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
}

/* Celebration Overlay */
.celebration-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: none;
  animation: fadeIn 0.3s ease-out;
}

.celebration-content {
  text-align: center;
  position: relative;
}

.stars {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.star {
  display: inline-block;
  animation: starPop 0.5s ease-out both;
  margin: 0 0.3rem;
}

.celebration-text {
  font-size: 3.5rem;
  font-weight: bold;
  color: #FFD93D;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 3px 3px 0px #FF6B6B;
  animation: bounceIn 0.5s ease-out;
}

.confetti-container {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: calc(100% + 100px);
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: confettiFall 2s ease-out forwards;
}

/* Animations */
@keyframes floatEmoji {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Bubble pop-in animation */
@keyframes bubbleIn {
  0% {
    transform: translateY(-80px) scale(0) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: translateY(10px) scale(1.1) rotate(3deg);
    opacity: 1;
  }
  70% {
    transform: translateY(-5px) scale(0.95) rotate(-2deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Continuous gentle floating like bubbles */
@keyframes bubbleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(2deg);
  }
  50% {
    transform: translateY(-3px) rotate(-1deg);
  }
  75% {
    transform: translateY(-10px) rotate(1deg);
  }
}

@keyframes floatIn {
  0% {
    transform: translateY(-50px) rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes snapSuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 30px rgba(78, 205, 196, 0.6);
  }
  100% {
    transform: scale(1.05);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 217, 61, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 217, 61, 0);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes starPop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.4) rotate(200deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(500px) rotate(720deg);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .word-emoji {
    font-size: 5.5rem;
  }
  
  .word-label {
    font-size: 2rem;
  }
  
  .drop-slot {
    width: 55px;
    height: 65px;
    font-size: 1.8rem;
  }
  
  .draggable-letter,
  .floating-letter {
    width: 55px;
    height: 65px;
    font-size: 1.8rem;
  }
  
  .sentence-text {
    font-size: 1.8rem;
  }
  
  .celebration-text {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .word-emoji {
    font-size: 4.5rem;
  }
  
  .word-label {
    font-size: 1.8rem;
  }
  
  .drop-slot {
    width: 50px;
    height: 58px;
    font-size: 1.6rem;
  }
  
  .draggable-letter,
  .floating-letter {
    width: 50px;
    height: 58px;
    font-size: 1.6rem;
  }
  
  .drop-slots {
    gap: 2.5rem;
  }
  
  .draggable-letters {
    gap: 0.5rem;
  }
  
  .sentence-text {
    font-size: 1.5rem;
  }
  
  .celebration-text {
    font-size: 2rem;
  }
}
</style>
