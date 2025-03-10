import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

// Assume we have a function to get available translations
import { getAvailableTranslations, setTableName, tableNames } from '@/db/databaseService';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Settings: { versionChanged: boolean };
}

type SettingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
    navigation: SettingScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [selectedTranslation, setSelectedTranslation] = useState('');
  const [availableTranslations, setAvailableTranslations] = useState<string[]>([]);

  useEffect(() => {
    loadAvailableTranslations();
  }, [i18n.resolvedLanguage]);

  const loadAvailableTranslations = async () => {
    const translations = await getAvailableTranslations(i18n.resolvedLanguage!);
    setAvailableTranslations(translations);
    // Default to first available
    setSelectedTranslation(translations[0]);
    setTableName(translations[0]);
    await AsyncStorage.setItem('selected-translation', translations[0]);
  };

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
  };

  const changeTranslation = async (translation: string) => {
    setSelectedTranslation(translation);
    setTableName(translation);
    navigation.setParams({ versionChanged: true });
    await AsyncStorage.setItem('selected-translation', translation);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settingsPage.languageSettings')}</Text>
      <RadioButton.Group onValueChange={changeLanguage} value={i18n.resolvedLanguage!}>
        <View style={styles.radioItem}>
          <RadioButton value="en" />
          <Text style={styles.radioLabel}>English</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="ko" />
          <Text style={styles.radioLabel}>한국어</Text>
        </View>
      </RadioButton.Group>

      <Text style={styles.sectionTitle}>{t('settingsPage.translations')}</Text>
      <RadioButton.Group onValueChange={changeTranslation} value={selectedTranslation}>
        {availableTranslations.map((translation) => (
          <View key={translation} style={styles.radioItem}>
            <RadioButton value={translation} />
            <Text style={styles.radioLabel}>{tableNames[translation]}</Text>
          </View>
        ))}
      </RadioButton.Group>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SettingsScreen;
