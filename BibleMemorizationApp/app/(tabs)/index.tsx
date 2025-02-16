import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MemorizationScreen from './MemorizationScreen';

type RootStackParamList = {
  Home: undefined;
  Memorization: { book: string; chapter: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bible Memorization' }} />
      <Stack.Screen
        name="Memorization"
        component={MemorizationScreen}
        options={({ route }) => ({ title: `${route.params.book} ${route.params.chapter}` })}
      />
    </Stack.Navigator>
);

export default App;
