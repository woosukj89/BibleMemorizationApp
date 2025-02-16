import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DifficultySelectorProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty }) => {
  const difficulties = ['easy', 'medium', 'hard', 'full'];

  const getBackgroundColor = (level: string) => {
    switch (level) {
      case 'easy':
        return '#B8E6B8'; // Pastel Green
      case 'medium':
        return '#FFE5B4'; // Pastel Yellow
      case 'hard':
        return '#FFB3BA'; // Pastel Pink
      case 'full':
        return '#FF6B6B'; // Pastel Red
      default:
        return '#FFFFFF'; // White
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Difficulty:</Text>
      <View style={styles.buttonContainer}>
        {difficulties.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.button, { backgroundColor: getBackgroundColor(level) }, difficulty === level && styles.activeButton]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={styles.buttonText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

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
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeButton: {
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default DifficultySelector;
