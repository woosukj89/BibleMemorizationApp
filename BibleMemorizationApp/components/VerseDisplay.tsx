import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VerseDisplayProps {
  text: string;
  verseNumber: number;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ text, verseNumber }) => (
  <View style={styles.container}>
    <Text style={styles.verseNumber}>Verse {verseNumber}</Text>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default VerseDisplay;
