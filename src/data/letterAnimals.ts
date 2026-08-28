// Letter Animal Shapes - Each letter represented by an animal starting with that letter
// A=Alligator, B=Bird, C=Cat, D=Dog, E=Elephant, F=Fish, etc.

export interface LetterAnimal {
  letter: string
  animal: string
  emoji: string
  color: string
  bgColor: string
  shape: 'circle' | 'square' | 'rounded' | 'star' | 'diamond'
}

export const letterAnimals: Record<string, LetterAnimal> = {
  A: { letter: 'A', animal: 'Alligator', emoji: '🐊', color: '#2ECC71', bgColor: '#E8F8F0', shape: 'rounded' },
  B: { letter: 'B', animal: 'Bird', emoji: '🐦', color: '#3498DB', bgColor: '#EBF5FB', shape: 'circle' },
  C: { letter: 'C', animal: 'Cat', emoji: '🐱', color: '#E67E22', bgColor: '#FDF2E9', shape: 'circle' },
  D: { letter: 'D', animal: 'Dog', emoji: '🐶', color: '#E74C3C', bgColor: '#FDEDEC', shape: 'rounded' },
  E: { letter: 'E', animal: 'Elephant', emoji: '🐘', color: '#9B59B6', bgColor: '#F5EEF8', shape: 'square' },
  F: { letter: 'F', animal: 'Fish', emoji: '🐟', color: '#1ABC9C', bgColor: '#E8F8F5', shape: 'diamond' },
  G: { letter: 'G', animal: 'Giraffe', emoji: '🦒', color: '#F39C12', bgColor: '#FEF9E7', shape: 'rounded' },
  H: { letter: 'H', animal: 'Horse', emoji: '🐴', color: '#8B4513', bgColor: '#FDF2E9', shape: 'circle' },
  I: { letter: 'I', animal: 'Iguana', emoji: '🦎', color: '#27AE60', bgColor: '#E8F8F0', shape: 'diamond' },
  J: { letter: 'J', animal: 'Jellyfish', emoji: '🪼', color: '#E91E91', bgColor: '#FDE7F3', shape: 'circle' },
  K: { letter: 'K', animal: 'Koala', emoji: '🐨', color: '#7F8C8D', bgColor: '#F2F3F4', shape: 'circle' },
  L: { letter: 'L', animal: 'Lion', emoji: '🦁', color: '#F1C40F', bgColor: '#FEF9E7', shape: 'star' },
  M: { letter: 'M', animal: 'Monkey', emoji: '🐒', color: '#D35400', bgColor: '#FDF2E9', shape: 'circle' },
  N: { letter: 'N', animal: 'Narwhal', emoji: '🐳', color: '#2980B9', bgColor: '#EBF5FB', shape: 'rounded' },
  O: { letter: 'O', animal: 'Owl', emoji: '🦉', color: '#8E44AD', bgColor: '#F5EEF8', shape: 'circle' },
  P: { letter: 'P', animal: 'Penguin', emoji: '🐧', color: '#2C3E50', bgColor: '#EBF5FB', shape: 'rounded' },
  Q: { letter: 'Q', animal: 'Quail', emoji: '🐦', color: '#C0392B', bgColor: '#FDEDEC', shape: 'circle' },
  R: { letter: 'R', animal: 'Rabbit', emoji: '🐰', color: '#FF69B4', bgColor: '#FDE7F3', shape: 'circle' },
  S: { letter: 'S', animal: 'Snake', emoji: '🐍', color: '#2ECC71', bgColor: '#E8F8F0', shape: 'diamond' },
  T: { letter: 'T', animal: 'Turtle', emoji: '🐢', color: '#16A085', bgColor: '#E8F8F5', shape: 'rounded' },
  U: { letter: 'U', animal: 'Unicorn', emoji: '🦄', color: '#9B59B6', bgColor: '#F5EEF8', shape: 'star' },
  V: { letter: 'V', animal: 'Vulture', emoji: '🦅', color: '#795548', bgColor: '#EFEBE9', shape: 'circle' },
  W: { letter: 'W', animal: 'Whale', emoji: '🐋', color: '#2196F3', bgColor: '#E3F2FD', shape: 'rounded' },
  X: { letter: 'X', animal: 'X-ray Fish', emoji: '🐠', color: '#FF5722', bgColor: '#FBE9E7', shape: 'diamond' },
  Y: { letter: 'Y', animal: 'Yak', emoji: '🐂', color: '#607D8B', bgColor: '#ECEFF1', shape: 'circle' },
  Z: { letter: 'Z', animal: 'Zebra', emoji: '🦓', color: '#000000', bgColor: '#F5F5F5', shape: 'rounded' }
}

// Get animal for a letter
export function getLetterAnimal(letter: string): LetterAnimal {
  return letterAnimals[letter.toUpperCase()] || {
    letter: letter,
    animal: 'Animal',
    emoji: '🐾',
    color: '#95A5A6',
    bgColor: '#F2F3F4',
    shape: 'circle'
  }
}

// Get shape class for a letter
export function getLetterShapeClass(letter: string): string {
  const animal = getLetterAnimal(letter)
  return `shape-${animal.shape}`
}
