interface WordObject {
  word: string;
  isHidden: boolean;
}

export const hideWords = (text: string, difficulty: string): WordObject[] => {
  const words = text.split(' ');
  let percentToHide: number;

  switch (difficulty) {
    case 'easy':
      percentToHide = 0.1;
      break;
    case 'medium':
      percentToHide = 0.45;
      break;
    case 'hard':
      percentToHide = 0.9;
      break;
    case 'full':
      percentToHide = 1;
      break;
    default:
      percentToHide = 0.1;
  }

  const wordsToHide = Math.max(1, Math.floor(words.length * percentToHide));
  const hiddenIndices = new Set();

  while (hiddenIndices.size < wordsToHide) {
    const index = Math.floor(Math.random() * words.length);
    hiddenIndices.add(index);
  }

  return words.map((word, index) => ({
    word,
    isHidden: hiddenIndices.has(index)
  }));
};
