// 连线游戏关卡数据 - 结合现有字母动物图标

export interface Position {
  row: number
  col: number
}

export interface AnimalPair {
  letter: string        // 字母 (A-Z)
  emoji: string         // 动物emoji
  color: string         // 连线颜色
  startPos: Position    // 起点位置
  endPos: Position      // 终点位置
}

export interface ConnectLevel {
  id: number
  name: string
  gridSize: number          // 网格大小
  pairs: AnimalPair[]       // 动物对
  obstacles: Position[]     // 障碍物位置
  story: string             // 故事引导语
}

// 26个字母动物映射
const letterAnimals: Record<string, { emoji: string; color: string }> = {
  A: { emoji: '🐊', color: '#2ECC71' },
  B: { emoji: '🐦', color: '#3498DB' },
  C: { emoji: '🐱', color: '#E67E22' },
  D: { emoji: '🐶', color: '#E74C3C' },
  E: { emoji: '🐘', color: '#9B59B6' },
  F: { emoji: '🐟', color: '#1ABC9C' },
  G: { emoji: '🦒', color: '#F39C12' },
  H: { emoji: '🐴', color: '#8B4513' },
  I: { emoji: '🦎', color: '#27AE60' },
  J: { emoji: '🪼', color: '#E91E91' },
  K: { emoji: '🐨', color: '#7F8C8D' },
  L: { emoji: '🦁', color: '#F1C40F' },
  M: { emoji: '🐒', color: '#D35400' },
  N: { emoji: '🐳', color: '#2980B9' },
  O: { emoji: '🦉', color: '#8E44AD' },
  P: { emoji: '🐧', color: '#2C3E50' },
  Q: { emoji: '🐦', color: '#C0392B' },
  R: { emoji: '🐰', color: '#FF69B4' },
  S: { emoji: '🐍', color: '#2ECC71' },
  T: { emoji: '🐢', color: '#16A085' },
  U: { emoji: '🦄', color: '#9B59B6' },
  V: { emoji: '🦅', color: '#795548' },
  W: { emoji: '🐋', color: '#2196F3' },
  X: { emoji: '🐠', color: '#FF5722' },
  Y: { emoji: '🐂', color: '#607D8B' },
  Z: { emoji: '🦓', color: '#000000' }
}

function getAnimal(letter: string) {
  return letterAnimals[letter.toUpperCase()] || { emoji: '🐾', color: '#95A5A6' }
}

// 森林童话场景 - 10个关卡
export const connectLevels: ConnectLevel[] = [
  {
    id: 1,
    name: '小兔子找萝卜',
    gridSize: 3,
    pairs: [
      {
        letter: 'R',
        emoji: getAnimal('R').emoji,
        color: getAnimal('R').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      }
    ],
    obstacles: [],
    story: '小兔子饿了，帮它找到萝卜吧！'
  },
  {
    id: 2,
    name: '小猫和小狗',
    gridSize: 4,
    pairs: [
      {
        letter: 'C',
        emoji: getAnimal('C').emoji,
        color: getAnimal('C').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 3, col: 3 }
      },
      {
        letter: 'D',
        emoji: getAnimal('D').emoji,
        color: getAnimal('D').color,
        startPos: { row: 0, col: 3 },
        endPos: { row: 3, col: 0 }
      }
    ],
    obstacles: [{ row: 1, col: 1 }],
    story: '小猫和小狗迷路了，帮它们找到回家的路！'
  },
  {
    id: 3,
    name: '小鸟和小鱼',
    gridSize: 4,
    pairs: [
      {
        letter: 'B',
        emoji: getAnimal('B').emoji,
        color: getAnimal('B').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 0, col: 3 }
      },
      {
        letter: 'F',
        emoji: getAnimal('F').emoji,
        color: getAnimal('F').color,
        startPos: { row: 3, col: 0 },
        endPos: { row: 3, col: 3 }
      }
    ],
    obstacles: [{ row: 1, col: 1 }, { row: 2, col: 2 }],
    story: '小鸟想飞到树上，小鱼想游到水里，帮帮它们！'
  },
  {
    id: 4,
    name: '森林派对',
    gridSize: 5,
    pairs: [
      {
        letter: 'L',
        emoji: getAnimal('L').emoji,
        color: getAnimal('L').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      },
      {
        letter: 'M',
        emoji: getAnimal('M').emoji,
        color: getAnimal('M').color,
        startPos: { row: 0, col: 4 },
        endPos: { row: 4, col: 0 }
      },
      {
        letter: 'E',
        emoji: getAnimal('E').emoji,
        color: getAnimal('E').color,
        startPos: { row: 0, col: 2 },
        endPos: { row: 4, col: 2 }
      }
    ],
    obstacles: [{ row: 2, col: 1 }, { row: 2, col: 3 }],
    story: '森林派对开始啦！帮动物们找到自己的位置！'
  },
  {
    id: 5,
    name: '动物回家',
    gridSize: 5,
    pairs: [
      {
        letter: 'H',
        emoji: getAnimal('H').emoji,
        color: getAnimal('H').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 0 }
      },
      {
        letter: 'O',
        emoji: getAnimal('O').emoji,
        color: getAnimal('O').color,
        startPos: { row: 0, col: 2 },
        endPos: { row: 4, col: 2 }
      },
      {
        letter: 'P',
        emoji: getAnimal('P').emoji,
        color: getAnimal('P').color,
        startPos: { row: 0, col: 4 },
        endPos: { row: 4, col: 4 }
      }
    ],
    obstacles: [{ row: 2, col: 0 }, { row: 2, col: 2 }, { row: 2, col: 4 }],
    story: '天黑了，帮动物们找到回家的路！'
  },
  {
    id: 6,
    name: '猴子摘香蕉',
    gridSize: 5,
    pairs: [
      {
        letter: 'M',
        emoji: getAnimal('M').emoji,
        color: getAnimal('M').color,
        startPos: { row: 4, col: 0 },
        endPos: { row: 0, col: 4 }
      }
    ],
    obstacles: [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }],
    story: '猴子想吃香蕉，帮它绕过石头找到香蕉！'
  },
  {
    id: 7,
    name: '动物农场',
    gridSize: 5,
    pairs: [
      {
        letter: 'C',
        emoji: getAnimal('C').emoji,
        color: getAnimal('C').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      },
      {
        letter: 'D',
        emoji: getAnimal('D').emoji,
        color: getAnimal('D').color,
        startPos: { row: 0, col: 4 },
        endPos: { row: 2, col: 2 }
      },
      {
        letter: 'B',
        emoji: getAnimal('B').emoji,
        color: getAnimal('B').color,
        startPos: { row: 4, col: 0 },
        endPos: { row: 2, col: 2 }
      },
      {
        letter: 'F',
        emoji: getAnimal('F').emoji,
        color: getAnimal('F').color,
        startPos: { row: 4, col: 4 },
        endPos: { row: 2, col: 2 }
      }
    ],
    obstacles: [],
    story: '农场聚会！帮所有动物聚到一起！'
  },
  {
    id: 8,
    name: '海底探险',
    gridSize: 5,
    pairs: [
      {
        letter: 'F',
        emoji: getAnimal('F').emoji,
        color: getAnimal('F').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      },
      {
        letter: 'W',
        emoji: getAnimal('W').emoji,
        color: getAnimal('W').color,
        startPos: { row: 4, col: 0 },
        endPos: { row: 0, col: 4 }
      }
    ],
    obstacles: [{ row: 1, col: 2 }, { row: 2, col: 1 }, { row: 3, col: 2 }, { row: 2, col: 3 }],
    story: '海底探险！帮鱼儿和鲸鱼找到宝藏！'
  },
  {
    id: 9,
    name: '动物园大冒险',
    gridSize: 6,
    pairs: [
      {
        letter: 'L',
        emoji: getAnimal('L').emoji,
        color: getAnimal('L').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 5, col: 5 }
      },
      {
        letter: 'E',
        emoji: getAnimal('E').emoji,
        color: getAnimal('E').color,
        startPos: { row: 0, col: 5 },
        endPos: { row: 5, col: 0 }
      },
      {
        letter: 'G',
        emoji: getAnimal('G').emoji,
        color: getAnimal('G').color,
        startPos: { row: 0, col: 2 },
        endPos: { row: 5, col: 3 }
      }
    ],
    obstacles: [{ row: 2, col: 1 }, { row: 2, col: 4 }, { row: 3, col: 2 }, { row: 3, col: 3 }],
    story: '动物园关门了，帮动物们回到自己的家！'
  },
  {
    id: 10,
    name: '终极挑战',
    gridSize: 6,
    pairs: [
      {
        letter: 'A',
        emoji: getAnimal('A').emoji,
        color: getAnimal('A').color,
        startPos: { row: 0, col: 0 },
        endPos: { row: 5, col: 0 }
      },
      {
        letter: 'B',
        emoji: getAnimal('B').emoji,
        color: getAnimal('B').color,
        startPos: { row: 0, col: 1 },
        endPos: { row: 5, col: 1 }
      },
      {
        letter: 'C',
        emoji: getAnimal('C').emoji,
        color: getAnimal('C').color,
        startPos: { row: 0, col: 2 },
        endPos: { row: 5, col: 2 }
      },
      {
        letter: 'D',
        emoji: getAnimal('D').emoji,
        color: getAnimal('D').color,
        startPos: { row: 0, col: 3 },
        endPos: { row: 5, col: 3 }
      },
      {
        letter: 'E',
        emoji: getAnimal('E').emoji,
        color: getAnimal('E').color,
        startPos: { row: 0, col: 4 },
        endPos: { row: 5, col: 4 }
      },
      {
        letter: 'F',
        emoji: getAnimal('F').emoji,
        color: getAnimal('F').color,
        startPos: { row: 0, col: 5 },
        endPos: { row: 5, col: 5 }
      }
    ],
    obstacles: [{ row: 2, col: 0 }, { row: 2, col: 2 }, { row: 2, col: 4 }, { row: 3, col: 1 }, { row: 3, col: 3 }, { row: 3, col: 5 }],
    story: '终极挑战！帮所有字母动物找到回家的路！'
  }
]

export function getConnectLevelById(id: number): ConnectLevel | undefined {
  return connectLevels.find(level => level.id === id)
}

export function getTotalConnectLevels(): number {
  return connectLevels.length
}
