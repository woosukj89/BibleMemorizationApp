import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface WordObject {
  word: string;
  isHidden: boolean;
}

interface VerseDisplayProps {
  words: WordObject[];
  verseNumber: number;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ words, verseNumber }) => (
  <View style={styles.container}>
    <Text style={styles.verseNumber}>Verse {verseNumber}</Text>
    <View style={styles.textContainer}>
      {words.map((wordObj, index) => (
        <View key={index} style={styles.wordContainer}>
          <Text style={[styles.word, wordObj.isHidden && styles.hiddenWord]}>
            {wordObj.word}
          </Text>
          {wordObj.isHidden && <View style={styles.hiddenBackground} />}
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordContainer: {
    position: 'relative',
    marginRight: 5,
    marginBottom: 5,
  },
  word: {
    fontSize: 18,
  },
  hiddenWord: {
    opacity: 0,
  },
  hiddenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
});

export default VerseDisplay;
