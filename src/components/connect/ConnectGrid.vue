<template>
  <div class="connect-grid" ref="gridRef" :style="gridStyle">
    <!-- Grid cells -->
    <div
      v-for="(cell, index) in gridCells"
      :key="index"
      class="grid-cell"
      :class="{
        'obstacle': cell.isObstacle,
        'start': cell.isStart && !cell.isConnected,
        'end': cell.isEnd && !cell.isConnected,
        'connected': cell.isConnected
      }"
      :style="getCellStyle(cell)"
    >
      <!-- Animal icon for start/end -->
      <div v-if="cell.isStart || cell.isEnd" class="animal-icon" 
           @pointerdown="handlePointerDown($event, cell)">
        <img :src="`/img/${cell.letter}.png`" :alt="cell.letter" class="animal-img" />
        <span class="letter-label">{{ cell.letter }}</span>
      </div>
      
      <!-- Obstacle icon -->
      <div v-if="cell.isObstacle" class="obstacle-icon">🪨</div>
    </div>
    
    <!-- SVG for drawing lines -->
    <svg class="lines-svg" :width="svgWidth" :height="svgHeight">
      <!-- Completed lines -->
      <line
        v-for="(line, index) in completedLines"
        :key="`completed-${index}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="line.color"
        stroke-width="8"
        stroke-linecap="round"
        class="completed-line"
      />
      
      <!-- Current drawing line -->
      <line
        v-if="currentLine"
        :x1="currentLine.x1"
        :y1="currentLine.y1"
        :x2="currentLine.x2"
        :y2="currentLine.y2"
        :stroke="currentLineColor"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="12,6"
        class="drawing-line"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ConnectLevel } from '../../data/connectLevels'

interface Props {
  level: ConnectLevel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

// Constants
const CELL_SIZE = 80
const CELL_GAP = 10

// Refs
const gridRef = ref<HTMLElement | null>(null)

// State
const isDrawing = ref(false)
const currentStartCell = ref<{ row: number; col: number; letter: string } | null>(null)
const currentLine = ref<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
const connectedPairs = ref<Set<string>>(new Set())
const completedLines = ref<Array<{ x1: number; y1: number; x2: number; y2: number; color: string }>>([])

// Computed
const svgWidth = computed(() => props.level.gridSize * (CELL_SIZE + CELL_GAP))
const svgHeight = computed(() => props.level.gridSize * (CELL_SIZE + CELL_GAP))

const gridStyle = computed(() => ({
  width: `${svgWidth.value}px`,
  height: `${svgHeight.value}px`
}))

const currentLineColor = computed(() => {
  if (!currentStartCell.value) return '#ccc'
  const pair = props.level.pairs.find(p => p.letter === currentStartCell.value?.letter)
  return pair?.color || '#ccc'
})

// Build grid cells
const gridCells = computed(() => {
  const cells: Array<{
    row: number
    col: number
    letter?: string
    isStart: boolean
    isEnd: boolean
    isObstacle: boolean
    isConnected: boolean
  }> = []
  
  const { gridSize, pairs, obstacles } = props.level
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isObstacle = obstacles.some(o => o.row === row && o.col === col)
      
      let letter: string | undefined
      let isStart = false
      let isEnd = false
      
      for (const pair of pairs) {
        if (pair.startPos.row === row && pair.startPos.col === col) {
          letter = pair.letter
          isStart = true
        }
        if (pair.endPos.row === row && pair.endPos.col === col) {
          letter = pair.letter
          isEnd = true
        }
      }
      
      const isConnected = letter ? connectedPairs.value.has(letter) : false
      
      cells.push({ row, col, letter, isStart, isEnd, isObstacle, isConnected })
    }
  }
  
  return cells
})

// Helper functions
function getCellCenter(row: number, col: number) {
  return {
    x: col * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    y: row * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2
  }
}

function getCellStyle(cell: any) {
  return {
    left: `${cell.col * (CELL_SIZE + CELL_GAP)}px`,
    top: `${cell.row * (CELL_SIZE + CELL_GAP)}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`
  }
}

// Event handlers
function handlePointerDown(event: PointerEvent, cell: any) {
  if (cell.isObstacle || cell.isConnected) return
  if (!cell.isStart && !cell.isEnd) return
  
  const pair = props.level.pairs.find(p => p.letter === cell.letter)
  if (!pair) return
  
  isDrawing.value = true
  currentStartCell.value = { row: cell.row, col: cell.col, letter: cell.letter }
  
  const center = getCellCenter(cell.row, cell.col)
  currentLine.value = { x1: center.x, y1: center.y, x2: center.x, y2: center.y }
  
  // Add global listeners
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!isDrawing.value || !currentLine.value || !gridRef.value) return
  
  const rect = gridRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  currentLine.value = { ...currentLine.value, x2: x, y2: y }
}

function onPointerUp(event: PointerEvent) {
  if (!isDrawing.value || !currentStartCell.value || !gridRef.value) return
  
  const rect = gridRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Find which cell was dropped on
  const { gridSize, pairs } = props.level
  let foundMatch = false
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const center = getCellCenter(row, col)
      const distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2))
      
      if (distance < CELL_SIZE * 0.8) {
        // Check if this is the matching end point
        const pair = pairs.find(p => p.letter === currentStartCell.value?.letter)
        if (pair && pair.endPos.row === row && pair.endPos.col === col) {
          // Success!
          foundMatch = true
          connectedPairs.value.add(pair.letter)
          completedLines.value.push({
            x1: getCellCenter(pair.startPos.row, pair.startPos.col).x,
            y1: getCellCenter(pair.startPos.row, pair.startPos.col).y,
            x2: getCellCenter(pair.endPos.row, pair.endPos.col).x,
            y2: getCellCenter(pair.endPos.row, pair.endPos.col).y,
            color: pair.color
          })
          
          // Check if all pairs connected
          if (connectedPairs.value.size === pairs.length) {
            setTimeout(() => emit('complete'), 1000)
          }
        }
        break
      }
    }
    if (foundMatch) break
  }
  
  // Reset drawing state
  isDrawing.value = false
  currentStartCell.value = null
  currentLine.value = null
  
  // Remove global listeners
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}

// Initialize
onMounted(() => {
  connectedPairs.value = new Set()
  completedLines.value = []
})

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
})
</script>

<style scoped>
.connect-grid {
  position: relative;
  margin: 0 auto;
  touch-action: none;
  user-select: none;
}

.grid-cell {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.grid-cell.start,
.grid-cell.end {
  background: rgba(255, 255, 255, 0.8);
  border-color: #FFD93D;
  box-shadow: 0 4px 15px rgba(255, 217, 61, 0.3);
}

.grid-cell.start .animal-icon,
.grid-cell.end .animal-icon {
  cursor: pointer;
}

.grid-cell.start:hover,
.grid-cell.end:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 217, 61, 0.5);
}

.grid-cell.obstacle {
  background: rgba(139, 119, 101, 0.6);
  border-color: rgba(139, 119, 101, 0.8);
}

.grid-cell.connected {
  background: rgba(78, 205, 196, 0.3);
  border-color: #4ECDC4;
}

.animal-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.animal-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.letter-label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  font-family: 'Comic Sans MS', cursive;
}

.obstacle-icon {
  font-size: 2rem;
}

.lines-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.completed-line {
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.drawing-line {
  opacity: 0.7;
  animation: lineDash 0.5s linear infinite;
}

@keyframes lineDash {
  to {
    stroke-dashoffset: -18;
  }
}
</style>
