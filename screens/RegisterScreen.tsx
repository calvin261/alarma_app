import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, FontFamily, FontSize, theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useUserRegistration } from '../hooks/useUserRegistration';
import Header from '../components/Header';

export default function RegisterScreen() {
  // Define missing functions
  const setLocation = async (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    setMapRegion({ ...mapRegion, latitude: lat, longitude: lng });
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
  };
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation(latitude, longitude);
  };
  const handleSubmit = () => {
    if (typeof formData.latitud === 'number' && typeof formData.longitud === 'number') {
      registerUser({
        ...formData,
        latitud: formData.latitud as number,
        longitud: formData.longitud as number,
      });
    } else {
      Alert.alert('Error', 'Debes seleccionar una ubicación válida.');
    }
  };
  const router = useNavigation();
  const { registerUser, registrationLoading, error, clearError } = useUserRegistration();
  // Remove useCamera if not defined or import it if available

  const [formData, setFormData] = useState({
    nombre_local: '',
    ip_camara: '',
    ubicacion: '',
    latitud: null as number | null,
    longitud: null as number | null,
    password: ''
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.1807,
    longitude: -78.4678,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error])
  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación para esto.');
        return;
      }
      setIsLoadingLocation(true);
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      await setLocation(coords.latitude, coords.longitude);
    } catch (e) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
    } finally {
      setIsLoadingLocation(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient colors={[colors.secondary_2[500], colors.primary_2[500]]} start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }} style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <View style={styles.content}>
          {/* --- Información del Local --- */}
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Información del Local</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del local</Text>
              <View style={styles.inputContainer}>
                <Icon name="store" size={20} color={colors.neutro} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el nombre del local"
                  placeholderTextColor={colors.neutro}
                  value={formData.nombre_local}
                  onChangeText={t => handleInputChange('nombre_local', t)}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IP de la cámara</Text>
              <View style={styles.inputContainer}>
                <Icon name="video" size={20} color={colors.neutro} />
                <TextInput
                  style={[styles.input, styles.urlInput]}
                  placeholder="http://192.168.1.1:8080"
                  placeholderTextColor={colors.neutro}
                  value={formData.ip_camara}
                  onChangeText={t => handleInputChange('ip_camara', t)}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color={colors.neutro} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.neutro}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={t => handleInputChange('password', t)}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  {showPassword
                    ? <Icon name="eye-off" size={20} color={colors.neutro} />
                    : <Icon name="eye" size={20} color={colors.neutro} />
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- Ubicación --- */}
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Ubicación</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usar mi ubicación o toca en el mapa</Text>
              <TouchableOpacity
                style={styles.myLocationBtn}
                onPress={handleUseCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation
                  ? <ActivityIndicator color={colors.neutro} />
                  : (
                    <>
                      <Icon name="map-marker" size={16} color={colors.neutro} />
                      <Text style={styles.myLocationText}>Mi ubicación</Text>
                    </>
                  )
                }
              </TouchableOpacity>
              <MapView
                ref={mapRef}
                style={styles.map}
                region={mapRegion}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton={false}
              >
                {selectedLocation && (
                  <Marker
                    coordinate={selectedLocation}
                    title="Ubicación"
                    description={locationName}
                  />
                )}
              </MapView>
              <Text style={styles.addressLabel}>{formData.ubicacion}</Text>
            </View>
          </View>

          {/* --- Botón Registrar --- */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (registrationLoading || isLoadingLocation) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={registrationLoading || isLoadingLocation}
          >
            {registrationLoading
              ? <ActivityIndicator color={colors.primary_2[500]} />
              : (
                <>
                  <Icon name="check-circle" size={20} color={colors.primary_2[500]} />
                  <Text style={styles.buttonText}>Registrar Local</Text>
                </>
              )
            }
          </TouchableOpacity>
        </View></ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  customHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15, marginTop: 40, borderBottomWidth: 1, borderBottomColor: colors.primary_2[200]
  },
  headerPlaceholder: { width: 40 },
  headerTitle: { fontSize: FontSize.large, fontFamily: FontFamily.bold, color: colors.neutro },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 20, gap: 20 },
  formCard: {
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5
  },
  cardTitle: { fontSize: FontSize.body + 2, fontFamily: FontFamily.bold, color: colors.neutro, marginBottom: 16, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: FontSize.small, fontFamily: FontFamily.medium, color: colors.neutro, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderWidth: 1, borderColor: colors.neutro
  },
  input: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: colors.neutro },
  urlInput: { fontFamily: FontFamily.medium },
  eyeButton: { padding: 4 },
  myLocationBtn: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    padding: 8, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, alignSelf: 'flex-start'
  },
  myLocationText: { color: colors.neutro, fontFamily: FontFamily.medium, marginLeft: 4 },
  map: { height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  addressLabel: {
    fontSize: FontSize.small, fontFamily: FontFamily.regular,
    color: colors.neutro, backgroundColor: 'rgba(0,0,0,0.1)', padding: 8, borderRadius: 8
  },
  registerButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.neutro, height: 40, borderRadius: 16, gap: 8,
    shadowColor: colors.neutro, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { fontSize: FontSize.body, fontFamily: FontFamily.medium, color: colors.primary_2[500], letterSpacing: 0.5 },
});
