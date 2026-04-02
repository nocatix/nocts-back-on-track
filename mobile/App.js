import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { ModeProvider, useMode } from './src/context/ModeContext';

// Pages
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import MainMenuScreen from './src/pages/MainMenuScreen';
import AddictionDetailScreen from './src/pages/AddictionDetailScreen';
import AddNewAddictionScreen from './src/pages/AddNewAddictionScreen';
import MoodScreen from './src/pages/MoodScreen';
import DiaryScreen from './src/pages/DiaryScreen';
import MeditationScreen from './src/pages/MeditationScreen';
import SettingsScreen from './src/pages/SettingsScreen';
import ModeSelectionScreen from './src/pages/ModeSelectionScreen';
import ServerConfigScreen from './src/pages/ServerConfigScreen';

// Components
import OfflineIndicator from './src/components/OfflineIndicator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Stack.Screen
        name="AddictionDetail"
        component={AddictionDetailScreen}
        options={({ route }) => ({
          title: 'Details',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="AddNewAddiction"
        component={AddNewAddictionScreen}
        options={{ title: 'New Addiction' }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          title: 'Mood Tracker',
          tabBarLabel: 'Mood',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: 'Diary',
          tabBarLabel: 'Diary',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
      <Tab.Screen
        name="Meditation"
        component={MeditationScreen}
        options={{
          title: 'Meditation',
          tabBarLabel: 'Meditate',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { userToken, loading: authLoading } = React.useContext(AuthContext);
  const { mode, modeConfigured, loading: modeLoading, isServerConfigured } = useMode();

  console.log('[RootNavigator] State:', { userToken, authLoading, mode, modeConfigured, modeLoading });

  // Wait for both mode and auth to load
  if (modeLoading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Step 1: Mode not set - show mode selection
  if (!modeConfigured) {
    return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Step 2: Connected mode but server not configured - show config
  if (mode === 'connected' && !isServerConfigured()) {
    return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="ServerConfig" component={ServerConfigScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Step 3: Mode configured - proceed with normal auth flow
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ flex: 1 }}>
        {userToken == null ? <AuthStack /> : <AppStack />}
        <OfflineIndicator />
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ModeProvider>
      <DarkModeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </DarkModeProvider>
    </ModeProvider>
  );
}
