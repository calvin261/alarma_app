import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors, theme } from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LinearGradient } from 'expo-linear-gradient';

// Ajusta el tipo según tu navegación
// type RootStackParamList = { HistorialDetalle: { incident: any } };

const HistorialDetalleScreen = () => {
  const route = useRoute<any>();
  const { incident } = route.params;
  const { url, location, timestamp, lat, lng } = incident;
  return (
    <LinearGradient colors={[colors.background, colors.secondary]} style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Evidencia</Text>
          <View style={styles.card}>
            <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
          </View>
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
});

export default HistorialDetalleScreen;
