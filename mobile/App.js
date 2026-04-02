import React, { useEffect, useContext, useMemo } from 'react';
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
import { WeightProvider } from './src/context/WeightContext';
import { MemoryProvider } from './src/context/MemoryContext';
import { AchievementProvider } from './src/context/AchievementContext';
import { TrophyProvider } from './src/context/TrophyContext';
import { AddictionProvider } from './src/context/AddictionContext';
import { PreparationProvider } from './src/context/PreparationContext';
import { SelfAssessmentProvider } from './src/context/SelfAssessmentContext';
import { getTheme } from './src/utils/theme';
import { initializeLanguage } from './src/i18n/i18n';

// Pages
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import MainMenuScreen from './src/pages/MainMenuScreen';
import AddictionDetailScreen from './src/pages/AddictionDetailScreen';
import AddNewAddictionScreen from './src/pages/AddNewAddictionScreen';
import MoodScreen from './src/pages/MoodScreen';
import DiaryScreen from './src/pages/DiaryScreen';
import MeditationScreen from './src/pages/MeditationScreen';
import WeightScreen from './src/pages/WeightScreen';
import MemoriesScreen from './src/pages/MemoriesScreen';
import AchievementsScreen from './src/pages/AchievementsScreen';
import ResourcesHubScreen from './src/pages/ResourcesHubScreen';
import WithdrawalSymptomsScreen from './src/pages/WithdrawalSymptomsScreen';
import WithdrawalTimelineScreen from './src/pages/WithdrawalTimelineScreen';
import CrisisHotlinesScreen from './src/pages/CrisisHotlinesScreen';
import TherapyInfoScreen from './src/pages/TherapyInfoScreen';
import HowToSucceedScreen from './src/pages/HowToSucceedScreen';
import WhyUseThisScreen from './src/pages/WhyUseThisScreen';
import PrivacyPolicyScreen from './src/pages/PrivacyPolicyScreen';
import FunctioningUserScreen from './src/pages/FunctioningUserScreen';
import CravingGameScreen from './src/pages/CravingGameScreen';
import ExercisesScreen from './src/pages/ExercisesScreen';
import MindfulnessScreen from './src/pages/MindfulnessScreen';
import HobbiesScreen from './src/pages/HobbiesScreen';
import PreparationPlanScreen from './src/pages/PreparationPlanScreen';
import SelfAssessmentScreen from './src/pages/SelfAssessmentScreen';
import ProfileScreen from './src/pages/ProfileScreen';
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

  // Memoized Wellness Navigator component
  const WellnessNavigator = useMemo(() => {
    return () => {
      const WellnessTab = createBottomTabNavigator();
      return (
        <WellnessTab.Navigator
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textTertiary,
            tabBarStyle: {
              backgroundColor: theme.colors.cardBg,
              borderTopColor: theme.colors.border,
              borderTopWidth: 1,
            },
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
        >
          <WellnessTab.Screen
            name="Weight"
            component={WeightScreen}
            options={{
              title: 'Weight Tracking',
              tabBarLabel: 'Weight',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="scale" color={color} size={size} />
              ),
            }}
          />
          <WellnessTab.Screen
            name="Memories"
            component={MemoriesScreen}
            options={{
              title: 'Memories',
              tabBarLabel: 'Memories',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="notebook-heart" color={color} size={size} />
              ),
            }}
          />
          <WellnessTab.Screen
            name="Achievements"
            component={AchievementsScreen}
            options={{
              title: 'Achievements',
              tabBarLabel: 'Achievements',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="trophy" color={color} size={size} />
              ),
            }}
          />
          <WellnessTab.Screen
            name="CravingGame"
            component={CravingGameScreen}
            options={{
              title: 'Craving Game',
              tabBarLabel: 'Game',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} />
              ),
            }}
          />
          <WellnessTab.Screen
            name="Exercises"
            component={ExercisesScreen}
            options={{
              title: 'Exercises',
              tabBarLabel: 'Exercises',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
              ),
            }}
          />
          <WellnessTab.Screen
            name="Hobbies"
            component={HobbiesScreen}
            options={{
              title: 'Hobbies',
              tabBarLabel: 'Hobbies',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="palette" color={color} size={size} />
              ),
            }}
          />
        </WellnessTab.Navigator>
      );
    };
  }, [theme]);

  // Memoized Resources Navigator component  
  const ResourcesNavigator = useMemo(() => {
    return () => {
      const ResourcesStack = createNativeStackNavigator();
      return (
        <ResourcesStack.Navigator
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
          <ResourcesStack.Screen
            name="ResourcesHub"
            component={ResourcesHubScreen}
            options={{ title: 'Resources', headerShown: false }}
          />
          <ResourcesStack.Screen
            name="WithdrawalSymptoms"
            component={WithdrawalSymptomsScreen}
            options={{ title: 'Withdrawal Symptoms' }}
          />
          <ResourcesStack.Screen
            name="WithdrawalTimeline"
            component={WithdrawalTimelineScreen}
            options={{ title: 'Withdrawal Timeline' }}
          />
          <ResourcesStack.Screen
            name="CrisisHotlines"
            component={CrisisHotlinesScreen}
            options={{ title: 'Crisis Hotlines' }}
          />
          <ResourcesStack.Screen
            name="TherapyInfo"
            component={TherapyInfoScreen}
            options={{ title: 'Therapy Information' }}
          />
          <ResourcesStack.Screen
            name="HowToSucceed"
            component={HowToSucceedScreen}
            options={{ title: 'How to Succeed' }}
          />
          <ResourcesStack.Screen
            name="WhyUseThis"
            component={WhyUseThisScreen}
            options={{ title: 'Why Use This App' }}
          />
          <ResourcesStack.Screen
            name="PreparationPlan"
            component={PreparationPlanScreen}
            options={{ title: 'Preparation Plan' }}
          />
          <ResourcesStack.Screen
            name="SelfAssessment"
            component={SelfAssessmentScreen}
            options={{ title: 'Self-Assessment' }}
          />
          <ResourcesStack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ title: 'Privacy Policy' }}
          />
          <ResourcesStack.Screen
            name="FunctioningUser"
            component={FunctioningUserScreen}
            options={{ title: 'The Myth of The Functioning User' }}
          />
        </ResourcesStack.Navigator>
      );
    };
  }, [theme]);

  // Memoized Settings Navigator component
  const SettingsNavigator = useMemo(() => {
    return () => {
      const SettingsStack = createNativeStackNavigator();
      return (
        <SettingsStack.Navigator
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
          <SettingsStack.Screen
            name="SettingsHome"
            component={SettingsScreen}
            options={{ title: 'Settings', headerShown: false }}
          />
          <SettingsStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </SettingsStack.Navigator>
      );
    };
  }, [theme]);

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
        name="Mindfulness"
        component={MindfulnessScreen}
        options={{
          title: 'Mindfulness',
          tabBarLabel: 'Mindfulness',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="brain" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.cardBg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
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
        name="Wellness"
        component={WellnessNavigator}
        options={{
          title: 'Wellness',
          tabBarLabel: 'Wellness',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesNavigator}
        options={{
          title: 'Resources',
          tabBarLabel: 'Resources',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="library-shelves" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
          headerShown: false,
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
  // Initialize language on app startup
  useEffect(() => {
    initializeLanguage();
  }, []);

  return (
    <ModeProvider>
      <DarkModeProvider>
        <BiometricProvider>
          <AuthProvider>
            <AddictionProvider>
              <WeightProvider>
                <MemoryProvider>
                  <AchievementProvider>
                    <TrophyProvider>
                      <PreparationProvider>
                        <SelfAssessmentProvider>
                          <RootNavigator />
                        </SelfAssessmentProvider>
                      </PreparationProvider>
                    </TrophyProvider>
                  </AchievementProvider>
                </MemoryProvider>
              </WeightProvider>
            </AddictionProvider>
          </AuthProvider>
        </BiometricProvider>
      </DarkModeProvider>
    </ModeProvider>
  );
}
