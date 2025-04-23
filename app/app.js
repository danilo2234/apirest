import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importando as telas
import GameListScreen from '../src/pages/GameListScreen';
import GameDetailScreen from '../src/pages/GameDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="GameList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#151515',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="GameList" 
            component={GameListScreen} 
            options={{ title: 'Explorador de Jogos' }} 
          />
          <Stack.Screen 
            name="GameDetail" 
            component={GameDetailScreen} 
            options={({ route }) => ({ title: route.params?.name || 'Detalhes do Jogo' })} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}