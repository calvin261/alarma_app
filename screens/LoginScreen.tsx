import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Icon name="shield-check" size={64} color={colors.text} style={{marginBottom: 8}} />
          <Text style={styles.brand}>KUNTUR</Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="dal...@uce.edu.ec"
            placeholderTextColor={colors.subtitle}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="********"
              placeholderTextColor={colors.subtitle}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color={colors.subtitle} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFilled} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonFilledText}>Ingresar</Text>
          </TouchableOpacity>
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>No tiene cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}> Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 },
  logoBox: { alignItems: 'center', marginBottom: 12 },
  brand: { color: colors.text, fontSize: 32, fontWeight: 'bold', letterSpacing: 4, fontFamily: theme.fontFamily },
  formCard: { backgroundColor: '#F7F7FA', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, width: '100%', marginTop: 8 },
  title: { color: colors.primary, fontSize: 26, fontWeight: 'bold', marginBottom: 24, fontFamily: theme.fontFamily },
  label: { color: colors.primary, fontWeight: 'bold', marginTop: 12, marginBottom: 4, fontFamily: theme.fontFamily },
  input: { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: colors.primary, color: colors.primary, fontSize: 16, paddingVertical: 6, marginBottom: 0, fontFamily: theme.fontFamily },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  forgot: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 16 },
  forgotText: { color: colors.subtitle, fontSize: 13 },
  buttonFilled: { backgroundColor: colors.primary, borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  buttonFilledText: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: theme.fontFamily },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  bottomText: { color: colors.subtitle, fontSize: 14 },
  linkText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
});
