<template>
  <div class="connect-game-container">
    <!-- Target Words Bar -->
    <div class="targets-bar">
      <div
        v-for="target in level.targets"
        :key="target.id"
        class="target-card"
        :class="{ 'is-completed': completedWordIds.has(target.id) }"
        :style="{ '--target-color': target.color }"
        @click="audioManager.playWord(target.word)"
      >
        <div class="target-badge">
          <span class="avatar">{{ target.emoji }}</span>
          <span class="arrow">➜</span>
          <span class="destination">{{ target.targetEmoji }}</span>
        </div>
        <div class="target-word">
          <span
            v-for="(char, idx) in target.letters"
            :key="idx"
            class="word-char"
            :class="{ 'matched': isCharMatched(target.id, idx) }"
          >
            {{ char }}
          </span>
        </div>
        <span v-if="completedWordIds.has(target.id)" class="done-check">✓</span>
      </div>
    </div>

    <!-- The Playable Grid -->
    <div
      class="connect-grid"
      ref="gridRef"
      :style="gridContainerStyle"
      @pointerdown="handleGridPointerDown"
    >
      <!-- Grid cells -->
      <div
        v-for="cell in flatGrid"
        :key="`${cell.row}-${cell.col}`"
        class="grid-cell"
        :class="{
          'obstacle': cell.isObstacle,
          'start-cell': cell.isStart,
          'end-cell': cell.isEnd,
          'in-current-path': isInCurrentPath(cell.row, cell.col),
          'in-completed-path': isCellInCompletedPath(cell.row, cell.col)
        }"
        :style="getCellStyle(cell)"
        :data-row="cell.row"
        :data-col="cell.col"
      >
        <!-- Obstacle -->
        <span v-if="cell.isObstacle" class="obstacle-icon">🪨</span>

        <!-- Letter Cell -->
        <div v-else class="cell-content">
          <!-- Start animal avatar -->
          <div v-if="cell.isStart" class="cell-start-badge">
            <span class="cell-avatar">{{ cell.startEmoji }}</span>
          </div>

          <!-- End goal icon -->
          <div v-else-if="cell.isEnd" class="cell-end-badge">
            <span class="cell-goal">{{ cell.endEmoji }}</span>
          </div>

          <!-- Letter Character -->
          <span class="cell-letter" :class="{ 'highlight': isCellActive(cell.row, cell.col) }">
            {{ cell.letter }}
          </span>
        </div>
      </div>

      <!-- SVG Drawing Layer -->
      <svg class="lines-svg" :width="svgSize" :height="svgSize">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Completed Paths -->
        <g v-for="cp in completedPaths" :key="cp.targetId" class="completed-group">
          <!-- Outer glow line -->
          <path
            :d="generateSvgPath(cp.positions)"
            :stroke="cp.color"
            stroke-width="14"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            opacity="0.35"
          />
          <!-- Core solid line -->
          <path
            :d="generateSvgPath(cp.positions)"
            :stroke="cp.color"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            class="completed-line-anim"
          />
        </g>

        <!-- Current Drawing Path -->
        <g v-if="activeTarget && currentDrawingPositions.length > 0">
          <path
            :d="generateSvgPath(currentDrawingPositions)"
            :stroke="activeTarget.color"
            stroke-width="12"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            opacity="0.4"
          />
          <path
            :d="generateSvgPath(currentDrawingPositions)"
            :stroke="activeTarget.color"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            class="active-drawing-line"
          />
          <!-- Pointer rubber-band line to finger -->
          <line
            v-if="fingerPoint && currentDrawingPositions.length > 0"
            :x1="lastPointCoord.x"
            :y1="lastPointCoord.y"
            :x2="fingerPoint.x"
            :y2="fingerPoint.y"
            :stroke="activeTarget.color"
            stroke-width="6"
            stroke-dasharray="6,6"
            stroke-linecap="round"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>

    <!-- Quick Tooltip / Reset hint -->
    <div class="grid-hint">
      <span>💡 按住动物，顺着字母滑动到目标物品吧！点击已连成的线可撤销。</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ConnectLevel, Position, WordPathTarget, GridCellData } from '../../data/connectLevels'
import { audioManager } from '../../utils/audio'

interface Props {
  level: ConnectLevel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

const gridRef = ref<HTMLElement | null>(null)

// 计算格子大小（手机与大屏自适应）
const cellSize = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 480) {
    if (props.level.gridSize >= 5) return 58
    if (props.level.gridSize === 4) return 68
    return 80
  }
  if (props.level.gridSize >= 5) return 66
  if (props.level.gridSize === 4) return 78
  return 92
})

const cellGap = 10

const svgSize = computed(() => {
  return props.level.gridSize * cellSize.value + (props.level.gridSize - 1) * cellGap
})

const gridContainerStyle = computed(() => ({
  width: `${svgSize.value}px`,
  height: `${svgSize.value}px`
}))

const flatGrid = computed(() => {
  return props.level.grid.flat()
})

// 状态管理
interface CompletedPathData {
  targetId: string
  color: string
  positions: Position[]
}

const completedPaths = ref<CompletedPathData[]>([])
const completedWordIds = computed(() => new Set(completedPaths.value.map(p => p.targetId)))

const isDrawing = ref(false)
const activeTarget = ref<WordPathTarget | null>(null)
const currentDrawingPositions = ref<Position[]>([])
const fingerPoint = ref<{ x: number; y: number } | null>(null)

// 计算当前末端坐标
const lastPointCoord = computed(() => {
  if (currentDrawingPositions.value.length === 0) return { x: 0, y: 0 }
  const last = currentDrawingPositions.value[currentDrawingPositions.value.length - 1]
  return getCellCenter(last.row, last.col)
})

function getCellCenter(row: number, col: number) {
  return {
    x: col * (cellSize.value + cellGap) + cellSize.value / 2,
    y: row * (cellSize.value + cellGap) + cellSize.value / 2
  }
}

function getCellStyle(cell: GridCellData) {
  return {
    left: `${cell.col * (cellSize.value + cellGap)}px`,
    top: `${cell.row * (cellSize.value + cellGap)}px`,
    width: `${cellSize.value}px`,
    height: `${cellSize.value}px`
  }
}

function isCellInCompletedPath(row: number, col: number): boolean {
  return completedPaths.value.some(p => p.positions.some(pos => pos.row === row && pos.col === col))
}

function isInCurrentPath(row: number, col: number): boolean {
  return currentDrawingPositions.value.some(pos => pos.row === row && pos.col === col)
}

function isCellActive(row: number, col: number): boolean {
  return isInCurrentPath(row, col) || isCellInCompletedPath(row, col)
}

function isCharMatched(targetId: string, charIdx: number): boolean {
  if (completedWordIds.value.has(targetId)) return true
  if (activeTarget.value && activeTarget.value.id === targetId) {
    return charIdx < currentDrawingPositions.value.length
  }
  return false
}

// 生成平滑的 SVG 路径
function generateSvgPath(positions: Position[]): string {
  if (!positions || positions.length === 0) return ''
  const points = positions.map(pos => getCellCenter(pos.row, pos.col))
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`
  }

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`
  }
  return d
}

// 查找触摸点所在的单元格
function getCellFromCoordinates(clientX: number, clientY: number): Position | null {
  if (!gridRef.value) return null
  const rect = gridRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top

  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null

  const stride = cellSize.value + cellGap
  const col = Math.floor(x / stride)
  const row = Math.floor(y / stride)

  if (row >= 0 && row < props.level.gridSize && col >= 0 && col < props.level.gridSize) {
    // 确保落在单元格主体内（避免点击空隙）
    const cellX = col * stride
    const cellY = row * stride
    if (x >= cellX && x <= cellX + cellSize.value && y >= cellY && y <= cellY + cellSize.value) {
      return { row, col }
    }
  }
  return null
}

// 开始滑动手势
function handleGridPointerDown(e: PointerEvent) {
  const pos = getCellFromCoordinates(e.clientX, e.clientY)
  if (!pos) return

  const cell = props.level.grid[pos.row][pos.col]
  if (cell.isObstacle) return

  // 1. 如果点击了已完成的线条，允许撤销该条路径重新画
  const completedIdx = completedPaths.value.findIndex(p =>
    p.positions.some(pPos => pPos.row === pos.row && pPos.col === pos.col)
  )
  if (completedIdx >= 0) {
    audioManager.playBoing()
    completedPaths.value.splice(completedIdx, 1)
    return
  }

  // 2. 检查是否点在某个未完成单词的起点上
  const target = props.level.targets.find(
    t => !completedWordIds.value.has(t.id) && t.path[0].row === pos.row && t.path[0].col === pos.col
  )

  if (!target) return

  // 激活连线
  isDrawing.value = true
  activeTarget.value = target
  currentDrawingPositions.value = [pos]

  const rect = gridRef.value?.getBoundingClientRect()
  if (rect) {
    fingerPoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  audioManager.playPop()
  audioManager.playPhonics(cell.letter)

  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
  document.addEventListener('pointercancel', handlePointerUp)
}

// 手指滑动检测
function handlePointerMove(e: PointerEvent) {
  if (!isDrawing.value || !activeTarget.value || !gridRef.value) return

  const rect = gridRef.value.getBoundingClientRect()
  fingerPoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }

  const pos = getCellFromCoordinates(e.clientX, e.clientY)
  if (!pos) return

  const currentPath = currentDrawingPositions.value
  const lastPos = currentPath[currentPath.length - 1]

  // 如果手指回到上一步，支持倒退撤销
  if (currentPath.length > 1) {
    const prevPos = currentPath[currentPath.length - 2]
    if (pos.row === prevPos.row && pos.col === prevPos.col) {
      currentPath.pop()
      audioManager.playPop()
      return
    }
  }

  // 检查是否已经在当前路径里
  if (currentPath.some(p => p.row === pos.row && p.col === pos.col)) {
    return
  }

  // 必须与上一个格子相邻（曼哈顿距离为 1）
  const dist = Math.abs(pos.row - lastPos.row) + Math.abs(pos.col - lastPos.col)
  if (dist !== 1) return

  const cell = props.level.grid[pos.row][pos.col]
  // 不能是障碍物
  if (cell.isObstacle) {
    return
  }

  // 不能已被其他完成的路径占用
  if (isCellInCompletedPath(pos.row, pos.col)) {
    return
  }

  // 检查字母匹配是否符合单词的下一个字母
  const nextCharIndex = currentPath.length
  const expectedChar = activeTarget.value.letters[nextCharIndex]

  if (cell.letter === expectedChar) {
    currentPath.push(pos)
    audioManager.playSnap()
    audioManager.playPhonics(cell.letter)

    // 检查是否已连到完整单词
    if (currentPath.length === activeTarget.value.letters.length) {
      // 成功连接单词！
      onWordConnected(activeTarget.value, [...currentPath])
      finishDrawing()
    }
  }
}

// 单词连线成功处理
function onWordConnected(target: WordPathTarget, positions: Position[]) {
  completedPaths.value.push({
    targetId: target.id,
    color: target.color,
    positions
  })

  audioManager.playSuccess()
  setTimeout(() => {
    audioManager.playWord(target.word)
  }, 200)

  // 检查是否关卡全完成
  if (completedPaths.value.length === props.level.targets.length) {
    setTimeout(() => {
      audioManager.playStar(2)
      emit('complete')
    }, 1200)
  }
}

function handlePointerUp() {
  if (!isDrawing.value) return
  if (activeTarget.value && currentDrawingPositions.value.length < activeTarget.value.letters.length) {
    audioManager.playBoing()
  }
  finishDrawing()
}

function finishDrawing() {
  isDrawing.value = false
  activeTarget.value = null
  currentDrawingPositions.value = []
  fingerPoint.value = null

  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('pointercancel', handlePointerUp)
}

function resetAll() {
  completedPaths.value = []
  finishDrawing()
}

watch(
  () => props.level,
  () => {
    resetAll()
  }
)

onMounted(() => {
  resetAll()
})

onUnmounted(() => {
  finishDrawing()
})

defineExpose({
  resetAll
})
</script>

<style scoped>
.connect-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: 600px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

/* Target Words Header */
.targets-bar {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.target-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border: 3px solid var(--target-color, #ff6b6b);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.target-card:hover {
  transform: scale(1.05);
}

.target-card.is-completed {
  background: linear-gradient(135deg, #e8f8f5, #d1f2eb);
  border-color: #2ecc71;
  animation: pulseCompleted 2s infinite;
}

.target-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1.4rem;
}

.arrow {
  font-size: 1rem;
  color: #888;
  font-weight: bold;
}

.target-word {
  display: flex;
  gap: 0.3rem;
  font-family: 'Comic Sans MS', cursive;
  font-weight: 900;
  font-size: 1.3rem;
  letter-spacing: 1px;
}

.word-char {
  color: #95a5a6;
  transition: color 0.3s ease, transform 0.3s ease;
}

.word-char.matched {
  color: var(--target-color, #ff6b6b);
  transform: scale(1.15);
  display: inline-block;
}

.done-check {
  background: #2ecc71;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  animation: bounceCheck 0.4s ease-out;
}

/* Playable Grid */
.connect-grid {
  position: relative;
  touch-action: none;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 2px 6px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
}

.grid-cell {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border: 3px solid #edf2f7;
}

.grid-cell.obstacle {
  background: #dfe4ea;
  border-color: #ced6e0;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: not-allowed;
}

.obstacle-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.cell-start-badge {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.6rem;
  line-height: 1;
  animation: floatAvatar 2s ease-in-out infinite;
}

.cell-end-badge {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  line-height: 1;
  animation: pulseGoal 1.5s infinite;
}

.cell-letter {
  font-family: 'Comic Sans MS', cursive;
  font-size: 1.6rem;
  font-weight: 900;
  color: #2f3542;
  margin-top: 14px;
  transition: all 0.2s ease;
}

.cell-letter.highlight {
  color: #ff4757;
  transform: scale(1.15);
}

.grid-cell.start-cell {
  background: #fff9e6;
  border-color: #ffd32a;
}

.grid-cell.end-cell {
  background: #f1f2f6;
  border-color: #70a1ff;
}

.grid-cell.in-current-path {
  background: #fffa65;
  border-color: #ff9f1a;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 159, 26, 0.4);
}

.grid-cell.in-completed-path {
  background: #f7f1e3;
  border-color: #2ed573;
}

/* SVG Lines Layer */
.lines-svg {
  position: absolute;
  top: 8px;
  left: 8px;
  pointer-events: none;
  z-index: 10;
}

.completed-line-anim {
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25));
}

.active-drawing-line {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
}

.grid-hint {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  font-family: 'Comic Sans MS', cursive;
  text-align: center;
  padding: 0 1rem;
}

/* Animations */
@keyframes floatAvatar {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

@keyframes pulseGoal {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.15); }
}

@keyframes pulseCompleted {
  0%, 100% { box-shadow: 0 6px 20px rgba(46, 204, 113, 0.25); }
  50% { box-shadow: 0 8px 25px rgba(46, 204, 113, 0.5); }
}

@keyframes bounceCheck {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@media (max-width: 480px) {
  .cell-letter {
    font-size: 1.3rem;
    margin-top: 10px;
  }
  .cell-start-badge, .cell-end-badge {
    font-size: 1.3rem;
  }
  .target-card {
    padding: 0.4rem 0.8rem;
  }
  .target-word {
    font-size: 1.1rem;
  }
}
</style>
