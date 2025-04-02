interface WordObject {
  word: string;
  isHidden: boolean;
}

export const hideWords = (text: string, difficulty: string): WordObject[] => {
  const words = text.match(/\S+/g) || [];
  let percentToHide: number;

  switch (difficulty) {
    case 'easy':
      percentToHide = 0.2;
      break;
    case 'medium':
      percentToHide = 0.50;
      break;
    case 'hard':
      percentToHide = 0.8;
      break;
    case 'full':
      percentToHide = 1;
      break;
    default:
      percentToHide = 0.5;
  }

  const wordHideable = (word: string) => 
    !/^[,.:;!"'?<>~@#$%^&*()<>{}\[\]]+$/.test(word) && (difficulty == 'full' || word.length > 1);

  // Filter out words that shouldn't be hidden
  const hideableWords = words.filter(word => 
    wordHideable(word)
  );

  const wordsToHide = Math.max(1, difficulty === 'easy' 
    ? Math.ceil(hideableWords.length * percentToHide) 
    : Math.floor(hideableWords.length * percentToHide)
  );

  const hiddenIndices = new Set<number>();

  while (hiddenIndices.size < wordsToHide) {
    const index = Math.floor(Math.random() * hideableWords.length);
    hiddenIndices.add(index);
  }

  let hideableIndex = 0;
  return words.map(word => {
    if (wordHideable(word)) {
      const isHidden = hiddenIndices.has(hideableIndex);
      hideableIndex++;
      return { word, isHidden };
    }
    return { word, isHidden: false };
  });
};
