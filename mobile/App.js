import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { DarkModeProvider, DarkModeContext } from './src/context/DarkModeContext';
import { ModeProvider, useMode } from './src/context/ModeContext';
import { BiometricProvider, BiometricContext } from './src/context/BiometricContext';
import { getTheme } from './src/utils/theme';

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
import BiometricLockScreen from './src/pages/BiometricLockScreen';

// Components
import OfflineIndicator from './src/components/OfflineIndicator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack({ theme }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack({ theme }) {
  // HomeStack as nested function to access theme
  const HomeStackNav = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.cardBg,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.text,
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

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBg,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNav}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          title: 'Mood Tracker',
          tabBarLabel: 'Mood',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="emoticon-happy" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.cardBg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
          },
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: 'Diary',
          tabBarLabel: 'Diary',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="notebook" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.cardBg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
          },
        }}
      />
      <Tab.Screen
        name="Meditation"
        component={MeditationScreen}
        options={{
          title: 'Meditation',
          tabBarLabel: 'Meditate',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="meditation" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.cardBg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.cardBg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
          },
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { userToken, loading: authLoading } = React.useContext(AuthContext);
  const { mode, modeConfigured, loading: modeLoading, isServerConfigured } = useMode();
  const { isDarkMode, loading: themeLoading } = React.useContext(DarkModeContext);
  const { isBiometricEnabled, isAuthenticated, setIsAuthenticated } = React.useContext(BiometricContext);
  const theme = getTheme(isDarkMode);
  const appStateRef = React.useRef(new AppState());

  // Handle app state changes (backgrounding) to re-lock biometric
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isBiometricEnabled, isAuthenticated]);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background' && isBiometricEnabled && isAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  console.log('[RootNavigator] State:', { userToken, authLoading, mode, modeConfigured, modeLoading });

  // Wait for both mode and auth to load
  if (modeLoading || authLoading || themeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Step 1: Mode not set - show mode selection
  if (mode === null) {
    return (
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
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
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="ServerConfig" component={ServerConfigScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Step 3: Mode configured - proceed with normal auth flow
  // Show biometric lock overlay if enabled in standalone mode
  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
      <View style={{ flex: 1 }}>
        {userToken == null ? <AuthStack theme={theme} /> : <AppStack theme={theme} />}
        <OfflineIndicator />
        {/* Biometric Lock Overlay - only in standalone mode */}
        {mode === 'standalone' && isBiometricEnabled && !isAuthenticated && <BiometricLockScreen />}
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ModeProvider>
      <DarkModeProvider>
        <BiometricProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </BiometricProvider>
      </DarkModeProvider>
    </ModeProvider>
  );
}
