export interface WordLevel {
  id: string
  word: string
  category: string
  emoji: string
  image: string
  letters: string[]
  sentence: string
  voice: string
  animation: string
}

export const levels: WordLevel[] = [
  // ========== Animals (15) ==========
  {
    id: 'cat',
    word: 'CAT',
    category: 'animals',
    emoji: '🐱',
    image: '/assets/words/cat.png',
    letters: ['C', 'A', 'T'],
    sentence: 'The cat jumps.',
    voice: 'Cat',
    animation: 'jump'
  },
  {
    id: 'dog',
    word: 'DOG',
    category: 'animals',
    emoji: '🐶',
    image: '/assets/words/dog.png',
    letters: ['D', 'O', 'G'],
    sentence: 'The dog runs.',
    voice: 'Dog',
    animation: 'run'
  },
  {
    id: 'fish',
    word: 'FISH',
    category: 'animals',
    emoji: '🐟',
    image: '/assets/words/fish.png',
    letters: ['F', 'I', 'S', 'H'],
    sentence: 'The fish swims.',
    voice: 'Fish',
    animation: 'swim'
  },
  {
    id: 'bird',
    word: 'BIRD',
    category: 'animals',
    emoji: '🐦',
    image: '/assets/words/bird.png',
    letters: ['B', 'I', 'R', 'D'],
    sentence: 'The bird flies.',
    voice: 'Bird',
    animation: 'fly'
  },
  {
    id: 'lion',
    word: 'LION',
    category: 'animals',
    emoji: '🦁',
    image: '/assets/words/lion.png',
    letters: ['L', 'I', 'O', 'N'],
    sentence: 'The lion roars.',
    voice: 'Lion',
    animation: 'roar'
  },
  {
    id: 'bear',
    word: 'BEAR',
    category: 'animals',
    emoji: '🐻',
    image: '/assets/words/bear.png',
    letters: ['B', 'E', 'A', 'R'],
    sentence: 'The bear sleeps.',
    voice: 'Bear',
    animation: 'sleep'
  },
  {
    id: 'duck',
    word: 'DUCK',
    category: 'animals',
    emoji: '🦆',
    image: '/assets/words/duck.png',
    letters: ['D', 'U', 'C', 'K'],
    sentence: 'The duck swims.',
    voice: 'Duck',
    animation: 'swim'
  },
  {
    id: 'frog',
    word: 'FROG',
    category: 'animals',
    emoji: '🐸',
    image: '/assets/words/frog.png',
    letters: ['F', 'R', 'O', 'G'],
    sentence: 'The frog jumps.',
    voice: 'Frog',
    animation: 'jump'
  },
  {
    id: 'cow',
    word: 'COW',
    category: 'animals',
    emoji: '🐮',
    image: '/assets/words/cow.png',
    letters: ['C', 'O', 'W'],
    sentence: 'The cow moos.',
    voice: 'Cow',
    animation: 'moo'
  },
  {
    id: 'pig',
    word: 'PIG',
    category: 'animals',
    emoji: '🐷',
    image: '/assets/words/pig.png',
    letters: ['P', 'I', 'G'],
    sentence: 'The pig rolls.',
    voice: 'Pig',
    animation: 'roll'
  },
  {
    id: 'horse',
    word: 'HORSE',
    category: 'animals',
    emoji: '🐴',
    image: '/assets/words/horse.png',
    letters: ['H', 'O', 'R', 'S', 'E'],
    sentence: 'The horse runs fast.',
    voice: 'Horse',
    animation: 'run'
  },
  {
    id: 'sheep',
    word: 'SHEEP',
    category: 'animals',
    emoji: '🐑',
    image: '/assets/words/sheep.png',
    letters: ['S', 'H', 'E', 'E', 'P'],
    sentence: 'The sheep is fluffy.',
    voice: 'Sheep',
    animation: 'bounce'
  },
  {
    id: 'rabbit',
    word: 'RABBIT',
    category: 'animals',
    emoji: '🐰',
    image: '/assets/words/rabbit.png',
    letters: ['R', 'A', 'B', 'B', 'I', 'T'],
    sentence: 'The rabbit hops.',
    voice: 'Rabbit',
    animation: 'hop'
  },
  {
    id: 'monkey',
    word: 'MONKEY',
    category: 'animals',
    emoji: '🐒',
    image: '/assets/words/monkey.png',
    letters: ['M', 'O', 'N', 'K', 'E', 'Y'],
    sentence: 'The monkey climbs.',
    voice: 'Monkey',
    animation: 'climb'
  },
  {
    id: 'panda',
    word: 'PANDA',
    category: 'animals',
    emoji: '🐼',
    image: '/assets/words/panda.png',
    letters: ['P', 'A', 'N', 'D', 'A'],
    sentence: 'The panda eats bamboo.',
    voice: 'Panda',
    animation: 'eat'
  },

  // ========== Food (10) ==========
  {
    id: 'apple',
    word: 'APPLE',
    category: 'food',
    emoji: '🍎',
    image: '/assets/words/apple.png',
    letters: ['A', 'P', 'P', 'L', 'E'],
    sentence: 'I see an apple.',
    voice: 'Apple',
    animation: 'rotate'
  },
  {
    id: 'milk',
    word: 'MILK',
    category: 'food',
    emoji: '🥛',
    image: '/assets/words/milk.png',
    letters: ['M', 'I', 'L', 'K'],
    sentence: 'I like milk.',
    voice: 'Milk',
    animation: 'shake'
  },
  {
    id: 'banana',
    word: 'BANANA',
    category: 'food',
    emoji: '🍌',
    image: '/assets/words/banana.png',
    letters: ['B', 'A', 'N', 'A', 'N', 'A'],
    sentence: 'I eat a banana.',
    voice: 'Banana',
    animation: 'peel'
  },
  {
    id: 'cake',
    word: 'CAKE',
    category: 'food',
    emoji: '🎂',
    image: '/assets/words/cake.png',
    letters: ['C', 'A', 'K', 'E'],
    sentence: 'I like cake.',
    voice: 'Cake',
    animation: 'bounce'
  },
  {
    id: 'bread',
    word: 'BREAD',
    category: 'food',
    emoji: '🍞',
    image: '/assets/words/bread.png',
    letters: ['B', 'R', 'E', 'A', 'D'],
    sentence: 'I eat bread.',
    voice: 'Bread',
    animation: 'bounce'
  },
  {
    id: 'egg',
    word: 'EGG',
    category: 'food',
    emoji: '🥚',
    image: '/assets/words/egg.png',
    letters: ['E', 'G', 'G'],
    sentence: 'I eat an egg.',
    voice: 'Egg',
    animation: 'bounce'
  },
  {
    id: 'rice',
    word: 'RICE',
    category: 'food',
    emoji: '🍚',
    image: '/assets/words/rice.png',
    letters: ['R', 'I', 'C', 'E'],
    sentence: 'I eat rice.',
    voice: 'Rice',
    animation: 'bounce'
  },
  {
    id: 'cookie',
    word: 'COOKIE',
    category: 'food',
    emoji: '🍪',
    image: '/assets/words/cookie.png',
    letters: ['C', 'O', 'O', 'K', 'I', 'E'],
    sentence: 'I want a cookie.',
    voice: 'Cookie',
    animation: 'bounce'
  },
  {
    id: 'grape',
    word: 'GRAPE',
    category: 'food',
    emoji: '🍇',
    image: '/assets/words/grape.png',
    letters: ['G', 'R', 'A', 'P', 'E'],
    sentence: 'I like grapes.',
    voice: 'Grape',
    animation: 'bounce'
  },
  {
    id: 'orange',
    word: 'ORANGE',
    category: 'food',
    emoji: '🍊',
    image: '/assets/words/orange.png',
    letters: ['O', 'R', 'A', 'N', 'G', 'E'],
    sentence: 'The orange is sweet.',
    voice: 'Orange',
    animation: 'bounce'
  },

  // ========== Nature (10) ==========
  {
    id: 'sun',
    word: 'SUN',
    category: 'nature',
    emoji: '☀️',
    image: '/assets/words/sun.png',
    letters: ['S', 'U', 'N'],
    sentence: 'The sun is bright.',
    voice: 'Sun',
    animation: 'shine'
  },
  {
    id: 'tree',
    word: 'TREE',
    category: 'nature',
    emoji: '🌳',
    image: '/assets/words/tree.png',
    letters: ['T', 'R', 'E', 'E'],
    sentence: 'The tree is tall.',
    voice: 'Tree',
    animation: 'grow'
  },
  {
    id: 'star',
    word: 'STAR',
    category: 'nature',
    emoji: '⭐',
    image: '/assets/words/star.png',
    letters: ['S', 'T', 'A', 'R'],
    sentence: 'I see a star.',
    voice: 'Star',
    animation: 'twinkle'
  },
  {
    id: 'moon',
    word: 'MOON',
    category: 'nature',
    emoji: '🌙',
    image: '/assets/words/moon.png',
    letters: ['M', 'O', 'O', 'N'],
    sentence: 'The moon is bright.',
    voice: 'Moon',
    animation: 'glow'
  },
  {
    id: 'rain',
    word: 'RAIN',
    category: 'nature',
    emoji: '🌧️',
    image: '/assets/words/rain.png',
    letters: ['R', 'A', 'I', 'N'],
    sentence: 'The rain falls.',
    voice: 'Rain',
    animation: 'fall'
  },
  {
    id: 'flower',
    word: 'FLOWER',
    category: 'nature',
    emoji: '🌸',
    image: '/assets/words/flower.png',
    letters: ['F', 'L', 'O', 'W', 'E', 'R'],
    sentence: 'The flower blooms.',
    voice: 'Flower',
    animation: 'bloom'
  },
  {
    id: 'cloud',
    word: 'CLOUD',
    category: 'nature',
    emoji: '☁️',
    image: '/assets/words/cloud.png',
    letters: ['C', 'L', 'O', 'U', 'D'],
    sentence: 'The cloud floats.',
    voice: 'Cloud',
    animation: 'float'
  },
  {
    id: 'snow',
    word: 'SNOW',
    category: 'nature',
    emoji: '❄️',
    image: '/assets/words/snow.png',
    letters: ['S', 'N', 'O', 'W'],
    sentence: 'The snow is cold.',
    voice: 'Snow',
    animation: 'fall'
  },
  {
    id: 'leaf',
    word: 'LEAF',
    category: 'nature',
    emoji: '🍃',
    image: '/assets/words/leaf.png',
    letters: ['L', 'E', 'A', 'F'],
    sentence: 'The leaf falls.',
    voice: 'Leaf',
    animation: 'fall'
  },
  {
    id: 'grass',
    word: 'GRASS',
    category: 'nature',
    emoji: '🌿',
    image: '/assets/words/grass.png',
    letters: ['G', 'R', 'A', 'S', 'S'],
    sentence: 'The grass is green.',
    voice: 'Grass',
    animation: 'sway'
  },

  // ========== Objects (10) ==========
  {
    id: 'ball',
    word: 'BALL',
    category: 'objects',
    emoji: '⚽',
    image: '/assets/words/ball.png',
    letters: ['B', 'A', 'L', 'L'],
    sentence: 'The ball bounces.',
    voice: 'Ball',
    animation: 'bounce'
  },
  {
    id: 'book',
    word: 'BOOK',
    category: 'objects',
    emoji: '📚',
    image: '/assets/words/book.png',
    letters: ['B', 'O', 'O', 'K'],
    sentence: 'I read a book.',
    voice: 'Book',
    animation: 'open'
  },
  {
    id: 'car',
    word: 'CAR',
    category: 'vehicles',
    emoji: '🚗',
    image: '/assets/words/car.png',
    letters: ['C', 'A', 'R'],
    sentence: 'The car goes fast.',
    voice: 'Car',
    animation: 'drive'
  },
  {
    id: 'bus',
    word: 'BUS',
    category: 'vehicles',
    emoji: '🚌',
    image: '/assets/words/bus.png',
    letters: ['B', 'U', 'S'],
    sentence: 'The bus is big.',
    voice: 'Bus',
    animation: 'drive'
  },
  {
    id: 'boat',
    word: 'BOAT',
    category: 'vehicles',
    emoji: '🚤',
    image: '/assets/words/boat.png',
    letters: ['B', 'O', 'A', 'T'],
    sentence: 'The boat sails.',
    voice: 'Boat',
    animation: 'sail'
  },
  {
    id: 'plane',
    word: 'PLANE',
    category: 'vehicles',
    emoji: '✈️',
    image: '/assets/words/plane.png',
    letters: ['P', 'L', 'A', 'N', 'E'],
    sentence: 'The plane flies.',
    voice: 'Plane',
    animation: 'fly'
  },
  {
    id: 'train',
    word: 'TRAIN',
    category: 'vehicles',
    emoji: '🚂',
    image: '/assets/words/train.png',
    letters: ['T', 'R', 'A', 'I', 'N'],
    sentence: 'The train moves.',
    voice: 'Train',
    animation: 'move'
  },
  {
    id: 'house',
    word: 'HOUSE',
    category: 'objects',
    emoji: '🏠',
    image: '/assets/words/house.png',
    letters: ['H', 'O', 'U', 'S', 'E'],
    sentence: 'I live in a house.',
    voice: 'House',
    animation: 'bounce'
  },
  {
    id: 'cup',
    word: 'CUP',
    category: 'objects',
    emoji: '🥤',
    image: '/assets/words/cup.png',
    letters: ['C', 'U', 'P'],
    sentence: 'I drink from a cup.',
    voice: 'Cup',
    animation: 'bounce'
  },
  {
    id: 'hat',
    word: 'HAT',
    category: 'objects',
    emoji: '🎩',
    image: '/assets/words/hat.png',
    letters: ['H', 'A', 'T'],
    sentence: 'I wear a hat.',
    voice: 'Hat',
    animation: 'bounce'
  }
]

// Get word by ID
export function getWordById(id: string): WordLevel | undefined {
  return levels.find(level => level.id === id)
}

// Get words by category
export function getWordsByCategory(category: string): WordLevel[] {
  return levels.filter(level => level.category === category)
}

// Get all categories
export function getCategories(): string[] {
  return [...new Set(levels.map(level => level.category))]
}

// Get total word count
export function getTotalWordCount(): number {
  return levels.length
}
