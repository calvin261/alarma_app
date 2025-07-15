import React, { useEffect, useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import MapScreen from './screens/MapScreen';
import HistoryScreen from './screens/HistoryScreen';
import SurveillanceScreen from './screens/SurveillanceScreen';
import { registerForPushNotificationsAsync } from './services/notificationService';

export const NotificationContext = createContext(null);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home-outline';
          else if (route.name === 'Alertas') iconName = 'alert-circle-outline';
          else if (route.name === 'Mapa') iconName = 'map-outline';
          else if (route.name === 'Historial') iconName = 'time-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Alertas" component={MapScreen} options={{ title: 'Alertas', headerShown: false }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Historial" component={HistoryScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    })();
  }, []);

  return (
    <NotificationContext.Provider value={expoPushToken}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="CargarVideo" component={UploadScreen} options={{ title: 'Cargar Video/Audio' }} />
          <Stack.Screen name="Vigilancia" component={SurveillanceScreen} options={{ title: 'Vigilancia en tiempo real' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationContext.Provider>
  );
}
