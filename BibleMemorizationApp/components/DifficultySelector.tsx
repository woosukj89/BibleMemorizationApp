import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DifficultySelectorProps {
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  maxDifficulty: number;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty, maxDifficulty }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Difficulty: {difficulty}</Text>
    <View style={styles.buttonContainer}>
      {[...Array(maxDifficulty)].map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, difficulty === index + 1 && styles.activeButton]}
          onPress={() => setDifficulty(index + 1)}
        >
          <Text style={styles.buttonText}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default DifficultySelector;
