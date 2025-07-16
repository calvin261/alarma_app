import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors, theme } from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Ajusta el tipo según tu navegación
// type RootStackParamList = { HistorialDetalle: { incident: any } };

const HistorialDetalleScreen = () => {
  const route = useRoute<any>();
  const { incident } = route.params;
  const { url, location, timestamp, lat, lng, aiAnalysis, incidentType } = incident;
  return (
    <LinearGradient colors={[colors.background, colors.secondary]} style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Evidencia del Incidente</Text>
          <View style={styles.card}>
            <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
          </View>
          
          {/* Información del análisis de IA */}
          {aiAnalysis && (
            <View style={styles.aiAnalysisCard}>
              <View style={styles.aiHeader}>
                <Icon name="robot" size={24} color={colors.accent} />
                <Text style={styles.aiTitle}>Análisis de IA</Text>
              </View>
              <View style={styles.incidentTypeContainer}>
                <Icon name="alert-circle" size={20} color={colors.danger} style={{ marginRight: 8 }} />
                <Text style={styles.incidentTypeText}>{aiAnalysis}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.text}>{location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.text}>{new Date(timestamp).toLocaleString('es-ES')}</Text>
          </View>
          {lat && lng && (
            <View style={[styles.card, {padding:0}]}> 
              <MapView
                style={styles.map}
                initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
              >
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
              </MapView>
            </View>
          )}
        </ScrollView>
        <Footer />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  label: { fontWeight: 'bold', color: colors.text, marginTop: 8 },
  text: { color: colors.subtitle, marginBottom: 4 },
  map: { width: '100%', height: 200, borderRadius: 12, marginTop: 16 },
  content: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  aiAnalysisCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  incidentTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.danger,
  },
});

export default HistorialDetalleScreen;
