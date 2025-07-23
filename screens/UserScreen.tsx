import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Platform, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { colors, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCamera } from '../hooks/useCamara';
import Toast from 'react-native-toast-message';
type Incident = {
  id: string;
  url: string;
  timestamp: number;
  location: string;
  lat?: number;
  lng?: number;
  aiAnalysis?: string;
  incidentType?: string;
};

const PAGE_SIZE = 10;


const UserScreen = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [zoneFilter, setZoneFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [ipConfig, setIpConfig] = useState('');
  const [targetIp, setTargetIp] = useState('http://192.168.100.201:4200');
  const [sending, setSending] = useState(false);
  const { cameraIp, setCameraIp } = useCamera();

  // Cargar configuración IP guardada (si existe)
  useEffect(() => {
    const loadSavedIp = async () => {
      try { 
        if (cameraIp) setIpConfig(cameraIp);
      } catch (error) {
        console.error('Error al cargar la configuración IP:', error);
      }
    };

    loadSavedIp();
  }, []);

  const fetchIncidents = useCallback(async (reset = false) => {
    setLoading(true);
    const db = getFirestore();
    let q = collection(db, 'historial');
    let constraints: any[] = [orderBy('timestamp', 'desc')];
    if (zoneFilter) constraints.push(where('location', '>=', zoneFilter), where('location', '<=', zoneFilter + '\uf8ff'));
    if (dateFilter) {
      const start = new Date(dateFilter);
      const end = new Date(dateFilter);
      end.setHours(23, 59, 59, 999);
      constraints.push(where('timestamp', '>=', start.getTime()));
      constraints.push(where('timestamp', '<=', end.getTime()));
    }
    if (!reset && lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(PAGE_SIZE));
    const qRef = query(q, ...constraints);
    const snap = await getDocs(qRef);
    const docs = snap.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({ id: doc.id, ...(doc.data() as Omit<Incident, 'id'>) })) as Incident[];
    if (reset) {
      setIncidents(docs);
    } else {
      setIncidents(prev => [...prev, ...docs]);
    }
    setLastDoc(snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null);
    setHasMore(docs.length === PAGE_SIZE);
    setLoading(false);
  }, [zoneFilter, dateFilter, lastDoc]);

  useEffect(() => {
    fetchIncidents(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneFilter, dateFilter]);


  const saveIpConfig = async () => {
    try {
      if (!ipConfig) {
        Alert.alert('Error', 'Por favor, ingresa una IP válida.');
        return;
      }
      setCameraIp(ipConfig);
      Toast.show({
        type: 'success',
        text1: 'IP guardada',
        text2: 'La IP de la cámara se ha guardado correctamente.',
      });
    } catch (error) {
      console.error('Error al guardar la configuración IP:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al guardar',
        text2: 'No se pudo guardar la configuración de la cámara.',
      });
    }
  };

  // Función para enviar datos JSON a una IP específica
  const sendJsonToIp = async () => {
    if (!targetIp) {
      Alert.alert('Error', 'Por favor, ingresa una IP de destino válida.');
      return;
    }

    // JSON de ejemplo a enviar
    const jsonData = {
      "device_id": "webcam",
      "device_type": "camera",
      "ip": "http://192.168.100.201:4200/camera",
      "location": "Quito",
      "user": "jefferson",
      "alert_information": "amenaza dectectada",
      "cordinates": {
        "latitude": -0.205504,
        "longitude": -438.500258
      },
      "date": "2025-07-14",
      "time": "22:07:30",
      "stream_url": "http://192.168.100.201:4200/camera",
      "transcription_video": "Se observo un incidiente en la camara del local 1",
      "transcription_audio": "Dame todo el dinero rapido",
      "media_duration": 120,
      "key_words": ["robo", "incidente", "camera"],
      "confidence_level": 0.76
    };

    setSending(true);
    try {
      const response = await fetch(targetIp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Datos enviados',
          text2: 'El JSON se ha enviado correctamente.'
        });
      } else {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al enviar',
        text2: 'No se pudieron enviar los datos. Verifica la conexión.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.secondary]} style={styles.gradient}>
      <Header />
      <Text style={styles.title}>Nombre del Usuario</Text>

      {/* Configuración de IP */}
      <View style={styles.ipConfigContainer}>
        <Text style={styles.ipConfigLabel}>Configuración de Cámara IP:</Text>
        <View style={styles.ipConfigInputRow}>
          <TextInput
            style={styles.ipConfigInput}
            placeholder="http://192.168.100.189:8080/"
            value={ipConfig}
            onChangeText={setIpConfig}
            keyboardType="url"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.ipConfigButton}
            onPress={saveIpConfig}
          >
            <Text style={styles.ipConfigButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Envío de JSON a IP */}
      <View style={styles.ipConfigContainer}>
        <Text style={styles.ipConfigLabel}>Enviar JSON a IP:</Text>
        <View style={styles.ipConfigInputRow}>
          <TextInput
            style={styles.ipConfigInput}
            placeholder="http://192.168.100.201:4200"
            value={targetIp}
            onChangeText={setTargetIp}
            keyboardType="url"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.ipConfigButton, sending && styles.ipConfigButtonDisabled]}
            onPress={sendJsonToIp}
            disabled={sending}
          >
            <Text style={styles.ipConfigButtonText}>{sending ? 'Enviando...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
     
      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 40,
    paddingHorizontal: 18,
  },
  headerLatters: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: theme.fontFamily,
  },
  slogan: {
    color: colors.subtitle,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: theme.fontFamily,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 12 },

  // Estilos para la configuración IP
  ipConfigContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  ipConfigLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8
  },
  ipConfigInputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ipConfigInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 10,
    color: colors.text,
    marginRight: 8
  },
  ipConfigButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  ipConfigButtonDisabled: {
    backgroundColor: colors.subtitle,
    opacity: 0.7,
  },
  ipConfigButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  filters: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  input: { flex: 1, backgroundColor: colors.card, borderRadius: 8, padding: 10, marginHorizontal: 4, color: colors.text, fontSize: 15 },
  item: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent + '22', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  itemSubtitle: { fontSize: 13, color: colors.subtitle },
  incidentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: colors.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  incidentType: {
    fontSize: 12,
    color: colors.danger[500],
    fontWeight: 'bold'
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    color: colors.icon,
    fontSize: 13,
    marginTop: 2,
  },
});

export default UserScreen;
