import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Pressable, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { getVerseText } from '@/utils/bibleData';
import { hideWords } from '@/utils/wordHiding';
import DifficultySelector from '@/components/DifficultySelector';
import VerseDisplay from '@/components/VerseDisplay';

type RootStackParamList = {
  Memorization: { book: string; chapter: number };
};

type MemorizationScreenRouteProp = RouteProp<RootStackParamList, 'Memorization'>;

interface MemorizationScreenProps {
  route: MemorizationScreenRouteProp;
}

const MemorizationScreen: React.FC<MemorizationScreenProps> = ({ route }) => {
  const { book, chapter } = route.params;
  const [verse, setVerse] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [hiddenText, setHiddenText] = useState('');
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    loadVerse();
  }, [verse, difficulty]);

  const loadVerse = async () => {
    const fullText = getVerseText(book, chapter, verse);
    const hidden = hideWords(fullText, difficulty);
    setHiddenText(hidden);
    await AsyncStorage.setItem('lastVerse', JSON.stringify({ book, chapter, verse }));
  };

  const nextVerse = () => {
    setVerse(v => v + 1);
  };

  const refreshHiddenWords = () => {
    loadVerse();
  };

  return (
    <View style={styles.container}>
      <DifficultySelector
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        maxDifficulty={10}
      />
      <VerseDisplay text={showFullText ? getVerseText(book, chapter, verse) : hiddenText} verseNumber={verse} />
      <View style={styles.buttonContainer}>
        <Pressable
            onPressIn={() => setShowFullText(true)}
            onPressOut={() => setShowFullText(false)}
            >
            <Text style={styles.pressableText}>Reveal</Text>
        </Pressable>
        <Button title="Next" onPress={nextVerse} />
        <Button title="Refresh" onPress={refreshHiddenWords} />
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
    justifyContent: 'space-between',
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
