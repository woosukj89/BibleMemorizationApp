import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { saveToHistory } from '@/utils/history';
import { useTranslation } from 'react-i18next';
import { getBooks, getChapters } from '@/db/databaseService';
import { ButtonGroup } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  SelectBook: undefined;
  SelectChapter: { book: string };
  Memorization: { book: string; chapter: number; fromChapter: boolean };
};

type SelectBookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectBook'>;

interface SelectBookScreenProps {
  navigation: SelectBookScreenNavigationProp;
}

const SelectBookScreen: React.FC<SelectBookScreenProps> = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  
  const sortedBooks = useMemo(() => {
    const allBooks = getBooks();
    if (isAlphabetical) {
      return {
        oldTestament: [...allBooks.slice(0, 39)].sort(),
        newTestament: [...allBooks.slice(39)].sort(),
      };
    }
    return {
      oldTestament: allBooks.slice(0, 39),
      newTestament: allBooks.slice(39),
    };
  }, [isAlphabetical]);

  const renderSortButtons = () => (
    <View>
      <ButtonGroup
      containerStyle={styles.sortButton}
         selectedButtonStyle={{ backgroundColor: '#e2e2e2' }}
         buttons={[ 
           <Text style={styles.sortButtonText}>{t('selectChapterPage.biblicalOrder')}</Text>,
           <Text style={styles.sortButtonText}>{t('selectChapterPage.alphabeticalOrder')}</Text>
         ]}
         selectedIndex={Number(isAlphabetical)}
         onPress={(index) => setIsAlphabetical(!!index)}
       />
    </View>
  );

  const renderBookSelection = () => (
    <>
      <Text style={styles.title}>{t('selectChapterPage.selectBook')}</Text>
      {/* {renderSortButtons()} */}
      <Text style={styles.subtitle}>{t('selectChapterPage.oldT')}</Text>
      <View style={styles.buttonContainer}>
        {sortedBooks.oldTestament.map((book, i) => (
          <TouchableOpacity
            key={i}
            style={styles.button}
            onPress={() => setSelectedBook(book!)}
          >
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={1}>
                {t(`bible.${book}`)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>{t('selectChapterPage.newT')}</Text>
      <View style={styles.buttonContainer}>
        {sortedBooks.newTestament.map((book, i) => (
          <TouchableOpacity
            key={i + 39}
            style={styles.button}
            onPress={() => setSelectedBook(book!)}
          >
            <View style={styles.buttonTextContainer}>
              <Text style={[styles.buttonText, styles.buttonTextNew]} adjustsFontSizeToFit numberOfLines={1}>
                {t(`bible.${book}`)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderChapterSelection = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedBook(null)}>
        <Text style={styles.backButtonText}>{t('selectChapterPage.backToBooks')}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t('selectChapterPage.selectChapterFrom', { book: t(`bible.${selectedBook}`)})}</Text>
      <View style={styles.buttonContainer}>
        {getChapters(selectedBook!).map((chapter, i) => (
          <TouchableOpacity
            key={i}
            style={styles.button}
            onPress={() => {
              navigation.navigate('Memorization', { book: selectedBook!, chapter: chapter!, fromChapter: true });
              saveToHistory(selectedBook!, chapter!)
            }}
          >
            <Text style={styles.buttonText}>{t('selectChapterPage.chapter', { chapter: chapter })}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {selectedBook ? renderChapterSelection() : renderBookSelection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#BFA58A',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  textOld: {
    color: '#78A2CC',
  },
  textNew: {
    color: '#FF6B6B',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtons: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginBottom: 5,
  },
  sortButton: {
    marginHorizontal: 5,
    // maxWidth: 100
    paddingLeft: 0
  },
  activeSortButton: {
    backgroundColor: '#B1907F',
  },
  sortButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default SelectBookScreen;