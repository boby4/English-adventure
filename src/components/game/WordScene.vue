<template>
  <div class="word-scene" ref="sceneRef">
    <!-- Top Illustration Area -->
    <div class="word-illustration">
      <div class="emoji-wrapper" :class="[word.animation || 'bounce', { 'celebrating': isCompleted }]" @click="handleEmojiClick">
        <span class="word-emoji">{{ word.emoji }}</span>
      </div>
      <div class="word-label-bar">
        <span class="word-label-text">{{ word.word }}</span>
        <button class="pronounce-btn" @click="playWordAudio" title="Pronounce">
          <span class="speaker-icon">🔊</span>
        </button>
      </div>
    </div>

    <!-- Letter Slots Board (The target houses for letters) -->
    <div class="slots-container">
      <div
        v-for="(letter, index) in word.letters"
        :key="`slot-${index}`"
        class="slot-item"
        :class="{
          'filled': filledSlots[index] !== null,
          'near': nearSlotIndex === index,
          'target-hint': hintSlotIndex === index
        }"
        :ref="el => setSlotRef(el, index)"
      >
        <!-- When Filled: Bright solid animal letter -->
        <img
          v-if="filledSlots[index]"
          :src="`/img/${filledSlots[index]}.png`"
          :alt="filledSlots[index]!"
          class="slot-letter-img filled"
        />

        <!-- When Empty: Translucent ghost outline for kids to match -->
        <img
          v-else
          :src="`/img/${letter}.png`"
          :alt="letter"
          class="slot-letter-img placeholder"
        />
      </div>
    </div>

    <!-- Scattered Letter Monsters Area -->
    <div class="scattered-area" ref="scatterAreaRef">
      <div
        v-for="(letter, index) in shuffledLetters"
        :key="`draggable-${index}`"
        class="scatter-letter"
        :class="{
          'used': usedLetters.includes(index),
          'dragging-source': draggingIndex === index,
          'hint-bounce': hintLetterIndex === index
        }"
        :style="getLetterPlacementStyle(index)"
        @pointerdown="onLetterPointerDown($event, index)"
      >
        <div class="letter-card-body">
          <img :src="`/img/${letter}.png`" :alt="letter" class="letter-img" draggable="false" />
        </div>
      </div>
    </div>

    <!-- Floating Letter Monster while Dragging (With crazy struggling animation & chatter!) -->
    <div
      v-if="draggingIndex !== null"
      class="floating-monster struggling"
      :style="floatingStyle"
    >
      <img
        :src="`/img/${shuffledLetters[draggingIndex]}.png`"
        :alt="shuffledLetters[draggingIndex]"
        class="monster-img"
        draggable="false"
      />
    </div>

    <!-- Celebration Fireworks & Stars -->
    <div v-if="showCelebration" class="celebration-particles">
      <span v-for="i in 18" :key="i" class="sparkle" :style="getSparkleStyle(i)">⭐</span>
    </div>

    <!-- Bright Cartoon Story Dialogue (Shown after word is completed) -->
    <transition name="story-slide">
      <div v-if="showSentence" class="story-modal-overlay">
        <div class="story-card">
          <div class="story-header">
            <span class="story-emoji-hero">{{ word.emoji }}</span>
            <div class="story-badge">Great Job!</div>
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
              <span>🔊 Listen</span>
            </button>
            <button class="continue-btn" @click="handleLevelComplete">
              <span>Next Word ➜</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
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
const dragStartX = ref(0)
const dragStartY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const nearSlotIndex = ref<number | null>(null)
const hintSlotIndex = ref<number | null>(null)
const hintLetterIndex = ref<number | null>(null)

// Endless Reader: Drag chatter interval
let chatterInterval: number | null = null

// Success & Story State
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

const sentenceWords = computed(() => {
  return props.word.sentence.split(' ')
})

function isKeyword(token: string): boolean {
  return token.toLowerCase().includes(props.word.word.toLowerCase())
}

// 浮动字母跟随手指，保持中心对齐
const floatingStyle = computed(() => {
  return {
    transform: `translate3d(${currentX.value - 45}px, ${currentY.value - 45}px, 0)`
  }
})

function setSlotRef(el: any, index: number) {
  if (el) slotRefs.value[index] = el as HTMLElement
}

function getLetterPlacementStyle(index: number) {
  if (usedLetters.value.includes(index)) {
    return { opacity: 0, transform: 'scale(0)', pointerEvents: 'none' as const }
  }
  const pos = letterPositions.value[index]
  if (!pos) return {}
  return {
    left: `${pos.x}%`,
    top: `${pos.y}px`,
    transform: `rotate(${pos.rotate}deg)`
  }
}

function getSparkleStyle(i: number) {
  const left = 8 + (i * 15) % 84
  const top = 18 + (i * 22) % 64
  const delay = (i * 0.07).toFixed(2)
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`
  }
}

// 单词初始化
function initializeWord() {
  clearAllTimers()
  stopChatter()
  filledSlots.value = new Array(props.word.letters.length).fill(null)
  usedLetters.value = []
  isCompleted.value = false
  showCelebration.value = false
  showSentence.value = false
  draggingIndex.value = null
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

  // 计算散落位置（错开网格，避免重叠）
  const count = letters.length
  const cols = Math.min(count, 4)
  const rows = Math.ceil(count / cols)

  letterPositions.value = Array.from({ length: count }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cellW = 85 / cols
    const cellH = 120 / rows
    const x = 7 + col * cellW + Math.random() * (cellW * 0.45)
    const y = 12 + row * cellH + Math.random() * (cellH * 0.35)
    const rotate = (Math.random() - 0.5) * 22
    return { x, y, rotate }
  })

  // 播放开场单词发音
  safeTimeout(() => {
    audioManager.playWord(props.word.word)
  }, 400)

  // 6秒无操作提示
  scheduleIdleHint()
}

let idleHintTimer: number | null = null
function scheduleIdleHint() {
  if (idleHintTimer) clearTimeout(idleHintTimer)
  idleHintTimer = window.setTimeout(() => {
    if (isCompleted.value) return
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
        }, 2500)
      }
    }
  }, 6000)
}

function clearAllTimers() {
  if (idleHintTimer) clearTimeout(idleHintTimer)
  activeTimers.forEach(id => clearTimeout(id))
  activeTimers.length = 0
}

// 触摸/按下开始拖拽（Endless Reader 核心手感）
function onLetterPointerDown(e: PointerEvent, index: number) {
  if (usedLetters.value.includes(index) || isCompleted.value) return

  e.preventDefault()
  const letter = shuffledLetters.value[index]
  draggingIndex.value = index
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  currentX.value = e.clientX
  currentY.value = e.clientY
  nearSlotIndex.value = null

  // 1. 抓起气泡音
  audioManager.playPop()

  // 2. 立即读出标准清晰字母读音
  audioManager.playLetter(letter)

  // 3. 拖拽过程中持续怪叫 (每 650ms 重复一次字母声音)
  stopChatter()
  chatterInterval = window.setInterval(() => {
    if (draggingIndex.value !== null) {
      audioManager.playLetter(letter, { cancel: false })
    }
  }, 650)

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (draggingIndex.value === null) return

  currentX.value = e.clientX
  currentY.value = e.clientY

  // 检测是否靠近正确槽位
  checkMagneticSnap(e.clientX, e.clientY)
}

// 磁吸检测（支持重复字母匹配任意同字母的空槽位）
function checkMagneticSnap(x: number, y: number) {
  if (draggingIndex.value === null) return
  const letter = shuffledLetters.value[draggingIndex.value]

  let bestIndex = -1
  let minDistance = 90 // 宽松磁吸距离，适合低幼儿童

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

  stopChatter()

  // 如果松手在吸附槽位附近
  if (nearSlotIndex.value !== null) {
    const slotIdx = nearSlotIndex.value
    placeLetterToSlot(letterIndex, slotIdx, letter)
  } else {
    // 未放置到槽位，字母像果冻一样 Duang 弹回原处
    audioManager.playBoing()
  }

  cleanupDrag()
}

function stopChatter() {
  if (chatterInterval) {
    clearInterval(chatterInterval)
    chatterInterval = null
  }
}

function cleanupDrag() {
  stopChatter()
  draggingIndex.value = null
  nearSlotIndex.value = null

  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerUp)
}

// 放置字母到槽位
function placeLetterToSlot(letterIndex: number, slotIndex: number, letter: string) {
  filledSlots.value[slotIndex] = letter
  usedLetters.value.push(letterIndex)

  // 播放清脆入槽音并再次清晰发音
  audioManager.playSnap()
  audioManager.playLetter(letter)

  // 槽位弹性震动动画
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

  // 1. 完整大声读出单词
  safeTimeout(() => {
    audioManager.playWord(props.word.word)
    showCelebration.value = true
  }, 400)

  // 2. 展开明亮漫画卡片，朗读完整句子
  safeTimeout(() => {
    showSentence.value = true
    audioManager.playSentence(props.word.sentence)
  }, 1700)

  // 3. 自动延时进入下一关（如果孩子没有主动点下一步）
  safeTimeout(() => {
    handleLevelComplete()
  }, 7000)
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
  padding: 0.5rem 1rem 1.2rem;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emoji-wrapper:hover {
  transform: scale(1.1);
}

.emoji-wrapper.celebrating {
  animation: heroJump 0.6s infinite alternate ease-in-out;
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
  margin-top: 0.3rem;
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

/* Drop Slots Board (Target Houses) */
.slots-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.6rem 0;
  width: 100%;
  max-width: 650px;
  flex-wrap: wrap;
}

.slot-item {
  width: clamp(70px, 17vw, 105px);
  height: clamp(70px, 17vw, 105px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.45);
  border: 3.5px dashed rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Empty placeholder: translucent letter outline for matching */
.slot-letter-img.placeholder {
  width: 78%;
  height: 78%;
  object-fit: contain;
  opacity: 0.28;
  filter: grayscale(80%) drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* Magnetic Near Attraction (When dragging monster comes close) */
.slot-item.near {
  transform: scale(1.18);
  background: rgba(46, 213, 115, 0.25);
  border-color: #2ed573;
  border-style: solid;
  box-shadow: 0 0 25px rgba(46, 213, 115, 0.5);
}

/* Filled Slot */
.slot-item.filled {
  border-style: solid;
  border-color: #2ed573;
  background: white;
  box-shadow: 0 8px 24px rgba(46, 213, 115, 0.3);
}

.slot-letter-img.filled {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.16));
  animation: snapBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slot-item.target-hint {
  border-color: #ffa502;
  background: rgba(255, 165, 2, 0.3);
  animation: slotWiggle 0.6s infinite;
}

/* Scattered Letter Area */
.scattered-area {
  position: relative;
  width: 100%;
  max-width: 650px;
  height: 220px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.4);
}

.scatter-letter {
  position: absolute;
  width: clamp(70px, 17vw, 98px);
  height: clamp(70px, 17vw, 98px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
  animation: letterIdleFloat 3s ease-in-out infinite alternate;
}

.scatter-letter:nth-child(2) { animation-delay: 0.4s; }
.scatter-letter:nth-child(3) { animation-delay: 0.8s; }
.scatter-letter:nth-child(4) { animation-delay: 1.2s; }
.scatter-letter:nth-child(5) { animation-delay: 1.6s; }

.scatter-letter:active {
  cursor: grabbing;
}

.scatter-letter.dragging-source {
  opacity: 0.25;
  transform: scale(0.9);
}

.scatter-letter.hint-bounce {
  animation: letterHintBounce 0.5s infinite alternate;
}

.letter-card-body {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s ease;
}

.scatter-letter:hover .letter-card-body {
  transform: scale(1.1);
}

.letter-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Floating Monster (Endless Reader struggling animation while being dragged!) */
.floating-monster {
  position: fixed;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  pointer-events: none;
  z-index: 1000;
  will-change: transform;
}

.floating-monster.struggling .monster-img {
  animation: monsterStruggle 0.12s ease-in-out infinite alternate;
}

.monster-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.35));
}

/* Endless Reader Monster Wiggle Animation */
@keyframes monsterStruggle {
  0% {
    transform: rotate(-14deg) scale(1.22);
  }
  100% {
    transform: rotate(14deg) scale(1.15);
  }
}

@keyframes letterIdleFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}

@keyframes letterHintBounce {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-14px) scale(1.1); }
}

@keyframes slotWiggle {
  0%, 100% { transform: scale(1) rotate(0); }
  25% { transform: scale(1.08) rotate(-4deg); }
  75% { transform: scale(1.08) rotate(4deg); }
}

@keyframes snapBounce {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes heroJump {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-20px) scale(1.1); }
}

.pop-snap {
  animation: slotPopSnap 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slotPopSnap {
  0% { transform: scale(0.9); }
  60% { transform: scale(1.22); }
  100% { transform: scale(1); }
}

/* Bright Story Card (No dark screen!) */
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

@media (max-width: 480px) {
  .word-emoji { font-size: 4.2rem; }
  .word-label-text { font-size: 1.8rem; }
  .story-sentence { font-size: 1.6rem; }
  .story-card { padding: 1.8rem 1.2rem; }
  .scattered-area { height: 180px; }
}
</style>
