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
        'connected': cell.isConnected,
        'path-highlight': isPathHighlight(cell.row, cell.col)
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
      <path
        v-for="(line, index) in completedPaths"
        :key="`completed-${index}`"
        :d="line.path"
        :stroke="line.color"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
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
const completedPaths = ref<Array<{ path: string; color: string; cells: Array<{row: number, col: number}> }>>([])
const currentPathCells = ref<Array<{row: number, col: number}>>([])

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

function isPathHighlight(row: number, col: number): boolean {
  return currentPathCells.value.some(c => c.row === row && c.col === col)
}

// Check if a cell is an obstacle
function isObstacle(row: number, col: number): boolean {
  return props.level.obstacles.some(o => o.row === row && o.col === col)
}

// Check if a cell is already used by another connected pair
function isCellUsedByOther(row: number, col: number, currentLetter: string): boolean {
  for (const pathData of completedPaths.value) {
    if (pathData.cells.some(c => c.row === row && c.col === col)) {
      // Check if this path belongs to a different letter
      const pathLetter = props.level.pairs.find(p => {
        const startCell = pathData.cells[0]
        return startCell && p.startPos.row === startCell.row && p.startPos.col === startCell.col
      })?.letter
      if (pathLetter && pathLetter !== currentLetter) {
        return true
      }
    }
  }
  return false
}

// Find path between two points (simple grid-based path)
function findPath(startRow: number, startCol: number, endRow: number, endCol: number, letter: string): Array<{row: number, col: number}> | null {
  const path: Array<{row: number, col: number}> = []
  let currentRow = startRow
  let currentCol = startCol
  
  path.push({ row: currentRow, col: currentCol })
  
  // Simple approach: move horizontally first, then vertically
  while (currentCol !== endCol || currentRow !== endRow) {
    // Try moving horizontally first
    if (currentCol !== endCol) {
      const nextCol = currentCol < endCol ? currentCol + 1 : currentCol - 1
      if (!isObstacle(currentRow, nextCol) && !isCellUsedByOther(currentRow, nextCol, letter)) {
        currentCol = nextCol
        path.push({ row: currentRow, col: currentCol })
        continue
      }
    }
    
    // Try moving vertically
    if (currentRow !== endRow) {
      const nextRow = currentRow < endRow ? currentRow + 1 : currentRow - 1
      if (!isObstacle(nextRow, currentCol) && !isCellUsedByOther(nextRow, currentCol, letter)) {
        currentRow = nextRow
        path.push({ row: currentRow, col: currentCol })
        continue
      }
    }
    
    // If stuck, try alternative paths
    // Try moving diagonally or finding detour
    let found = false
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 0, dc: -1 },
      { dr: 1, dc: 0 },
      { dr: -1, dc: 0 }
    ]
    
    for (const dir of directions) {
      const nextRow = currentRow + dir.dr
      const nextCol = currentCol + dir.dc
      if (nextRow >= 0 && nextRow < props.level.gridSize && 
          nextCol >= 0 && nextCol < props.level.gridSize &&
          !isObstacle(nextRow, nextCol) && 
          !isCellUsedByOther(nextRow, nextCol, letter) &&
          !path.some(p => p.row === nextRow && p.col === nextCol)) {
        currentRow = nextRow
        currentCol = nextCol
        path.push({ row: currentRow, col: currentCol })
        found = true
        break
      }
    }
    
    if (!found) return null // No valid path
  }
  
  return path
}

// Generate SVG path from cell path
function generateSvgPath(cellPath: Array<{row: number, col: number}>): string {
  if (cellPath.length === 0) return ''
  
  const points = cellPath.map(cell => {
    const center = getCellCenter(cell.row, cell.col)
    return `${center.x},${center.y}`
  })
  
  return `M ${points.join(' L ')}`
}

// Check if path passes through obstacles
function isPathValid(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
  // Check if straight line path has obstacles
  const minRow = Math.min(startRow, endRow)
  const maxRow = Math.max(startRow, endRow)
  const minCol = Math.min(startCol, endCol)
  const maxCol = Math.max(startCol, endCol)
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (isObstacle(row, col)) return false
    }
  }
  
  return true
}

// Event handlers
function handlePointerDown(event: PointerEvent, cell: any) {
  if (cell.isObstacle || cell.isConnected) return
  if (!cell.isStart && !cell.isEnd) return
  
  const pair = props.level.pairs.find(p => p.letter === cell.letter)
  if (!pair) return
  
  isDrawing.value = true
  currentStartCell.value = { row: cell.row, col: cell.col, letter: cell.letter }
  currentPathCells.value = [{ row: cell.row, col: cell.col }]
  
  const center = getCellCenter(cell.row, cell.col)
  currentLine.value = { x1: center.x, y1: center.y, x2: center.x, y2: center.y }
  
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!isDrawing.value || !currentLine.value || !gridRef.value) return
  
  const rect = gridRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  currentLine.value = { ...currentLine.value, x2: x, y2: y }
  
  // Track which cells the line passes through
  const gridSize = props.level.gridSize
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const center = getCellCenter(row, col)
      const distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2))
      if (distance < CELL_SIZE * 0.6) {
        if (!currentPathCells.value.some(c => c.row === row && c.col === col)) {
          currentPathCells.value.push({ row, col })
        }
      }
    }
  }
}

function onPointerUp(event: PointerEvent) {
  if (!isDrawing.value || !currentStartCell.value || !gridRef.value) return
  
  const rect = gridRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Find which cell was dropped on
  const { gridSize, pairs } = props.level
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const center = getCellCenter(row, col)
      const distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2))
      
      if (distance < CELL_SIZE * 0.8) {
        const pair = pairs.find(p => p.letter === currentStartCell.value?.letter)
        
        if (pair && pair.endPos.row === row && pair.endPos.col === col) {
          // Check if path is valid (no obstacles)
          const path = findPath(pair.startPos.row, pair.startPos.col, pair.endPos.row, pair.endPos.col, pair.letter)
          
          if (path) {
            // Success!
            connectedPairs.value.add(pair.letter)
            const svgPath = generateSvgPath(path)
            completedPaths.value.push({
              path: svgPath,
              color: pair.color,
              cells: path
            })
            
            // Check if all pairs connected
            if (connectedPairs.value.size === pairs.length) {
              setTimeout(() => emit('complete'), 1500)
            }
          }
        }
        break
      }
    }
  }
  
  // Reset drawing state
  isDrawing.value = false
  currentStartCell.value = null
  currentLine.value = null
  currentPathCells.value = []
  
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}

// Initialize
onMounted(() => {
  connectedPairs.value = new Set()
  completedPaths.value = []
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
  animation: pulse 2s infinite;
}

.grid-cell.start .animal-icon,
.grid-cell.end .animal-icon {
  cursor: pointer;
}

.grid-cell.start:hover,
.grid-cell.end:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 217, 61, 0.5);
}

.grid-cell.obstacle {
  background: rgba(139, 119, 101, 0.7);
  border-color: rgba(139, 119, 101, 0.9);
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
}

.grid-cell.connected {
  background: rgba(78, 205, 196, 0.3);
  border-color: #4ECDC4;
  animation: none;
}

.grid-cell.path-highlight {
  background: rgba(255, 217, 61, 0.3);
  border-color: rgba(255, 217, 61, 0.6);
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
  opacity: 0.8;
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

@keyframes pulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 217, 61, 0.3); }
  50% { box-shadow: 0 4px 25px rgba(255, 217, 61, 0.6); }
}

@keyframes lineDash {
  to {
    stroke-dashoffset: -18;
  }
}
</style>
