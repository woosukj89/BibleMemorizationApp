import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MemorizationScreen from './MemorizationScreen';
import SearchScreen from './SearchScreen';
import HistoryScreen from './HistoryScreen';
import SelectBookScreen from './SelectBookScreen';
import i18n from '@/i18n';
import { I18nextProvider } from 'react-i18next';

type RootStackParamList = {
  Home: undefined;
  Memorization: { book: string; chapter: number; fromChapter: boolean; fromSearch: boolean; verse?: number; endVerse?: number };
  Search: undefined;
  History: undefined;
  SelectBook: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <I18nextProvider i18n={i18n}>
    <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bible Memorization' }} />
          <Stack.Screen name="SelectBook" component={SelectBookScreen} options={{ title: 'Select a Book' }} />
          <Stack.Screen 
            name="Memorization" 
            component={MemorizationScreen} 
            options={({ route }) => ({ title: `${route.params.book} ${route.params.chapter}${
              route.params.verse
            ? `:${route.params.verse}${route.params.endVerse ? `-${route.params.endVerse}` : ''}`
            : ''}`})} 
          />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Verses' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
    </Stack.Navigator>
  </I18nextProvider>
);

export default App;
