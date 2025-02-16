export const hideWords = (text: string, difficulty: number): string => {
  const words = text.split(' ');
  const wordsToHide = Math.min(difficulty, words.length);
  const hiddenIndices: number[] = [];

  while (hiddenIndices.length < wordsToHide) {
    const index = Math.floor(Math.random() * words.length);
    if (!hiddenIndices.includes(index)) {
      hiddenIndices.push(index);
    }
  }

  return words.map((word, index) => 
    hiddenIndices.includes(index) ? '_'.repeat(word.length) : word
  ).join(' ');
};
