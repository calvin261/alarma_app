import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={require('../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>KUNTUR</Text>
        <Text style={styles.welcome}>Welcome Back</Text>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonOutlineText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFilled} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonFilledText}>Registrarse</Text>
        </TouchableOpacity>
        <Text style={styles.socialText}>Ingresa usando</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="github" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="google" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  brand: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 32,
    fontFamily: theme.fontFamily,
  },
  welcome: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    fontFamily: theme.fontFamily,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.text,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: theme.fontFamily,
  },
  buttonFilled: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonFilledText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: theme.fontFamily,
  },
  socialText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    fontFamily: theme.fontFamily,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialIcon: {
    marginHorizontal: 12,
    backgroundColor: 'transparent',
  },
});
