import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToHistory = async (book: string, chapter: number, verse?: number, endVerse?: number) => {
  const history = await AsyncStorage.getItem('verseHistory');
  let historyArray = history ? JSON.parse(history) : [];
  
  const newEntry = { 
    book, 
    chapter, 
    startVerse: verse, 
    endVerse: endVerse, 
    date: new Date().toISOString() 
  };
  
  historyArray = historyArray.filter(entry => 
    !(entry.book === book && entry.chapter === chapter && 
      entry.startVerse === verse && entry.endVerse === endVerse)
  );
  
  historyArray.unshift(newEntry);
  historyArray = historyArray.slice(0, 30);
  
  await AsyncStorage.setItem('verseHistory', JSON.stringify(historyArray));
};
