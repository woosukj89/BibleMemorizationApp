import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getLastVerse, getVerseText } from '@/utils/bibleData';
import { hideWords } from '@/utils/wordHiding';
import DifficultySelector from '@/components/DifficultySelector';
import VerseDisplay from '@/components/VerseDisplay';
import { WordObject } from '@/components/VerseDisplay';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Memorization: { book: string; chapter: number, fromSearch: boolean; fromChapter: boolean; };
};

type MemorizationScreenRouteProp = RouteProp<RootStackParamList, 'Memorization'>;

interface MemorizationScreenProps {
  route: MemorizationScreenRouteProp;
}

const MemorizationScreen: React.FC<MemorizationScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { book, chapter, verse: initialVerse, endVerse: lastVerse, fromSearch, fromChapter } = 
    route.params as { book: string; chapter: number; verse?: number; endVerse?: number; fromSearch: boolean; fromChapter: boolean };
  const [verse, setVerse] = useState(initialVerse || 1);
  const [difficulty, setDifficulty] = useState('easy');
  const [hiddenText, setHiddenText] = useState<WordObject[]>([]);
  const [showFullText, setShowFullText] = useState(false);
  const [endVerse, setEndVerse] = useState(lastVerse || getLastVerse(book, chapter));

  useEffect(() => {
    loadVerse();
  }, [verse, difficulty]);

  const loadVerse = async () => {
    const fullText = getVerseText(book, chapter, verse, endVerse);
    const hidden = hideWords(fullText, difficulty);
    setHiddenText(hidden);
  };

  const nextVerse = () => {
    setVerse(v => Math.min(v + 1, endVerse));
  };

  const previousVerse = () => {
    setVerse(v => v > (initialVerse || 1) ? v - 1 : v);
  };

  const refreshHiddenWords = () => {
    loadVerse();
  };

  return (
    <View style={styles.container}>
      <DifficultySelector
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <VerseDisplay
        words={showFullText ? getVerseText(book, chapter, verse).split(' ').map(word => ({ word, isHidden: false })) : hiddenText}
        verseNumber={verse}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            onPressIn={() => setShowFullText(true)}
            onPressOut={() => setShowFullText(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Icon name="eye" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={previousVerse} hitSlop={{ top: 10, bottom: 10, left: 15, right: 10 }} disabled={verse === 0}>
            <Icon name="chevron-back" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextVerse} hitSlop={{ top: 10, bottom: 10, left: 10, right: 15 }} disabled={verse == endVerse}>
            <Icon name="chevron-forward" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshHiddenWords} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="refresh" size={30} color="#007AFF" />
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
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  }
});

export default MemorizationScreen;
