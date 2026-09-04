<template>
  <div class="word-scene" ref="sceneRef">
    <!-- Top Illustration Area -->
    <div class="word-illustration">
      <div class="emoji-wrapper" :class="[word.animation || 'bounce']" @click="handleEmojiClick">
        <span class="word-emoji">{{ word.emoji }}</span>
      </div>
      <div class="word-label-bar">
        <span class="word-label-text">{{ word.word }}</span>
        <button class="pronounce-btn" @click="playWordAudio" title="Pronounce">
          <span class="speaker-icon">🔊</span>
        </button>
      </div>
    </div>

    <!-- Letter Slots Board -->
    <div class="slots-container">
      <div
        v-for="(letter, index) in word.letters"
        :key="`slot-${index}`"
        class="slot-item"
        :class="{
          'filled': filledSlots[index] !== null,
          'target-hint': hintSlotIndex === index,
          'magnetic-near': nearSlotIndex === index
        }"
        :ref="el => setSlotRef(el, index)"
      >
        <!-- Filled Letter -->
        <transition name="pop-in">
          <div v-if="filledSlots[index]" class="filled-letter-wrapper">
            <img :src="`/img/${filledSlots[index]}.png`" :alt="filledSlots[index]!" class="slot-letter-img" />
          </div>
        </transition>

        <!-- Empty Slot Placeholder (Gentle dotted outline, no spoiler) -->
        <div v-if="!filledSlots[index]" class="slot-empty-indicator">
          <span class="slot-dot">•</span>
        </div>
      </div>
    </div>

    <!-- Scattered Candies/Letters Area -->
    <div class="scattered-area" ref="scatterAreaRef">
      <div
        v-for="(letter, index) in shuffledLetters"
        :key="`draggable-${index}`"
        class="scatter-letter"
        :class="{
          'used': usedLetters.includes(index),
          'dragging': draggingIndex === index,
          'hint-bounce': hintLetterIndex === index
        }"
        :style="getLetterPlacementStyle(index)"
        @pointerdown="onLetterPointerDown($event, index)"
      >
        <div class="letter-inner-card">
          <img :src="`/img/${letter}.png`" :alt="letter" class="scatter-img" draggable="false" />
        </div>
      </div>
    </div>

    <!-- Floating Letter for Dragging -->
    <div
      v-if="draggingIndex !== null"
      class="floating-letter"
      :style="floatingStyle"
    >
      <img
        :src="`/img/${shuffledLetters[draggingIndex]}.png`"
        :alt="shuffledLetters[draggingIndex]"
        class="floating-img"
        draggable="false"
      />
    </div>

    <!-- Flying Letter Animation Clone for Tap-To-Place -->
    <div
      v-if="flyingLetter"
      class="flying-letter"
      :style="flyingLetterStyle"
    >
      <img :src="`/img/${flyingLetter.char}.png`" :alt="flyingLetter.char" class="flying-img" />
    </div>

    <!-- Bright Cartoon Story Dialogue (After Word Complete) -->
    <transition name="story-slide">
      <div v-if="showSentence" class="story-modal-overlay">
        <div class="story-card">
          <div class="story-header">
            <span class="story-emoji-hero">{{ word.emoji }}</span>
            <div class="story-badge">Word Master!</div>
          </div>

          <div class="story-sentence">
            <span
              v-for="(part, idx) in sentenceWords"
              :key="idx"
              class="sentence-token"
              :class="{ 'keyword': isKeyword(part) }"
            >
              {{ part }}
            </span>
          </div>

          <div class="story-actions">
            <button class="repeat-btn" @click="playSentenceAudio">
              <span>🔊 Listen Again</span>
            </button>
            <button class="continue-btn" @click="handleLevelComplete">
              <span>Next Word ➜</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Celebration Confetti -->
    <div v-if="showCelebration" class="celebration-particles">
      <span v-for="i in 18" :key="i" class="sparkle" :style="getSparkleStyle(i)">⭐</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { WordLevel } from '../../data/levels'
import { audioManager } from '../../utils/audio'

interface Props {
  word: WordLevel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

// Refs
const sceneRef = ref<HTMLElement | null>(null)
const scatterAreaRef = ref<HTMLElement | null>(null)
const slotRefs = ref<(HTMLElement | null)[]>([])

// State
const filledSlots = ref<(string | null)[]>([])
const usedLetters = ref<number[]>([])
const shuffledLetters = ref<string[]>([])
const letterPositions = ref<{ x: number; y: number; rotate: number }[]>([])

// Dragging & Interaction State
const draggingIndex = ref<number | null>(null)
const dragPointerId = ref<number | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const dragDistance = ref(0)
const nearSlotIndex = ref<number | null>(null)
const hintSlotIndex = ref<number | null>(null)
const hintLetterIndex = ref<number | null>(null)

// Tap-To-Fly Animation State
interface FlyingLetterData {
  char: string
  startX: number
  startY: number
  targetX: number
  targetY: number
  progress: number
}
const flyingLetter = ref<FlyingLetterData | null>(null)

// Success & Story
const isCompleted = ref(false)
const showCelebration = ref(false)
const showSentence = ref(false)

// Active Timers for safe cleanup
const activeTimers: number[] = []
function safeTimeout(fn: () => void, ms: number) {
  const tid = window.setTimeout(fn, ms)
  activeTimers.push(tid)
  return tid
}

// Sentence computation
const sentenceWords = computed(() => {
  return props.word.sentence.split(' ')
})

function isKeyword(token: string): boolean {
  return token.toLowerCase().includes(props.word.word.toLowerCase())
}

const floatingStyle = computed(() => {
  return {
    transform: `translate3d(${currentX.value - 45}px, ${currentY.value - 45}px, 0) scale(1.25)`,
    opacity: 0.95
  }
})

const flyingLetterStyle = computed(() => {
  if (!flyingLetter.value) return {}
  const { startX, startY, targetX, targetY } = flyingLetter.value
  return {
    '--start-x': `${startX}px`,
    '--start-y': `${startY}px`,
    '--target-x': `${targetX}px`,
    '--target-y': `${targetY}px`
  }
})

function setSlotRef(el: any, index: number) {
  if (el) slotRefs.value[index] = el as HTMLElement
}

function getLetterPlacementStyle(index: number) {
  if (usedLetters.value.includes(index)) {
    return { opacity: 0, transform: 'scale(0)', pointerEvents: 'none' as const }
  }
  if (draggingIndex.value === index) {
    return { opacity: 0 }
  }
  const pos = letterPositions.value[index]
  if (!pos) return {}
  return {
    left: `${pos.x}%`,
    top: `${pos.y}px`,
    transform: `rotate(${pos.rotate}deg)`
  }
}

// Sparkles style generator
function getSparkleStyle(i: number) {
  const left = 10 + (i * 15) % 80
  const top = 20 + (i * 22) % 60
  const delay = (i * 0.08).toFixed(2)
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`
  }
}

// 单词初始化
function initializeWord() {
  clearAllTimers()
  filledSlots.value = new Array(props.word.letters.length).fill(null)
  usedLetters.value = []
  isCompleted.value = false
  showCelebration.value = false
  showSentence.value = false
  draggingIndex.value = null
  flyingLetter.value = null
  nearSlotIndex.value = null
  hintSlotIndex.value = null
  hintLetterIndex.value = null

  // 打乱字母
  const letters = [...props.word.letters]
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  shuffledLetters.value = letters

  // 计算散落位置（网格分布，避免重叠）
  const count = letters.length
  const cols = Math.min(count, 4)
  const rows = Math.ceil(count / cols)

  letterPositions.value = Array.from({ length: count }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cellW = 85 / cols
    const cellH = 130 / rows
    const x = 8 + col * cellW + Math.random() * (cellW * 0.5)
    const y = 15 + row * cellH + Math.random() * (cellH * 0.4)
    const rotate = (Math.random() - 0.5) * 24
    return { x, y, rotate }
  })

  // 播放开场单词发音
  safeTimeout(() => {
    audioManager.playWord(props.word.word)
  }, 400)

  // 5秒无操作提示
  scheduleIdleHint()
}

let idleHintTimer: number | null = null
function scheduleIdleHint() {
  if (idleHintTimer) clearTimeout(idleHintTimer)
  idleHintTimer = window.setTimeout(() => {
    if (isCompleted.value) return
    // 找到第一个未填的槽位
    const emptyIndex = filledSlots.value.findIndex(s => s === null)
    if (emptyIndex !== -1) {
      const neededChar = props.word.letters[emptyIndex]
      const sourceIndex = shuffledLetters.value.findIndex(
        (char, idx) => char === neededChar && !usedLetters.value.includes(idx)
      )
      if (sourceIndex !== -1) {
        hintSlotIndex.value = emptyIndex
        hintLetterIndex.value = sourceIndex
        audioManager.playPop()
        safeTimeout(() => {
          hintSlotIndex.value = null
          hintLetterIndex.value = null
        }, 2200)
      }
    }
  }, 5000)
}

function clearAllTimers() {
  if (idleHintTimer) clearTimeout(idleHintTimer)
  activeTimers.forEach(id => clearTimeout(id))
  activeTimers.length = 0
}

// 触摸/按下
function onLetterPointerDown(e: PointerEvent, index: number) {
  if (usedLetters.value.includes(index) || isCompleted.value) return

  const letter = shuffledLetters.value[index]
  draggingIndex.value = index
  dragPointerId.value = e.pointerId
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  currentX.value = e.clientX
  currentY.value = e.clientY
  dragDistance.value = 0
  nearSlotIndex.value = null

  // 立即发出自然拼读萌音和气泡音
  audioManager.playPop()
  audioManager.playPhonics(letter)

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (draggingIndex.value === null) return

  currentX.value = e.clientX
  currentY.value = e.clientY

  const dx = e.clientX - dragStartX.value
  const dy = e.clientY - dragStartY.value
  dragDistance.value = Math.sqrt(dx * dx + dy * dy)

  // 只有移动超过 10px 才做磁吸判定
  if (dragDistance.value > 10) {
    checkMagneticSnap(e.clientX, e.clientY)
  }
}

// 磁吸检测（支持重复字母放到任意合法的空槽位）
function checkMagneticSnap(x: number, y: number) {
  if (draggingIndex.value === null) return
  const letter = shuffledLetters.value[draggingIndex.value]

  let bestIndex = -1
  let minDistance = 90 // 宽松磁吸距离，方便幼儿

  slotRefs.value.forEach((slot, idx) => {
    if (!slot || filledSlots.value[idx] !== null) return
    // 检查该槽位是否需要这个字母
    if (props.word.letters[idx] !== letter) return

    const rect = slot.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))

    if (dist < minDistance) {
      minDistance = dist
      bestIndex = idx
    }
  })

  nearSlotIndex.value = bestIndex !== -1 ? bestIndex : null
}

function onPointerUp(e: PointerEvent) {
  if (draggingIndex.value === null) return

  const letterIndex = draggingIndex.value
  const letter = shuffledLetters.value[letterIndex]
  const isTap = dragDistance.value <= 10

  // 1. 如果是轻触（Tap）—— 触发点选自动飞入！
  if (isTap) {
    handleTapPlacement(letterIndex, letter)
    cleanupDrag()
    return
  }

  // 2. 如果是拖拽放置
  if (nearSlotIndex.value !== null) {
    const slotIdx = nearSlotIndex.value
    // 放置成功
    placeLetterToSlot(letterIndex, slotIdx, letter)
  } else {
    // 未放置到正确位置，果冻弹回
    audioManager.playBoing()
  }

  cleanupDrag()
}

function cleanupDrag() {
  draggingIndex.value = null
  dragPointerId.value = null
  nearSlotIndex.value = null
  dragDistance.value = 0

  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerUp)
}

// 轻触自动飞入逻辑 (Tap-To-Fly)
function handleTapPlacement(letterIndex: number, letter: string) {
  // 查找第一个匹配且为空的槽位
  const targetSlotIdx = filledSlots.value.findIndex(
    (slot, idx) => slot === null && props.word.letters[idx] === letter
  )

  if (targetSlotIdx === -1) {
    // 没有合适槽位，弹动提示
    audioManager.playBoing()
    return
  }

  const slotEl = slotRefs.value[targetSlotIdx]
  const scatterEl = scatterAreaRef.value
  if (!slotEl || !scatterEl) {
    // 兜底直接放置
    placeLetterToSlot(letterIndex, targetSlotIdx, letter)
    return
  }

  const targetRect = slotEl.getBoundingClientRect()
  const startX = currentX.value
  const startY = currentY.value
  const targetX = targetRect.left + targetRect.width / 2
  const targetY = targetRect.top + targetRect.height / 2

  // 启动飞行动效
  flyingLetter.value = {
    char: letter,
    startX,
    startY,
    targetX,
    targetY,
    progress: 0
  }

  usedLetters.value.push(letterIndex)
  audioManager.playWhoosh()

  safeTimeout(() => {
    flyingLetter.value = null
    filledSlots.value[targetSlotIdx] = letter
    audioManager.playSnap()
    checkComplete()
  }, 320)
}

// 放置字母并检查通关
function placeLetterToSlot(letterIndex: number, slotIndex: number, letter: string) {
  filledSlots.value[slotIndex] = letter
  usedLetters.value.push(letterIndex)
  audioManager.playSnap()

  // 槽位弹性震动
  const slotEl = slotRefs.value[slotIndex]
  if (slotEl) {
    slotEl.classList.add('pop-snap')
    safeTimeout(() => slotEl.classList.remove('pop-snap'), 400)
  }

  checkComplete()
}

// 检查是否全部拼完
function checkComplete() {
  const allFilled = filledSlots.value.every(s => s !== null)
  if (!allFilled || isCompleted.value) return

  isCompleted.value = true
  audioManager.playSuccess()

  // 1. 读出整个单词
  safeTimeout(() => {
    audioManager.playWord(props.word.word)
    showCelebration.value = true
  }, 350)

  // 2. 展开生动漫画卡片，朗读完整句子
  safeTimeout(() => {
    showSentence.value = true
    audioManager.playSentence(props.word.sentence)
  }, 1600)

  // 3. 自动延时进入下一关（如果幼儿未点击下一步按钮）
  safeTimeout(() => {
    handleLevelComplete()
  }, 6500)
}

function handleLevelComplete() {
  emit('complete')
}

function playWordAudio() {
  audioManager.playWord(props.word.word)
}

function playSentenceAudio() {
  audioManager.playSentence(props.word.sentence)
}

function handleEmojiClick() {
  audioManager.playPop()
  audioManager.playWord(props.word.word)
}

watch(
  () => props.word,
  () => {
    initializeWord()
  }
)

onMounted(() => {
  initializeWord()
})

onUnmounted(() => {
  clearAllTimers()
  cleanupDrag()
  audioManager.stopAllSpeech()
})
</script>

<style scoped>
.word-scene {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 1.5rem;
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

/* Illustration Header */
.word-illustration {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.2rem;
}

.emoji-wrapper {
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emoji-wrapper:hover {
  transform: scale(1.1);
}

.word-emoji {
  font-size: 5.5rem;
  display: block;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

.word-label-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  padding: 0.35rem 1.4rem;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 0.4rem;
}

.word-label-text {
  font-size: 2.2rem;
  font-weight: 900;
  font-family: 'Comic Sans MS', cursive;
  color: #2c3e50;
  letter-spacing: 2px;
}

.pronounce-btn {
  background: linear-gradient(135deg, #10ac84, #1dd1a1);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(16, 172, 132, 0.3);
  transition: transform 0.2s;
}

.pronounce-btn:hover {
  transform: scale(1.1);
}

.speaker-icon {
  font-size: 1.1rem;
}

/* Drop Slots Board */
.slots-container {
  display: flex;
  justify-content: center;
  gap: 0.9rem;
  margin: 0.8rem 0;
  width: 100%;
  max-width: 650px;
  flex-wrap: wrap;
}

.slot-item {
  width: clamp(65px, 16vw, 100px);
  height: clamp(65px, 16vw, 100px);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.4);
  border: 3.5px dashed rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slot-item.filled {
  border-style: solid;
  border-color: #2ed573;
  background: white;
  box-shadow: 0 8px 20px rgba(46, 213, 115, 0.25);
}

.slot-item.target-hint {
  border-color: #ffa502;
  background: rgba(255, 165, 2, 0.25);
  animation: slotWiggle 0.6s infinite;
}

.slot-item.magnetic-near {
  border-color: #ff4757;
  transform: scale(1.12);
  background: rgba(255, 71, 87, 0.2);
  box-shadow: 0 0 25px rgba(255, 71, 87, 0.4);
}

.slot-empty-indicator {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.filled-letter-wrapper {
  width: 85%;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-letter-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

/* Scattered Letters Area */
.scattered-area {
  position: relative;
  width: 100%;
  max-width: 650px;
  height: 220px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.4);
}

.scatter-letter {
  position: absolute;
  width: clamp(68px, 17vw, 95px);
  height: clamp(68px, 17vw, 95px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.scatter-letter:active {
  cursor: grabbing;
}

.scatter-letter.hint-bounce {
  animation: letterBounce 0.6s infinite alternate;
}

.letter-inner-card {
  width: 100%;
  height: 100%;
  border-radius: 22px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s ease;
}

.scatter-letter:hover .letter-inner-card {
  transform: scale(1.08);
}

.scatter-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Floating Letter (Drag跟随) */
.floating-letter {
  position: fixed;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  pointer-events: none;
  z-index: 1000;
  will-change: transform;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.25));
}

.floating-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Flying Letter (Tap to place) */
.flying-letter {
  position: fixed;
  top: 0;
  left: 0;
  width: 85px;
  height: 85px;
  pointer-events: none;
  z-index: 999;
  animation: flyToSlot 0.32s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.flying-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Bright Cartoon Story Dialogue (Replaces dark screen) */
.story-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.story-card {
  background: white;
  border-radius: 36px;
  padding: 2.2rem 1.8rem;
  max-width: 480px;
  width: 92%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 6px #ffeaa7;
  text-align: center;
  animation: popStory 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.story-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.story-emoji-hero {
  font-size: 5rem;
  animation: heroHop 1.2s infinite ease-in-out;
}

.story-badge {
  background: linear-gradient(135deg, #ff9f43, #ee5253);
  color: white;
  font-family: 'Comic Sans MS', cursive;
  font-size: 1.1rem;
  font-weight: 900;
  padding: 0.3rem 1.2rem;
  border-radius: 20px;
}

.story-sentence {
  font-family: 'Comic Sans MS', cursive;
  font-size: 2rem;
  font-weight: bold;
  color: #2f3542;
  margin-bottom: 1.8rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.sentence-token.keyword {
  color: #ff4757;
  transform: scale(1.15);
  text-decoration: underline;
  text-decoration-color: #ffd32a;
}

.story-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.repeat-btn {
  background: #f1f2f6;
  border: 2px solid #ced6e0;
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  cursor: pointer;
  color: #2f3542;
  transition: transform 0.2s;
}

.repeat-btn:hover {
  transform: scale(1.05);
}

.continue-btn {
  background: linear-gradient(135deg, #10ac84, #1dd1a1);
  border: none;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  font-family: 'Comic Sans MS', cursive;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(29, 209, 161, 0.4);
  transition: transform 0.2s;
}

.continue-btn:hover {
  transform: scale(1.06);
}

/* Confetti Sparkles */
.celebration-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
}

.sparkle {
  position: absolute;
  font-size: 2.2rem;
  animation: sparkleTwinkle 1.2s infinite ease-in-out;
}

/* Animations */
@keyframes flyToSlot {
  0% {
    transform: translate3d(var(--start-x), var(--start-y), 0) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translate3d(var(--target-x), var(--target-y), 0) scale(0.85);
    opacity: 1;
  }
}

@keyframes slotWiggle {
  0%, 100% { transform: scale(1) rotate(0); }
  25% { transform: scale(1.06) rotate(-3deg); }
  75% { transform: scale(1.06) rotate(3deg); }
}

@keyframes letterBounce {
  from { transform: translateY(0); }
  to { transform: translateY(-12px); }
}

@keyframes popStory {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes heroHop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

@keyframes sparkleTwinkle {
  0%, 100% { transform: scale(0.4) rotate(0); opacity: 0.2; }
  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
}

.pop-snap {
  animation: snapPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes snapPop {
  0% { transform: scale(0.85); }
  60% { transform: scale(1.22); }
  100% { transform: scale(1); }
}

@media (max-width: 480px) {
  .word-emoji {
    font-size: 4.2rem;
  }
  .word-label-text {
    font-size: 1.8rem;
  }
  .story-sentence {
    font-size: 1.6rem;
  }
  .story-card {
    padding: 1.8rem 1.2rem;
  }
  .scattered-area {
    height: 180px;
  }
}
</style>
