import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../store/hooks';
import { theme } from '../theme';

// Import screens
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/Home/HomeScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import BudgetScreen from '../screens/Budget/BudgetScreen';
import GoalsScreen from '../screens/Goals/GoalsScreen';
import InvestmentsScreen from '../screens/Investments/InvestmentsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import AIAssistantScreen from '../screens/AI/AIAssistantScreen';

// Import detail screens
import TransactionDetailScreen from '../screens/Transactions/TransactionDetailScreen';
import AddTransactionScreen from '../screens/Transactions/AddTransactionScreen';
import BudgetDetailScreen from '../screens/Budget/BudgetDetailScreen';
import CreateBudgetScreen from '../screens/Budget/CreateBudgetScreen';
import GoalDetailScreen from '../screens/Goals/GoalDetailScreen';
import CreateGoalScreen from '../screens/Goals/CreateGoalScreen';
import InvestmentDetailScreen from '../screens/Investments/InvestmentDetailScreen';
import AddInvestmentScreen from '../screens/Investments/AddInvestmentScreen';
import PortfolioAnalysisScreen from '../screens/Investments/PortfolioAnalysisScreen';
import ReportDetailScreen from '../screens/Reports/ReportDetailScreen';

// Import modal screens
import CameraScreen from '../screens/Camera/CameraScreen';
import ReceiptScannerScreen from '../screens/Camera/ReceiptScannerScreen';
import QRCodeScannerScreen from '../screens/Camera/QRCodeScannerScreen';

// Navigation types
import { RootStackParamList, MainTabParamList, DrawerParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Tab Navigator
const TabNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'credit-card' : 'credit-card-outline';
              break;
            case 'Budget':
              iconName = focused ? 'chart-pie' : 'chart-pie';
              break;
            case 'Goals':
              iconName = focused ? 'target' : 'target';
              break;
            case 'Investments':
              iconName = focused ? 'trending-up' : 'trending-up';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: theme.layout.tabBarHeight,
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen 
        name="Budget" 
        component={BudgetScreen}
        options={{
          tabBarLabel: 'Budget',
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{
          tabBarLabel: 'Goals',
        }}
      />
      <Tab.Screen 
        name="Investments" 
        component={InvestmentsScreen}
        options={{
          tabBarLabel: 'Investments',
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.medium,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semiBold,
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{
          title: 'CashNib',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          title: 'Reports',
          drawerIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="AIAssistant" 
        component={AIAssistantScreen}
        options={{
          title: 'AI Assistant',
          drawerIcon: ({ color, size }) => (
            <Icon name="robot" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <Icon name="bell" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: currentTheme === 'dark',
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.error,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.semiBold,
          },
          headerShadowVisible: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Main app screens
          <>
            <Stack.Screen 
              name="Main" 
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            
            {/* Detail Screens */}
            <Stack.Screen 
              name="TransactionDetail" 
              component={TransactionDetailScreen}
              options={{ title: 'Transaction Details' }}
            />
            <Stack.Screen 
              name="AddTransaction" 
              component={AddTransactionScreen}
              options={{ title: 'Add Transaction' }}
            />
            <Stack.Screen 
              name="BudgetDetail" 
              component={BudgetDetailScreen}
              options={{ title: 'Budget Details' }}
            />
            <Stack.Screen 
              name="CreateBudget" 
              component={CreateBudgetScreen}
              options={{ title: 'Create Budget' }}
            />
            <Stack.Screen 
              name="GoalDetail" 
              component={GoalDetailScreen}
              options={{ title: 'Goal Details' }}
            />
            <Stack.Screen 
              name="CreateGoal" 
              component={CreateGoalScreen}
              options={{ title: 'Create Goal' }}
            />
            <Stack.Screen 
              name="InvestmentDetail" 
              component={InvestmentDetailScreen}
              options={{ title: 'Investment Details' }}
            />
            <Stack.Screen 
              name="AddInvestment" 
              component={AddInvestmentScreen}
              options={{ title: 'Add Investment' }}
            />
            <Stack.Screen 
              name="PortfolioAnalysis" 
              component={PortfolioAnalysisScreen}
              options={{ title: 'Portfolio Analysis' }}
            />
            <Stack.Screen 
              name="ReportDetail" 
              component={ReportDetailScreen}
              options={{ title: 'Report Details' }}
            />
            
            {/* Modal Screens */}
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen}
              options={{ 
                presentation: 'modal',
                title: 'Camera',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="ReceiptScanner" 
              component={ReceiptScannerScreen}
              options={{ 
                presentation: 'modal',
                title: 'Scan Receipt',
              }}
            />
            <Stack.Screen 
              name="QRCodeScanner" 
              component={QRCodeScannerScreen}
              options={{ 
                presentation: 'modal',
                title: 'Scan QR Code',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;