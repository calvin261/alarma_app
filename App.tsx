import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import MapScreen from './screens/MapScreen';
import HistoryScreen from './screens/HistoryScreen';
import HistorialDetalleScreen from './screens/HistorialDetalleScreen';
import SurveillanceScreen from './screens/SurveillanceScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CamarasScreen from './screens/CamarasScreen';
import UsersMapScreen from './screens/UsersMapScreen';
import { colors } from './theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: 'normal' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: 'bold' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CargarVideo" component={UploadScreen} />
      
        <Stack.Screen name="Historial" component={HistoryScreen} />
        <Stack.Screen name="HistorialDetalle" component={HistorialDetalleScreen} />
        <Stack.Screen name="Vigilancia" component={SurveillanceScreen} />
        <Stack.Screen name="Camaras" component={CamarasScreen} />
        <Stack.Screen name="UsersMap" component={UsersMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
