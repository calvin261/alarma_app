import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Imagen eliminada para evitar error de archivo faltante */}
      <Text style={styles.title}>Alarma Comunitaria Inteligente</Text>
      <Text style={styles.subtitle}>Protege tu barrio con IA y colaboración vecinal</Text>
      <TouchableOpacity style={styles.buttonBlue} onPress={() => navigation.navigate('CargarVideo')}>
        <Text style={styles.buttonText}>Cargar Video/Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLight} onPress={() => navigation.navigate('Mapa')}>
        <Text style={styles.buttonBlueText}>Ver Mapa de Alertas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLight} onPress={() => navigation.navigate('Historial')}>
        <Text style={styles.buttonBlueText}>Historial de Incidentes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRed} onPress={() => navigation.navigate('Vigilancia')}>
        <Text style={styles.buttonText}>Vigilancia en tiempo real</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Desarrollado con Expo y Google Cloud</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1976D2', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 24 },
  buttonBlue: { backgroundColor: '#1976D2', padding: 16, borderRadius: 12, width: '100%', marginBottom: 12 },
  buttonRed: { backgroundColor: '#E53935', padding: 16, borderRadius: 12, width: '100%', marginBottom: 12 },
  buttonLight: { backgroundColor: '#F5F7FB', padding: 16, borderRadius: 12, width: '100%', marginBottom: 12, borderWidth: 1, borderColor: '#E3E6ED' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  buttonBlueText: { color: '#1976D2', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  footer: { marginTop: 32, color: '#888', fontSize: 14, textAlign: 'center' },
}); 