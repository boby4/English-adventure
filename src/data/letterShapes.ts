// 象形字母 - 26个字母设计成动物形状
// 每个字母用SVG路径绘制，形状像对应的动物

export interface LetterShape {
  letter: string
  animal: string
  animalCN: string
  emoji: string
  svgPath: string
  viewBox: string
  color: string
  bgColor: string
}

export const letterShapes: Record<string, LetterShape> = {
  A: {
    letter: 'A',
    animal: 'Alligator',
    animalCN: '鳄鱼',
    emoji: '🐊',
    // 鳄鱼张嘴形成A的形状 - 三角形身体+张开的嘴
    svgPath: 'M50 5 L95 95 L80 95 L65 60 L35 60 L20 95 L5 95 Z M42 45 L58 45 L50 20 Z',
    viewBox: '0 0 100 100',
    color: '#27AE60',
    bgColor: '#E8F8F0'
  },
  B: {
    letter: 'B',
    animal: 'Bear',
    animalCN: '小熊',
    emoji: '🐻',
    // 小熊站立形成B的形状 - 圆润的身体
    svgPath: 'M25 10 L25 90 L55 90 C75 90 85 75 85 60 C85 50 80 45 70 42 C80 38 85 30 85 20 C85 10 75 5 55 5 L25 5 Z M35 15 L50 15 C65 15 70 25 70 30 C70 38 65 42 50 42 L35 42 Z M35 52 L55 52 C68 52 75 58 75 65 C75 75 68 80 55 80 L35 80 Z',
    viewBox: '0 0 100 100',
    color: '#8B4513',
    bgColor: '#FDF2E9'
  },
  C: {
    letter: 'C',
    animal: 'Cat',
    animalCN: '猫咪',
    emoji: '🐱',
    // 猫咪蜷缩形成C的形状 - 蜷缩的身体
    svgPath: 'M80 15 C95 25 100 50 90 70 C80 90 55 95 35 85 C15 75 5 55 10 35 C15 15 35 5 55 8 L65 20 C50 18 35 25 28 40 C18 60 25 80 45 85 C60 90 75 82 82 65 L80 15',
    viewBox: '0 0 100 100',
    color: '#F39C12',
    bgColor: '#FEF9E7'
  },
  D: {
    letter: 'D',
    animal: 'Dog',
    animalCN: '小狗',
    emoji: '🐶',
    // 小狗坐着形成D的形状 - 坐姿轮廓
    svgPath: 'M20 10 L20 90 L45 90 C75 90 90 70 90 50 C90 30 75 10 45 10 Z M30 20 L42 20 C60 20 72 32 72 50 C72 68 60 80 42 80 L30 80 Z',
    viewBox: '0 0 100 100',
    color: '#E74C3C',
    bgColor: '#FDEDEC'
  },
  E: {
    letter: 'E',
    animal: 'Elephant',
    animalCN: '大象',
    emoji: '🐘',
    // 大象侧面形成E的形状 - 长鼻子
    svgPath: 'M75 10 L25 10 L25 90 L75 90 L75 78 L38 78 L38 55 L65 55 L65 43 L38 43 L38 22 L75 22 Z',
    viewBox: '0 0 100 100',
    color: '#95A5A6',
    bgColor: '#F2F3F4'
  },
  F: {
    letter: 'F',
    animal: 'Fish',
    animalCN: '小鱼',
    emoji: '🐟',
    // 小鱼游动形成F的形状 - 鱼身+尾巴
    svgPath: 'M25 10 L75 10 L70 25 L42 25 L42 42 L65 42 L60 57 L42 57 L42 90 L25 90 Z M68 48 L88 38 L88 58 Z',
    viewBox: '0 0 100 100',
    color: '#3498DB',
    bgColor: '#EBF5FB'
  },
  G: {
    letter: 'G',
    animal: 'Giraffe',
    animalCN: '长颈鹿',
    emoji: '🦒',
    // 长颈鹿形成G的形状 - 长脖子+身体
    svgPath: 'M80 15 C95 25 100 50 90 70 C80 85 60 90 45 85 L45 65 L70 65 L70 55 L55 55 C35 55 20 65 15 50 C10 35 20 15 40 10 C55 5 70 10 80 15 Z',
    viewBox: '0 0 100 100',
    color: '#F39C12',
    bgColor: '#FEF9E7'
  },
  H: {
    letter: 'H',
    animal: 'Horse',
    animalCN: '马',
    emoji: '🐴',
    // 马站立形成H的形状 - 两条腿+身体
    svgPath: 'M20 10 L20 90 L35 90 L35 55 L65 55 L65 90 L80 90 L80 10 L65 10 L65 45 L35 45 L35 10 Z',
    viewBox: '0 0 100 100',
    color: '#8B4513',
    bgColor: '#FDF2E9'
  },
  I: {
    letter: 'I',
    animal: 'Iguana',
    animalCN: '鬣蜥',
    emoji: '🦎',
    // 鬣蜥形成I的形状 - 直立的身体
    svgPath: 'M30 10 L70 10 L70 22 L55 22 L55 78 L70 78 L70 90 L30 90 L30 78 L45 78 L45 22 L30 22 Z',
    viewBox: '0 0 100 100',
    color: '#27AE60',
    bgColor: '#E8F8F0'
  },
  J: {
    letter: 'J',
    animal: 'Jellyfish',
    animalCN: '水母',
    emoji: '🪼',
    // 水母形成J的形状 - 圆顶+触手
    svgPath: 'M55 10 L75 10 L75 55 C75 80 60 95 40 95 C25 95 15 85 15 70 L28 70 C28 78 33 82 40 82 C50 82 62 75 62 55 L62 22 L38 22 L38 10 Z',
    viewBox: '0 0 100 100',
    color: '#E91E63',
    bgColor: '#FCE4EC'
  },
  K: {
    letter: 'K',
    animal: 'Koala',
    animalCN: '考拉',
    emoji: '🐨',
    // 考拉抱树形成K的形状
    svgPath: 'M25 10 L25 90 L40 90 L40 55 L55 80 L75 90 L90 75 L65 52 L85 25 L70 15 L45 45 L40 40 L40 10 Z',
    viewBox: '0 0 100 100',
    color: '#795548',
    bgColor: '#EFEBE9'
  },
  L: {
    letter: 'L',
    animal: 'Lion',
    animalCN: '狮子',
    emoji: '🦁',
    // 狮子形成L的形状 - 坐姿
    svgPath: 'M25 10 L25 90 L75 90 L75 75 L40 75 L40 25 L60 25 L60 40 L75 40 L75 10 L25 10 Z',
    viewBox: '0 0 100 100',
    color: '#F39C12',
    bgColor: '#FEF9E7'
  },
  M: {
    letter: 'M',
    animal: 'Monkey',
    animalCN: '猴子',
    emoji: '🐒',
    // 猴子形成M的形状 - 山形
    svgPath: 'M10 90 L10 10 L30 10 L50 50 L70 10 L90 10 L90 90 L75 90 L75 35 L55 70 L45 70 L25 35 L25 90 Z',
    viewBox: '0 0 100 100',
    color: '#795548',
    bgColor: '#EFEBE9'
  },
  N: {
    letter: 'N',
    animal: 'Narwhal',
    animalCN: '独角鲸',
    emoji: '🐳',
    // 独角鲸形成N的形状 - 角+身体
    svgPath: 'M15 90 L15 10 L35 10 L65 65 L65 10 L85 10 L85 90 L65 90 L35 35 L35 90 Z',
    viewBox: '0 0 100 100',
    color: '#2196F3',
    bgColor: '#E3F2FD'
  },
  O: {
    letter: 'O',
    animal: 'Owl',
    animalCN: '猫头鹰',
    emoji: '🦉',
    // 猫头鹰形成O的形状 - 圆形身体+大眼睛
    svgPath: 'M50 5 C80 5 95 25 95 50 C95 75 80 95 50 95 C20 95 5 75 5 50 C5 25 20 5 50 5 Z M50 18 C28 18 18 35 18 50 C18 65 28 82 50 82 C72 82 82 65 82 50 C82 35 72 18 50 18 Z',
    viewBox: '0 0 100 100',
    color: '#673AB7',
    bgColor: '#EDE7F6'
  },
  P: {
    letter: 'P',
    animal: 'Penguin',
    animalCN: '企鹅',
    emoji: '🐧',
    // 企鹅形成P的形状 - 站立姿势
    svgPath: 'M25 10 L25 90 L40 90 L40 55 L55 55 C75 55 80 40 80 30 C80 15 70 10 55 10 Z M35 20 L52 20 C65 20 70 28 70 32 C70 42 65 48 52 48 L35 48 Z',
    viewBox: '0 0 100 100',
    color: '#2C3E50',
    bgColor: '#EBF5FB'
  },
  Q: {
    letter: 'Q',
    animal: 'Quail',
    animalCN: '鹌鹑',
    emoji: '🐦',
    // 鹌鹑形成Q的形状 - 圆形+尾巴
    svgPath: 'M50 5 C80 5 95 25 95 50 C95 75 80 90 55 90 L70 100 L85 95 L75 85 C90 75 95 60 95 50 C95 25 80 5 50 5 Z M50 18 C28 18 18 35 18 50 C18 65 28 82 50 82 C65 82 75 72 78 60 L50 18 Z',
    viewBox: '0 0 100 100',
    color: '#C0392B',
    bgColor: '#FDEDEC'
  },
  R: {
    letter: 'R',
    animal: 'Rabbit',
    animalCN: '兔子',
    emoji: '🐰',
    // 兔子形成R的形状 - 长耳朵
    svgPath: 'M25 10 L25 90 L40 90 L40 55 L55 55 L75 90 L92 90 L70 52 C80 48 85 38 85 28 C85 15 75 10 58 10 Z M35 20 L55 20 C68 20 72 28 72 32 C72 42 68 48 55 48 L35 48 Z',
    viewBox: '0 0 100 100',
    color: '#E91E63',
    bgColor: '#FCE4EC'
  },
  S: {
    letter: 'S',
    animal: 'Snake',
    animalCN: '蛇',
    emoji: '🐍',
    // 蛇蜿蜒形成S的形状
    svgPath: 'M75 15 C90 15 95 30 85 42 C75 55 55 55 45 60 C30 68 20 80 35 90 C50 100 75 95 80 80 L68 75 C65 82 55 85 45 82 C35 78 40 70 50 65 C65 58 85 55 90 42 C98 28 90 12 75 10 C55 5 40 15 38 25 L50 30',
    viewBox: '0 0 100 100',
    color: '#4CAF50',
    bgColor: '#E8F5E9'
  },
  T: {
    letter: 'T',
    animal: 'Turtle',
    animalCN: '乌龟',
    emoji: '🐢',
    // 乌龟形成T的形状 - 龟壳
    svgPath: 'M10 10 L90 10 L90 28 L62 28 L62 90 L38 90 L38 28 L10 28 Z',
    viewBox: '0 0 100 100',
    color: '#4CAF50',
    bgColor: '#E8F5E9'
  },
  U: {
    letter: 'U',
    animal: 'Unicorn',
    animalCN: '独角兽',
    emoji: '🦄',
    // 独角兽形成U的形状 - U形角
    svgPath: 'M20 10 L20 60 C20 82 35 95 50 95 C65 95 80 82 80 60 L80 10 L65 10 L65 58 C65 72 58 82 50 82 C42 82 35 72 35 58 L35 10 Z',
    viewBox: '0 0 100 100',
    color: '#9C27B0',
    bgColor: '#F3E5F5'
  },
  V: {
    letter: 'V',
    animal: 'Vulture',
    animalCN: '秃鹫',
    emoji: '🦅',
    // 秃鹫形成V的形状 - 展翅
    svgPath: 'M5 10 L42 90 L50 60 L58 90 L95 10 L78 10 L58 72 L50 45 L42 72 L22 10 Z',
    viewBox: '0 0 100 100',
    color: '#795548',
    bgColor: '#EFEBE9'
  },
  W: {
    letter: 'W',
    animal: 'Whale',
    animalCN: '鲸鱼',
    emoji: '🐋',
    // 鲸鱼形成W的形状 - 波浪形
    svgPath: 'M5 10 L20 80 L35 35 L50 70 L65 35 L80 80 L95 10 L80 10 L65 60 L50 30 L35 60 L20 10 Z',
    viewBox: '0 0 100 100',
    color: '#2196F3',
    bgColor: '#E3F2FD'
  },
  X: {
    letter: 'X',
    animal: 'X-ray Fish',
    animalCN: 'X光鱼',
    emoji: '🐠',
    // X光鱼形成X的形状 - 交叉
    svgPath: 'M15 10 L40 50 L15 90 L32 90 L50 62 L68 90 L85 90 L60 50 L85 10 L68 10 L50 38 L32 10 Z',
    viewBox: '0 0 100 100',
    color: '#00BCD4',
    bgColor: '#E0F7FA'
  },
  Y: {
    letter: 'Y',
    animal: 'Yak',
    animalCN: '牦牛',
    emoji: '🐂',
    // 牦牛形成Y的形状 - 分叉角
    svgPath: 'M10 10 L35 50 L35 90 L50 90 L50 50 L75 10 L58 10 L50 35 L42 10 Z',
    viewBox: '0 0 100 100',
    color: '#795548',
    bgColor: '#EFEBE9'
  },
  Z: {
    letter: 'Z',
    animal: 'Zebra',
    animalCN: '斑马',
    emoji: '🦓',
    // 斑马形成Z的形状 - 条纹
    svgPath: 'M15 10 L85 10 L85 28 L40 72 L85 72 L85 90 L15 90 L15 72 L60 28 L15 28 Z',
    viewBox: '0 0 100 100',
    color: '#212121',
    bgColor: '#F5F5F5'
  }
}

// 获取字母形状
export function getLetterShape(letter: string): LetterShape | null {
  return letterShapes[letter.toUpperCase()] || null
}

// 获取所有字母形状
export function getAllLetterShapes(): LetterShape[] {
  return Object.values(letterShapes)
}
