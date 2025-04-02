import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { initializeDatabase, tableNameObservable, tableNames } from '@/db/databaseService';

type RootStackParamList = {
  Home: undefined;
  SelectBook: undefined;
  Search: undefined;
  History: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentVersion, setCurrentVersion] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const subscribeVersionChanges = tableNameObservable.subscribe((newTableName) => {
      if (newTableName) {
        setCurrentVersion(tableNames[newTableName]);
      }
    });
    const loadDatabase = async () => {
      try {
        await initializeDatabase(i18n.resolvedLanguage!);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsLoading(false);
      }
    };

    loadDatabase();
    return subscribeVersionChanges;
  }, [i18n.resolvedLanguage]);

  const renderButton = (label: string, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.disabledButton]}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{t(label)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('appName')}</Text>
      <View style={styles.loadingIndicator}>
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.loadingText}>{t('loadingDatabase')}</Text>
          </>
        ) : (
          <Text style={styles.loadingText}>{t('currentVersion', { version: currentVersion })}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {renderButton('selectChapter', () => navigation.navigate('SelectBook'))}
        {renderButton('searchVerses', () => navigation.navigate('Search'))}
        {renderButton('history', () => navigation.navigate('History'))}
        {renderButton('settings', () => navigation.navigate('Settings'))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BFA58A',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 5,
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default HomeScreen;
