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

// Category definitions
export interface Category {
  id: string
  name: string
  emoji: string
  color: string
}

export const categories: Category[] = [
  { id: 'animals', name: 'Animals', emoji: '🐾', color: '#FF6B6B' },
  { id: 'food', name: 'Food', emoji: '🍎', color: '#4ECDC4' },
  { id: 'nature', name: 'Nature', emoji: '🌿', color: '#45B7D1' },
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', color: '#96CEB4' },
  { id: 'objects', name: 'Objects', emoji: '📦', color: '#FFEAA7' },
  { id: 'body', name: 'Body', emoji: '👃', color: '#DDA0DD' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧', color: '#FFB6C1' },
  { id: 'colors', name: 'Colors', emoji: '🌈', color: '#87CEEB' }
]

export const levels: WordLevel[] = [
  // ========== Animals (20) ==========
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
  {
    id: 'tiger',
    word: 'TIGER',
    category: 'animals',
    emoji: '🐯',
    image: '/assets/words/tiger.png',
    letters: ['T', 'I', 'G', 'E', 'R'],
    sentence: 'The tiger is strong.',
    voice: 'Tiger',
    animation: 'roar'
  },
  {
    id: 'elephant',
    word: 'ELEPHANT',
    category: 'animals',
    emoji: '🐘',
    image: '/assets/words/elephant.png',
    letters: ['E', 'L', 'E', 'P', 'H', 'A', 'N', 'T'],
    sentence: 'The elephant is big.',
    voice: 'Elephant',
    animation: 'walk'
  },
  {
    id: 'giraffe',
    word: 'GIRAFFE',
    category: 'animals',
    emoji: '🦒',
    image: '/assets/words/giraffe.png',
    letters: ['G', 'I', 'R', 'A', 'F', 'F', 'E'],
    sentence: 'The giraffe is tall.',
    voice: 'Giraffe',
    animation: 'walk'
  },
  {
    id: 'snake',
    word: 'SNAKE',
    category: 'animals',
    emoji: '🐍',
    image: '/assets/words/snake.png',
    letters: ['S', 'N', 'A', 'K', 'E'],
    sentence: 'The snake slithers.',
    voice: 'Snake',
    animation: 'slither'
  },
  {
    id: 'owl',
    word: 'OWL',
    category: 'animals',
    emoji: '🦉',
    image: '/assets/words/owl.png',
    letters: ['O', 'W', 'L'],
    sentence: 'The owl hoots.',
    voice: 'Owl',
    animation: 'fly'
  },

  // ========== Food (20) ==========
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
  {
    id: 'water',
    word: 'WATER',
    category: 'food',
    emoji: '💧',
    image: '/assets/words/water.png',
    letters: ['W', 'A', 'T', 'E', 'R'],
    sentence: 'I drink water.',
    voice: 'Water',
    animation: 'splash'
  },
  {
    id: 'juice',
    word: 'JUICE',
    category: 'food',
    emoji: '🧃',
    image: '/assets/words/juice.png',
    letters: ['J', 'U', 'I', 'C', 'E'],
    sentence: 'I like juice.',
    voice: 'Juice',
    animation: 'drink'
  },
  {
    id: 'pizza',
    word: 'PIZZA',
    category: 'food',
    emoji: '🍕',
    image: '/assets/words/pizza.png',
    letters: ['P', 'I', 'Z', 'Z', 'A'],
    sentence: 'Pizza is yummy.',
    voice: 'Pizza',
    animation: 'eat'
  },
  {
    id: 'candy',
    word: 'CANDY',
    category: 'food',
    emoji: '🍬',
    image: '/assets/words/candy.png',
    letters: ['C', 'A', 'N', 'D', 'Y'],
    sentence: 'I like candy.',
    voice: 'Candy',
    animation: 'bounce'
  },
  {
    id: 'cherry',
    word: 'CHERRY',
    category: 'food',
    emoji: '🍒',
    image: '/assets/words/cherry.png',
    letters: ['C', 'H', 'E', 'R', 'R', 'Y'],
    sentence: 'Cherry is red.',
    voice: 'Cherry',
    animation: 'bounce'
  },
  {
    id: 'lemon',
    word: 'LEMON',
    category: 'food',
    emoji: '🍋',
    image: '/assets/words/lemon.png',
    letters: ['L', 'E', 'M', 'O', 'N'],
    sentence: 'Lemon is sour.',
    voice: 'Lemon',
    animation: 'bounce'
  },
  {
    id: 'peach',
    word: 'PEACH',
    category: 'food',
    emoji: '🍑',
    image: '/assets/words/peach.png',
    letters: ['P', 'E', 'A', 'C', 'H'],
    sentence: 'Peach is soft.',
    voice: 'Peach',
    animation: 'bounce'
  },
  {
    id: 'melon',
    word: 'MELON',
    category: 'food',
    emoji: '🍈',
    image: '/assets/words/melon.png',
    letters: ['M', 'E', 'L', 'O', 'N'],
    sentence: 'Melon is green.',
    voice: 'Melon',
    animation: 'bounce'
  },
  {
    id: 'pear',
    word: 'PEAR',
    category: 'food',
    emoji: '🍐',
    image: '/assets/words/pear.png',
    letters: ['P', 'E', 'A', 'R'],
    sentence: 'I eat a pear.',
    voice: 'Pear',
    animation: 'bounce'
  },
  {
    id: 'soup',
    word: 'SOUP',
    category: 'food',
    emoji: '🥣',
    image: '/assets/words/soup.png',
    letters: ['S', 'O', 'U', 'P'],
    sentence: 'Soup is hot.',
    voice: 'Soup',
    animation: 'bounce'
  },

  // ========== Nature (20) ==========
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
  {
    id: 'sky',
    word: 'SKY',
    category: 'nature',
    emoji: '🌤️',
    image: '/assets/words/sky.png',
    letters: ['S', 'K', 'Y'],
    sentence: 'The sky is blue.',
    voice: 'Sky',
    animation: 'shine'
  },
  {
    id: 'wind',
    word: 'WIND',
    category: 'nature',
    emoji: '💨',
    image: '/assets/words/wind.png',
    letters: ['W', 'I', 'N', 'D'],
    sentence: 'The wind blows.',
    voice: 'Wind',
    animation: 'blow'
  },
  {
    id: 'river',
    word: 'RIVER',
    category: 'nature',
    emoji: '🏞️',
    image: '/assets/words/river.png',
    letters: ['R', 'I', 'V', 'E', 'R'],
    sentence: 'The river flows.',
    voice: 'River',
    animation: 'flow'
  },
  {
    id: 'mountain',
    word: 'MOUNTAIN',
    category: 'nature',
    emoji: '⛰️',
    image: '/assets/words/mountain.png',
    letters: ['M', 'O', 'U', 'N', 'T', 'A', 'I', 'N'],
    sentence: 'The mountain is high.',
    voice: 'Mountain',
    animation: 'grow'
  },
  {
    id: 'garden',
    word: 'GARDEN',
    category: 'nature',
    emoji: '🌻',
    image: '/assets/words/garden.png',
    letters: ['G', 'A', 'R', 'D', 'E', 'N'],
    sentence: 'I like the garden.',
    voice: 'Garden',
    animation: 'bloom'
  },
  {
    id: 'beach',
    word: 'BEACH',
    category: 'nature',
    emoji: '🏖️',
    image: '/assets/words/beach.png',
    letters: ['B', 'E', 'A', 'C', 'H'],
    sentence: 'I play at the beach.',
    voice: 'Beach',
    animation: 'wave'
  },
  {
    id: 'forest',
    word: 'FOREST',
    category: 'nature',
    emoji: '🌲',
    image: '/assets/words/forest.png',
    letters: ['F', 'O', 'R', 'E', 'S', 'T'],
    sentence: 'The forest is dark.',
    voice: 'Forest',
    animation: 'sway'
  },
  {
    id: 'island',
    word: 'ISLAND',
    category: 'nature',
    emoji: '🏝️',
    image: '/assets/words/island.png',
    letters: ['I', 'S', 'L', 'A', 'N', 'D'],
    sentence: 'The island is small.',
    voice: 'Island',
    animation: 'float'
  },
  {
    id: 'ocean',
    word: 'OCEAN',
    category: 'nature',
    emoji: '🌊',
    image: '/assets/words/ocean.png',
    letters: ['O', 'C', 'E', 'A', 'N'],
    sentence: 'The ocean is deep.',
    voice: 'Ocean',
    animation: 'wave'
  },
  {
    id: 'earth',
    word: 'EARTH',
    category: 'nature',
    emoji: '🌍',
    image: '/assets/words/earth.png',
    letters: ['E', 'A', 'R', 'T', 'H'],
    sentence: 'Earth is our home.',
    voice: 'Earth',
    animation: 'spin'
  },

  // ========== Vehicles (10) ==========
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
    id: 'bike',
    word: 'BIKE',
    category: 'vehicles',
    emoji: '🚲',
    image: '/assets/words/bike.png',
    letters: ['B', 'I', 'K', 'E'],
    sentence: 'I ride a bike.',
    voice: 'Bike',
    animation: 'ride'
  },
  {
    id: 'truck',
    word: 'TRUCK',
    category: 'vehicles',
    emoji: '🚚',
    image: '/assets/words/truck.png',
    letters: ['T', 'R', 'U', 'C', 'K'],
    sentence: 'The truck is big.',
    voice: 'Truck',
    animation: 'drive'
  },
  {
    id: 'ship',
    word: 'SHIP',
    category: 'vehicles',
    emoji: '🚢',
    image: '/assets/words/ship.png',
    letters: ['S', 'H', 'I', 'P'],
    sentence: 'The ship sails.',
    voice: 'Ship',
    animation: 'sail'
  },
  {
    id: 'helicopter',
    word: 'HELICOPTER',
    category: 'vehicles',
    emoji: '🚁',
    image: '/assets/words/helicopter.png',
    letters: ['H', 'E', 'L', 'I', 'C', 'O', 'P', 'T', 'E', 'R'],
    sentence: 'The helicopter flies.',
    voice: 'Helicopter',
    animation: 'fly'
  },
  {
    id: 'rocket',
    word: 'ROCKET',
    category: 'vehicles',
    emoji: '🚀',
    image: '/assets/words/rocket.png',
    letters: ['R', 'O', 'C', 'K', 'E', 'T'],
    sentence: 'The rocket flies up.',
    voice: 'Rocket',
    animation: 'fly'
  },

  // ========== Objects (15) ==========
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
  },
  {
    id: 'toy',
    word: 'TOY',
    category: 'objects',
    emoji: '🧸',
    image: '/assets/words/toy.png',
    letters: ['T', 'O', 'Y'],
    sentence: 'I play with a toy.',
    voice: 'Toy',
    animation: 'bounce'
  },
  {
    id: 'door',
    word: 'DOOR',
    category: 'objects',
    emoji: '🚪',
    image: '/assets/words/door.png',
    letters: ['D', 'O', 'O', 'R'],
    sentence: 'Open the door.',
    voice: 'Door',
    animation: 'open'
  },
  {
    id: 'chair',
    word: 'CHAIR',
    category: 'objects',
    emoji: '🪑',
    image: '/assets/words/chair.png',
    letters: ['C', 'H', 'A', 'I', 'R'],
    sentence: 'I sit on a chair.',
    voice: 'Chair',
    animation: 'bounce'
  },
  {
    id: 'table',
    word: 'TABLE',
    category: 'objects',
    emoji: '🪑',
    image: '/assets/words/table.png',
    letters: ['T', 'A', 'B', 'L', 'E'],
    sentence: 'Food is on the table.',
    voice: 'Table',
    animation: 'bounce'
  },
  {
    id: 'bed',
    word: 'BED',
    category: 'objects',
    emoji: '🛏️',
    image: '/assets/words/bed.png',
    letters: ['B', 'E', 'D'],
    sentence: 'I sleep in a bed.',
    voice: 'Bed',
    animation: 'sleep'
  },
  {
    id: 'phone',
    word: 'PHONE',
    category: 'objects',
    emoji: '📱',
    image: '/assets/words/phone.png',
    letters: ['P', 'H', 'O', 'N', 'E'],
    sentence: 'I use a phone.',
    voice: 'Phone',
    animation: 'ring'
  },
  {
    id: 'clock',
    word: 'CLOCK',
    category: 'objects',
    emoji: '🕐',
    image: '/assets/words/clock.png',
    letters: ['C', 'L', 'O', 'C', 'K'],
    sentence: 'The clock ticks.',
    voice: 'Clock',
    animation: 'tick'
  },
  {
    id: 'box',
    word: 'BOX',
    category: 'objects',
    emoji: '📦',
    image: '/assets/words/box.png',
    letters: ['B', 'O', 'X'],
    sentence: 'I open the box.',
    voice: 'Box',
    animation: 'open'
  },
  {
    id: 'key',
    word: 'KEY',
    category: 'objects',
    emoji: '🔑',
    image: '/assets/words/key.png',
    letters: ['K', 'E', 'Y'],
    sentence: 'I use a key.',
    voice: 'Key',
    animation: 'bounce'
  },
  {
    id: 'bag',
    word: 'BAG',
    category: 'objects',
    emoji: '👜',
    image: '/assets/words/bag.png',
    letters: ['B', 'A', 'G'],
    sentence: 'I carry a bag.',
    voice: 'Bag',
    animation: 'bounce'
  },

  // ========== Body (10) ==========
  {
    id: 'hand',
    word: 'HAND',
    category: 'body',
    emoji: '✋',
    image: '/assets/words/hand.png',
    letters: ['H', 'A', 'N', 'D'],
    sentence: 'I wave my hand.',
    voice: 'Hand',
    animation: 'wave'
  },
  {
    id: 'eye',
    word: 'EYE',
    category: 'body',
    emoji: '👁️',
    image: '/assets/words/eye.png',
    letters: ['E', 'Y', 'E'],
    sentence: 'I see with my eyes.',
    voice: 'Eye',
    animation: 'blink'
  },
  {
    id: 'nose',
    word: 'NOSE',
    category: 'body',
    emoji: '👃',
    image: '/assets/words/nose.png',
    letters: ['N', 'O', 'S', 'E'],
    sentence: 'I smell with my nose.',
    voice: 'Nose',
    animation: 'wiggle'
  },
  {
    id: 'mouth',
    word: 'MOUTH',
    category: 'body',
    emoji: '👄',
    image: '/assets/words/mouth.png',
    letters: ['M', 'O', 'U', 'T', 'H'],
    sentence: 'I eat with my mouth.',
    voice: 'Mouth',
    animation: 'talk'
  },
  {
    id: 'ear',
    word: 'EAR',
    category: 'body',
    emoji: '👂',
    image: '/assets/words/ear.png',
    letters: ['E', 'A', 'R'],
    sentence: 'I hear with my ears.',
    voice: 'Ear',
    animation: 'listen'
  },
  {
    id: 'foot',
    word: 'FOOT',
    category: 'body',
    emoji: '🦶',
    image: '/assets/words/foot.png',
    letters: ['F', 'O', 'O', 'T'],
    sentence: 'I kick with my foot.',
    voice: 'Foot',
    animation: 'kick'
  },
  {
    id: 'head',
    word: 'HEAD',
    category: 'body',
    emoji: '😊',
    image: '/assets/words/head.png',
    letters: ['H', 'E', 'A', 'D'],
    sentence: 'I nod my head.',
    voice: 'Head',
    animation: 'nod'
  },
  {
    id: 'hair',
    word: 'HAIR',
    category: 'body',
    emoji: '💇',
    image: '/assets/words/hair.png',
    letters: ['H', 'A', 'I', 'R'],
    sentence: 'My hair is long.',
    voice: 'Hair',
    animation: 'sway'
  },
  {
    id: 'arm',
    word: 'ARM',
    category: 'body',
    emoji: '💪',
    image: '/assets/words/arm.png',
    letters: ['A', 'R', 'M'],
    sentence: 'I lift my arm.',
    voice: 'Arm',
    animation: 'lift'
  },
  {
    id: 'leg',
    word: 'LEG',
    category: 'body',
    emoji: '🦵',
    image: '/assets/words/leg.png',
    letters: ['L', 'E', 'G'],
    sentence: 'I kick with my leg.',
    voice: 'Leg',
    animation: 'kick'
  },

  // ========== Family (10) ==========
  {
    id: 'mom',
    word: 'MOM',
    category: 'family',
    emoji: '👩',
    image: '/assets/words/mom.png',
    letters: ['M', 'O', 'M'],
    sentence: 'I love my mom.',
    voice: 'Mom',
    animation: 'wave'
  },
  {
    id: 'dad',
    word: 'DAD',
    category: 'family',
    emoji: '👨',
    image: '/assets/words/dad.png',
    letters: ['D', 'A', 'D'],
    sentence: 'I love my dad.',
    voice: 'Dad',
    animation: 'wave'
  },
  {
    id: 'baby',
    word: 'BABY',
    category: 'family',
    emoji: '👶',
    image: '/assets/words/baby.png',
    letters: ['B', 'A', 'B', 'Y'],
    sentence: 'The baby sleeps.',
    voice: 'Baby',
    animation: 'sleep'
  },
  {
    id: 'boy',
    word: 'BOY',
    category: 'family',
    emoji: '👦',
    image: '/assets/words/boy.png',
    letters: ['B', 'O', 'Y'],
    sentence: 'The boy plays.',
    voice: 'Boy',
    animation: 'play'
  },
  {
    id: 'girl',
    word: 'GIRL',
    category: 'family',
    emoji: '👧',
    image: '/assets/words/girl.png',
    letters: ['G', 'I', 'R', 'L'],
    sentence: 'The girl sings.',
    voice: 'Girl',
    animation: 'sing'
  },
  {
    id: 'friend',
    word: 'FRIEND',
    category: 'family',
    emoji: '👫',
    image: '/assets/words/friend.png',
    letters: ['F', 'R', 'I', 'E', 'N', 'D'],
    sentence: 'My friend is nice.',
    voice: 'Friend',
    animation: 'wave'
  },
  {
    id: 'sister',
    word: 'SISTER',
    category: 'family',
    emoji: '👧',
    image: '/assets/words/sister.png',
    letters: ['S', 'I', 'S', 'T', 'E', 'R'],
    sentence: 'My sister is kind.',
    voice: 'Sister',
    animation: 'wave'
  },
  {
    id: 'brother',
    word: 'BROTHER',
    category: 'family',
    emoji: '👦',
    image: '/assets/words/brother.png',
    letters: ['B', 'R', 'O', 'T', 'H', 'E', 'R'],
    sentence: 'My brother is fun.',
    voice: 'Brother',
    animation: 'play'
  },
  {
    id: 'family',
    word: 'FAMILY',
    category: 'family',
    emoji: '👨‍👩‍👧‍👦',
    image: '/assets/words/family.png',
    letters: ['F', 'A', 'M', 'I', 'L', 'Y'],
    sentence: 'I love my family.',
    voice: 'Family',
    animation: 'wave'
  },
  {
    id: 'teacher',
    word: 'TEACHER',
    category: 'family',
    emoji: '👩‍🏫',
    image: '/assets/words/teacher.png',
    letters: ['T', 'E', 'A', 'C', 'H', 'E', 'R'],
    sentence: 'My teacher is nice.',
    voice: 'Teacher',
    animation: 'wave'
  },

  // ========== Colors (5) ==========
  {
    id: 'red',
    word: 'RED',
    category: 'colors',
    emoji: '🔴',
    image: '/assets/words/red.png',
    letters: ['R', 'E', 'D'],
    sentence: 'The apple is red.',
    voice: 'Red',
    animation: 'bounce'
  },
  {
    id: 'blue',
    word: 'BLUE',
    category: 'colors',
    emoji: '🔵',
    image: '/assets/words/blue.png',
    letters: ['B', 'L', 'U', 'E'],
    sentence: 'The sky is blue.',
    voice: 'Blue',
    animation: 'bounce'
  },
  {
    id: 'green',
    word: 'GREEN',
    category: 'colors',
    emoji: '🟢',
    image: '/assets/words/green.png',
    letters: ['G', 'R', 'E', 'E', 'N'],
    sentence: 'The grass is green.',
    voice: 'Green',
    animation: 'bounce'
  },
  {
    id: 'yellow',
    word: 'YELLOW',
    category: 'colors',
    emoji: '🟡',
    image: '/assets/words/yellow.png',
    letters: ['Y', 'E', 'L', 'L', 'O', 'W'],
    sentence: 'The sun is yellow.',
    voice: 'Yellow',
    animation: 'bounce'
  },
  {
    id: 'pink',
    word: 'PINK',
    category: 'colors',
    emoji: '🩷',
    image: '/assets/words/pink.png',
    letters: ['P', 'I', 'N', 'K'],
    sentence: 'The flower is pink.',
    voice: 'Pink',
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
