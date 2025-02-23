import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getVerses } from '@/db/databaseService';
import { hideWords } from '@/utils/wordHiding';
import DifficultySelector from '@/components/DifficultySelector';
import VerseDisplay from '@/components/VerseDisplay';
import { WordObject } from '@/components/VerseDisplay';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Memorization: { book: string; chapter: number, fromSearch: boolean; fromChapter: boolean; verse?: string; endVerse?: string; };
};

type MemorizationScreenRouteProp = RouteProp<RootStackParamList, 'Memorization'>;

interface MemorizationScreenProps {
  route: MemorizationScreenRouteProp;
}

const MemorizationScreen: React.FC<MemorizationScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { book, chapter, verse: initialVerse, endVerse: lastVerse, fromSearch, fromChapter } = 
    route.params as { book: string; chapter: number; verse?: number; endVerse?: number; fromSearch: boolean; fromChapter: boolean };
  const [verse, setVerse] = useState(parseInt(initialVerse) || 1);
  const [difficulty, setDifficulty] = useState('easy');
  const [fullText, setFullText] = useState<{[verseNumber: number]: string}>({});
  const [hiddenText, setHiddenText] = useState<WordObject[]>([]);
  const [showFullText, setShowFullText] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    loadVerse();
  }, [book, chapter, initialVerse, lastVerse])

  useEffect(() => {
    refreshVerse();
    setHasPrevious(verse > (initialVerse || 1));
    setHasNext((parseInt(verse) + 1) in fullText);
  }, [fullText, verse, difficulty]);

  const refreshVerse = () => {
    const text = getVerseText(verse).replace(/\s+/g, ' ');
    const hidden = hideWords(text, difficulty);
    setHiddenText(hidden);
  }

  // const loadVerse = async () => {
  //   const fullText = getVerseText(book, chapter, verse, endVerse);
  //   const hidden = hideWords(fullText, difficulty);
  //   setHiddenText(hidden);
  // };

  const loadVerse = async () => {
    try {
      const verses = await getVerses(book, chapter, initialVerse, lastVerse);
      if (verses) {
        setFullText(verses);
      }
    } catch (error) {
      console.error('Error loading verse:', error);
    }
  };

  const getVerseText = (verse: number) => fullText && verse in fullText ? fullText[verse].replace(/\s+/g, ' ') : "";

  const nextVerse = () => {
    setVerse(v => v + 1 in fullText ? v + 1 : v);
  };

  const previousVerse = () => {
    setVerse(v => v > (initialVerse || 1) ? v - 1 : v);
  };

  const refreshHiddenWords = () => {
    refreshVerse()
  };

  return (
    <View style={styles.container}>
      <DifficultySelector
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <VerseDisplay
        words={showFullText ? getVerseText(verse).split(' ').map(word => ({ word, isHidden: false })) : hiddenText}
        verseNumber={verse}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            onPressIn={() => setShowFullText(true)}
            onPressOut={() => setShowFullText(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Icon name="eye" size={30} color="#78A2CC" />
        </TouchableOpacity>
        <TouchableOpacity onPress={previousVerse} hitSlop={{ top: 10, bottom: 10, left: 15, right: 10 }} disabled={!hasPrevious}>
            <Icon name="chevron-back" size={30} color={hasPrevious ? "#78A2CC" : "#CCCCCC"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextVerse} hitSlop={{ top: 10, bottom: 10, left: 10, right: 15 }} disabled={!hasNext}>
            <Icon name="chevron-forward" size={30} color={hasNext ? "#78A2CC" : "#CCCCCC"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshHiddenWords} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="refresh" size={30} color="#78A2CC" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  pressableText: {
    color: 'white',
    backgroundColor: '#A4C3D2',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  }
});

export default MemorizationScreen;
