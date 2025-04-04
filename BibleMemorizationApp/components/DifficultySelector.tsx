import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DifficultySelectorProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty }) => {
  const { t } = useTranslation();
  const difficulties = ['easy', 'medium', 'hard', 'full'];

  const getBackgroundColor = (level: string, isSelected: boolean) => {
    const colors = {
      easy: { normal: '#C6E2C6', selected: '#B8E6B8' },
      medium: { normal: '#FFF2CC', selected: '#FFE5B4' },
      hard: { normal: '#FFC9C9', selected: '#FFB3BA' },
      full: { normal: '#FF9999', selected: '#FF6B6B' },
    };
    return isSelected ? colors[level].selected : colors[level].normal;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('memorizationPage.difficulty')}</Text>
      <View style={styles.buttonContainer}>
        {difficulties.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.button,
              { backgroundColor: getBackgroundColor(level, difficulty === level) },
              difficulty === level && styles.activeButton
            ]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={styles.buttonText}>{t(`memorizationPage.${level}`)}</Text>
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
    borderColor: '#808080', // Pastel gray color for the outline
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default DifficultySelector;
