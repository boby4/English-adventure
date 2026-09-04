// 连线游戏关卡数据 - 单词小径 (Word Path) 寻宝连线
// 每个关卡均有 100% 保证的可行解，融合成生动有趣的英语单词启蒙

export interface Position {
  row: number
  col: number
}

export interface WordPathTarget {
  id: string
  word: string
  name: string
  emoji: string
  targetEmoji: string // 终点目标物（如猫找鱼、狗找骨头）
  color: string
  letters: string[]
  path: Position[] // 期望的标准连续路径（起点到终点）
}

export interface GridCellData {
  row: number
  col: number
  letter: string
  isObstacle?: boolean
  isStart?: boolean
  isEnd?: boolean
  wordId?: string
  startEmoji?: string
  endEmoji?: string
}

export interface ConnectLevel {
  id: number
  name: string
  story: string
  gridSize: number
  targets: WordPathTarget[]
  obstacles: Position[]
  grid: GridCellData[][]
}

// 辅助构建关卡网格
function buildLevel(
  id: number,
  name: string,
  story: string,
  gridSize: number,
  targets: WordPathTarget[],
  obstacles: Position[] = []
): ConnectLevel {
  const grid: GridCellData[][] = []

  // 预填充随机字母
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < gridSize; r++) {
    const rowList: GridCellData[] = []
    for (let c = 0; c < gridSize; c++) {
      const isObs = obstacles.some(o => o.row === r && o.col === c)
      const randomChar = randomChars[Math.floor(Math.random() * randomChars.length)]
      rowList.push({
        row: r,
        col: c,
        letter: isObs ? '' : randomChar,
        isObstacle: isObs
      })
    }
    grid.push(rowList)
  }

  // 填充目标单词字母到指定路径位置
  for (const t of targets) {
    t.path.forEach((pos, idx) => {
      const cell = grid[pos.row][pos.col]
      cell.letter = t.letters[idx]
      cell.wordId = t.id
      if (idx === 0) {
        cell.isStart = true
        cell.startEmoji = t.emoji
      }
      if (idx === t.letters.length - 1) {
        cell.isEnd = true
        cell.endEmoji = t.targetEmoji
      }
    })
  }

  return {
    id,
    name,
    story,
    gridSize,
    targets,
    obstacles,
    grid
  }
}

export const connectLevels: ConnectLevel[] = [
  // Level 1: CAT (3x3)
  buildLevel(
    1,
    '小猫吃鱼 (CAT)',
    '帮可爱的小猫沿着 C - A - T 走到小鱼身边吧！',
    3,
    [
      {
        id: 'cat',
        word: 'CAT',
        name: '小猫',
        emoji: '🐱',
        targetEmoji: '🐟',
        color: '#FF6B6B',
        letters: ['C', 'A', 'T'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 }
        ]
      }
    ],
    []
  ),

  // Level 2: DOG (3x3)
  buildLevel(
    2,
    '小狗找骨头 (DOG)',
    '小狗肚子咕噜叫，连出 D - O - G 找到香喷喷的骨头！',
    3,
    [
      {
        id: 'dog',
        word: 'DOG',
        name: '小狗',
        emoji: '🐶',
        targetEmoji: '🦴',
        color: '#4ECDC4',
        letters: ['D', 'O', 'G'],
        path: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 1, col: 1 }
        ]
      }
    ],
    [{ row: 0, col: 1 }]
  ),

  // Level 3: PIG & BEE (3x3)
  buildLevel(
    3,
    '小猪与蜜蜂',
    '小猪找泥塘，小蜜蜂采花蜜，两条小道不要打架哦！',
    3,
    [
      {
        id: 'pig',
        word: 'PIG',
        name: '小猪',
        emoji: '🐷',
        targetEmoji: '🌾',
        color: '#FF8ED4',
        letters: ['P', 'I', 'G'],
        path: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }
        ]
      },
      {
        id: 'bee',
        word: 'BEE',
        name: '蜜蜂',
        emoji: '🐝',
        targetEmoji: '🌻',
        color: '#F9CA24',
        letters: ['B', 'E', 'E'],
        path: [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 }
        ]
      }
    ],
    [{ row: 1, col: 1 }]
  ),

  // Level 4: FISH (4x4)
  buildLevel(
    4,
    '小鱼游大海 (FISH)',
    '绕过暗礁，连出 F - I - S - H 游向广阔的大海！',
    4,
    [
      {
        id: 'fish',
        word: 'FISH',
        name: '小鱼',
        emoji: '🐟',
        targetEmoji: '🌊',
        color: '#22A6B3',
        letters: ['F', 'I', 'S', 'H'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 1, col: 2 }
        ]
      }
    ],
    [{ row: 0, col: 2 }, { row: 1, col: 0 }]
  ),

  // Level 5: SUN & MOON (4x4)
  buildLevel(
    5,
    '日月同辉',
    '太阳升起带来光明，月亮升起挂上星空！',
    4,
    [
      {
        id: 'sun',
        word: 'SUN',
        name: '太阳',
        emoji: '☀️',
        targetEmoji: '🌈',
        color: '#F0932B',
        letters: ['S', 'U', 'N'],
        path: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }
        ]
      },
      {
        id: 'moon',
        word: 'MOON',
        name: '月亮',
        emoji: '🌙',
        targetEmoji: '⭐',
        color: '#6AB04C',
        letters: ['M', 'O', 'O', 'N'],
        path: [
          { row: 0, col: 3 },
          { row: 1, col: 3 },
          { row: 2, col: 3 },
          { row: 3, col: 3 }
        ]
      }
    ],
    [{ row: 1, col: 1 }, { row: 2, col: 2 }]
  ),

  // Level 6: LION (4x4)
  buildLevel(
    6,
    '森林之王 (LION)',
    '威风的狮子要回自己的王座啦，连出 L - I - O - N！',
    4,
    [
      {
        id: 'lion',
        word: 'LION',
        name: '狮子',
        emoji: '🦁',
        targetEmoji: '👑',
        color: '#E056FD',
        letters: ['L', 'I', 'O', 'N'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 1, col: 2 }
        ]
      }
    ],
    [{ row: 1, col: 0 }, { row: 1, col: 1 }]
  ),

  // Level 7: BIRD & FROG (4x4)
  buildLevel(
    7,
    '小鸟与青蛙',
    '小鸟飞上高树，小青蛙跳进荷塘！',
    4,
    [
      {
        id: 'bird',
        word: 'BIRD',
        name: '小鸟',
        emoji: '🐦',
        targetEmoji: '🌳',
        color: '#30336B',
        letters: ['B', 'I', 'R', 'D'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 }
        ]
      },
      {
        id: 'frog',
        word: 'FROG',
        name: '青蛙',
        emoji: '🐸',
        targetEmoji: '🪷',
        color: '#6AB04C',
        letters: ['F', 'R', 'O', 'G'],
        path: [
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
          { row: 3, col: 3 }
        ]
      }
    ],
    [{ row: 1, col: 1 }, { row: 2, col: 2 }]
  ),

  // Level 8: APPLE (4x4)
  buildLevel(
    8,
    '红苹果 (APPLE)',
    '馋嘴的小熊找到了大苹果，拼出 A - P - P - L - E！',
    4,
    [
      {
        id: 'apple',
        word: 'APPLE',
        name: '苹果',
        emoji: '🐻',
        targetEmoji: '🍎',
        color: '#EB4D4B',
        letters: ['A', 'P', 'P', 'L', 'E'],
        path: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 }
        ]
      }
    ],
    [{ row: 0, col: 1 }, { row: 1, col: 1 }]
  ),

  // Level 9: DUCK & BEAR (5x5)
  buildLevel(
    9,
    '池塘与密林',
    '小鸭游向湖心，大熊穿过树林找到美味蜂蜜！',
    5,
    [
      {
        id: 'duck',
        word: 'DUCK',
        name: '小鸭',
        emoji: '🦆',
        targetEmoji: '💦',
        color: '#F9CA24',
        letters: ['D', 'U', 'C', 'K'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 1, col: 2 }
        ]
      },
      {
        id: 'bear',
        word: 'BEAR',
        name: '大熊',
        emoji: '🐻',
        targetEmoji: '🍯',
        color: '#795548',
        letters: ['B', 'E', 'A', 'R'],
        path: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 3, col: 1 },
          { row: 3, col: 2 }
        ]
      }
    ],
    [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }]
  ),

  // Level 10: RABBIT & CARROT (5x5 终极寻宝)
  buildLevel(
    10,
    '兔兔大冒险',
    '终极挑战！帮两只小兔子找到金灿灿的大胡萝卜！',
    5,
    [
      {
        id: 'star',
        word: 'STAR',
        name: '星星',
        emoji: '🐰',
        targetEmoji: '🥕',
        color: '#FF6B6B',
        letters: ['S', 'T', 'A', 'R'],
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 }
        ]
      },
      {
        id: 'tree',
        word: 'TREE',
        name: '大树',
        emoji: '🐿️',
        targetEmoji: '🌰',
        color: '#4834D4',
        letters: ['T', 'R', 'E', 'E'],
        path: [
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 4, col: 2 },
          { row: 4, col: 3 }
        ]
      }
    ],
    [{ row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }]
  )
]

export function getConnectLevelById(id: number): ConnectLevel | undefined {
  return connectLevels.find(level => level.id === id)
}

export function getTotalConnectLevels(): number {
  return connectLevels.length
}
