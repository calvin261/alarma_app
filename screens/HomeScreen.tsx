import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getApp } from '@react-native-firebase/app';
import { getStorage, ref as storageRef, getDownloadURL } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Footer from '../components/Footer';
import Header from '../components/Header';
import * as Notifications from 'expo-notifications';

// Define el tipo de rutas principales
export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Login: undefined;
    Register: undefined;
    CargarVideo: undefined;
    Mapa: undefined;
    Historial: undefined;
    Vigilancia: undefined;
    Camaras: undefined;
    Welcome: undefined;
    UsersMap: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

// Configurar el handler de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});



export default function HomeScreen() {
    const [lastAlertTime, setLastAlertTime] = useState<string | null>(null);
    const [incidentsCount, setIncidentsCount] = useState<number>(0);

    const navigation = useNavigation();
    const [isOn, setIsOn] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const cameraRef = useRef<any>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoTimestamp, setPhotoTimestamp] = useState<number | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    
    // Función para solicitar permisos de notificaciones
    const requestNotificationPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permisos requeridos', 'Se necesitan permisos de notificación para alertarte sobre incidentes.');
            return false;
        }
        return true;
    };

    // Función para enviar notificación local
    const sendLocalNotification = async (incidentType: string) => {
        try {
            const hasPermission = await requestNotificationPermissions();
            if (!hasPermission) return;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🚨 Incidente Reportado',
                    body: `Se ha detectado: ${incidentType}. Las autoridades han sido notificadas.`,
                    sound: true,
                    data: {
                        incidentType,
                        location,
                        timestamp: Date.now(),
                    },
                },
                trigger: null, // Notificación inmediata
            });
        } catch (error) {
            console.error('Error enviando notificación local:', error);
        }
    };
    const handleToggle = async () => {
        if (!isOn) {
            if (!permission || !permission.granted) {
                const response = await requestPermission();
                if (!response.granted) {
                    Alert.alert('Permiso requerido', 'Se necesita permiso de cámara para tomar una foto.');
                    return;
                }
            }
            setShowCamera(true);
        } else {
            setIsOn(false);
        }
    };

    const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
    const [pendingTimestamp, setPendingTimestamp] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);

    // Array de respuestas simuladas de IA
    const aiResponses = [
        'Robo detectado',
        'Asalto identificado',
        'Secuestro en progreso',
        'Vandalismo detectado',
        'Actividad sospechosa',
        'Pelea callejera',
        'Accidente vehicular',
        'Disturbios públicos',
        'Intrusión detectada',
        'Amenaza identificada'
    ];
    // Obtener ubicación de forma asíncrona
    useEffect(() => {
        const fetchLocation = async () => {
            setLoadingLocation(true);
            setLocationError(null);
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLocationError('Permiso de ubicación denegado');
                    setLoadingLocation(false);
                    return;
                }
                let loc = await Location.getCurrentPositionAsync({});
                let address = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                if (address && address.length > 0) {
                    const a = address[0];
                    setLocation(`${a.street || ''} ${a.name || ''}, ${a.city || a.region || ''}`.trim());
                } else {
                    setLocation(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
                }
            } catch (e) {
                setLocationError('No se pudo obtener la ubicación');
            }
            setLoadingLocation(false);
        };
        fetchLocation();
    }, []);

    // Manejar respuesta a notificaciones
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data?.incidentType) {
                // Navegar al historial cuando el usuario toque la notificación
                navigation.navigate('Historial' as never);
            }
        });

        return () => subscription.remove();
    }, [navigation]);

    // Obtener estadísticas del historial de forma asíncrona
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const db = firestore();
                // Obtener última alerta
                const snap = await db.collection('historial')
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .get();
                if (!snap.empty) {
                    const ts = snap.docs[0].data().timestamp;
                    setLastAlertTime(new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
                } else {
                    setLastAlertTime(null);
                }
                // Contar incidencias
                const allSnap = await db.collection('historial').get();
                setIncidentsCount(allSnap.size);
            } catch (_e) {
                setLastAlertTime(null);
                setIncidentsCount(0);
            }
        };
        fetchStats();
    }, []);
    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const result = await cameraRef.current.takePictureAsync();
            setPendingPhoto(result.uri);
            setPendingTimestamp(Date.now());
            setShowCamera(false);
            setIsOn(true);
            setShowPhotoModal(true);
            setAnalyzing(true);
            setAiResult(null);

            // Simular análisis de IA con loading de 1.3 segundos
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * aiResponses.length);
                const selectedResponse = aiResponses[randomIndex];
                setAiResult(selectedResponse);
                setAnalyzing(false);
            }, 1300);
        }
    };

    const handleNotifyUPC = async () => {
        if (pendingPhoto && aiResult) {
            setUploading(true);
            setPhoto(pendingPhoto);
            setPhotoTimestamp(pendingTimestamp);
            try {
                // Modular Firebase v22+ API
                const app = getApp();
                const storage = getStorage(app);
                const db = firestore();
                const fileName = `photo_${Date.now()}.jpg`;
                const fileRef = storageRef(storage, fileName);
                await fileRef.putFile(pendingPhoto);
                const url = await getDownloadURL(fileRef);
                await db.collection('historial').add({
                    url,
                    timestamp: Date.now(),
                    location,
                    aiAnalysis: aiResult,
                    incidentType: aiResult
                });
                
                // Enviar notificación local
                await sendLocalNotification(aiResult);
                
                Alert.alert('Incidente reportado', `Se ha detectado: ${aiResult}. La información ha sido guardada en el historial y las autoridades han sido notificadas.`);
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'No se pudo guardar la información en el historial.');
            }
            setUploading(false);
        }
        setShowPhotoModal(false);
        setIsOn(false);
        setPendingPhoto(null);
        setPendingTimestamp(null);
        setAiResult(null);
        setAnalyzing(false);
    };

    const handleCancelPhoto = () => {
        setShowPhotoModal(false);
        setIsOn(false);
        setPendingPhoto(null);
        setPendingTimestamp(null);
        setAiResult(null);
        setAnalyzing(false);
    };

    const handleCloseCamera = () => {
        setShowCamera(false);
    };

    return (
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
            <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
                <Header />
                <View style={[styles.location, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                    <Icon name="map-marker" size={18} color={colors.accent} style={{ marginRight: 6 }} />
                    {loadingLocation ? (
                        <ActivityIndicator size="small" color={colors.accent} />
                    ) : locationError ? (
                        <Text style={{ color: colors.danger, textAlign: 'center' }}>{locationError}</Text>
                    ) : location ? (
                        <Text style={{ color: colors.text, textAlign: 'center' }}>{location}</Text>
                    ) : (
                        <Text style={{ textAlign: 'center' }}>Ubicación desconocida</Text>
                    )}
                </View>
                <View style={styles.cardMain}>
                    <View style={[styles.circleIcon, isOn ? styles.circleIconOn : styles.circleIconOff]}>
                        <Image
                            source={isOn ? require('../assets/power_on_icon.png') : require('../assets/power_off_icon.png')}
                            style={{ width: 54, height: 54 }}
                        />
                    </View>
                    <Text style={styles.cardMainTitle}>{'Kuntur'}</Text>
                    <Text style={styles.cardMainSubtitle}>{'Apagado'}</Text>
                    <TouchableOpacity
                        style={[styles.buttonMain, isOn ? styles.buttonMainOn : styles.buttonMainOff]}
                        onPress={handleToggle}
                    >
                        <Text style={[styles.buttonMainText, isOn ? styles.buttonMainTextOn : styles.buttonMainTextOff]}>
                            {isOn ? "Encendido" : "Apagado"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={showCamera} animationType="slide">
                    <View style={{ flex: 1, backgroundColor: '#000' }}>
                        <CameraView
                            style={{ flex: 1 }}
                            ref={ref => { cameraRef.current = ref; }}
                            ratio="16:9"
                        >
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 36 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#fff', borderRadius: 32, padding: 18, marginBottom: 20 }}
                                    onPress={handleTakePicture}
                                >
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>Tomar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCloseCamera} style={{ marginBottom: 30 }}>
                                    <Text style={{ color: '#fff', fontSize: 16 }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    </View>
                </Modal>

                {/* Modal para mostrar la foto tomada y datos con dos botones */}
                <Modal visible={showPhotoModal} animationType="slide" transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                        <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 18, alignItems: 'center', width: '100%', maxWidth: 350 }}>
                            {pendingPhoto && (
                                <Image source={{ uri: pendingPhoto }} style={{ width: 280, height: 180, borderRadius: 12, marginBottom: 18 }} resizeMode="cover" />
                            )}
                            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                                {location ? location : 'Ubicación desconocida'}
                            </Text>
                            <Text style={{ color: colors.subtitle, fontSize: 15, marginBottom: 18 }}>
                                {pendingTimestamp ? new Date(pendingTimestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                            </Text>
                            
                            {/* Análisis de IA */}
                            <View style={{ backgroundColor: colors.primary + '20', borderRadius: 12, padding: 16, marginBottom: 18, width: '100%' }}>
                                <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                                    Análisis de IA
                                </Text>
                                {analyzing ? (
                                    <View style={{ alignItems: 'center' }}>
                                        <ActivityIndicator size="large" color={colors.accent} />
                                        <Text style={{ color: colors.accent, marginTop: 8, textAlign: 'center' }}>
                                            Analizando imagen...
                                        </Text>
                                    </View>
                                ) : aiResult ? (
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon name="alert-circle" size={24} color={colors.danger} style={{ marginBottom: 8 }} />
                                        <Text style={{ color: colors.danger, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                            {aiResult}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>

                            {uploading ? (
                                <View style={{ alignItems: 'center', marginVertical: 16 }}>
                                    <ActivityIndicator size="large" color={colors.accent} />
                                    <Text style={{ color: colors.accent, marginTop: 8, fontWeight: 'bold' }}>Enviando información a servidores...</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                                    <TouchableOpacity
                                        style={{ backgroundColor: colors.danger, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, flex: 1, marginRight: 8 }}
                                        onPress={handleCancelPhoto}
                                    >
                                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ 
                                            backgroundColor: aiResult ? colors.accent : colors.icon, 
                                            borderRadius: 12, 
                                            paddingVertical: 16, 
                                            paddingHorizontal: 24, 
                                            flex: 1, 
                                            marginLeft: 8 
                                        }}
                                        onPress={handleNotifyUPC}
                                        disabled={!aiResult}
                                    >
                                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                            {aiResult ? 'Reportar Incidente' : 'Analizando...'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
                <View style={styles.rowCards}>
                    <View style={styles.cardSmall}>
                        <Icon name="headphones" size={32} color={colors.icon} style={{ marginBottom: 6 }} />
                        <Text style={styles.cardSmallLabel}>Última Alerta</Text>
                        <Text style={styles.cardSmallValue}>{lastAlertTime ? lastAlertTime : '--:--'}</Text>
                    </View>
                    <View style={styles.cardSmall}>
                        <Icon name="chart-bar" size={32} color={colors.icon} style={{ marginBottom: 6 }} />
                        <Text style={styles.cardSmallLabel}>Tipos de Incidencias</Text>
                        <Text style={styles.cardSmallValue}>{incidentsCount}</Text>
                    </View>
                </View>
                <Footer />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 30,
        paddingHorizontal: 18,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    headerLatters: {
        width: 180,
        height: 80,
        resizeMode: 'contain',
        marginHorizontal: 10,
        marginTop: 10,
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
    location: {
        color: colors.text,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 15,
        display: 'flex',
        justifyContent: 'center',
    },
    cardMain: {
        backgroundColor: colors.card,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        marginHorizontal: 18,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardMainTitle: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 8,
        fontFamily: theme.fontFamily,
    },
    cardMainSubtitle: {
        color: colors.subtitle,
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 8,
        fontFamily: theme.fontFamily,
    },
    circleIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
    },
    circleIconOn: {
        backgroundColor: colors.accent + '22',
        borderColor: colors.accent,
    },
    circleIconOff: {
        backgroundColor: colors.danger + '22',
        borderColor: colors.danger,
    },
    buttonMain: {
        marginTop: 18,
        borderRadius: theme.borderRadius,
        paddingVertical: 12,
        paddingHorizontal: 38,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonMainOn: {
        backgroundColor: colors.accent,
    },
    buttonMainOff: {
        backgroundColor: colors.danger,
    },
    buttonMainText: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    buttonMainTextOn: {
        color: colors.text,
    },
    buttonMainTextOff: {
        color: colors.text,
    },
    rowCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 18,
        marginBottom: 18,
    },
    cardSmall: {
        backgroundColor: colors.card,
        borderRadius: theme.borderRadius,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 6,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 2,
    },
    cardSmallLabel: {
        color: colors.subtitle,
        fontSize: 13,
        fontFamily: theme.fontFamily,
    },
    cardSmallValue: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: theme.fontFamily,
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
    tabItemActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.accent,
    },
    tabLabel: {
        color: colors.icon,
        fontSize: 13,
        marginTop: 2,
    }
})

