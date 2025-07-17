import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ResumenScreen from './screens/ResumenScreen';
import EncontrarScreen from './screens/EncontrarScreen';

import { colors } from './theme';
import { UserProvider } from './hooks/useUserRegistration';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { CameraProvider } from './hooks/useCamara';
import ProcesoScreen from './screens/ProcesoScreen';
import UserScreen from './screens/UserScreen';
import { SignalListenerProvider } from './hooks/SignalListenerProvider';

const Stack = createStackNavigator();

export default function App() {
  // El Provider SignalListenerProvider inicializa el listener global de señales
  // para que funcione en toda la app, sin importar la pantalla.
  return (
    <UserProvider>
      <CameraProvider>
        <SignalListenerProvider userId={'myId'}>
          <Toast />
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
              <Stack.Screen name="Resumen" component={ResumenScreen} />
              <Stack.Screen name="Proceso" component={ProcesoScreen} />
              <Stack.Screen name="Encontrar" component={EncontrarScreen} />
              <Stack.Screen name="User" component={UserScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SignalListenerProvider>
      </CameraProvider>
    </UserProvider>
  );
}
