import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// @ts-ignore: Camera type is not exported, use any for ref
import { uploadFile } from '../services/storageService';
import { addIncident } from '../services/firestoreService';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    Welcome: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}



export default function HomeScreen() {

    const navigation = useNavigation();
    const [isOn, setIsOn] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const cameraRef = useRef<any>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
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

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const result = await cameraRef.current.takePictureAsync();
            setPhoto(result.uri);
            setShowCamera(false);
            setIsOn(true);
            try {
                // Subir la foto a Firebase Storage
                const fileName = `photo_${Date.now()}.jpg`;
                const downloadURL = await uploadFile(result.uri, fileName);
                // Guardar metadata en Firestore
                await addIncident({
                    imageUrl: downloadURL,
                    date: new Date(),
                    location: location || '',
                });
            } catch (e) {
                Alert.alert('Error', 'No se pudo guardar la foto en el historial.');
            }
        }
    };

    const handleCloseCamera = () => {
        setShowCamera(false);
    };

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    return (
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
            <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
                <View style={styles.header}>
                    <Icon name="shield-check" size={32} color={colors.icon} style={{ marginRight: 8 }} />
                    <View>
                        <Text style={styles.logo}>KUNTUR</Text>
                        <Text style={styles.slogan}>Seguridad desde las nubes</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {/* Opcional: icono de configuración u otro contenido */}
                    </View>
                </View>
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
                    <Icon
                        name={isOn ? "power" : "power-off"}
                        size={54}
                        color={isOn ? colors.accent : colors.danger}
                    />
                </View>
                <Text style={styles.cardMainTitle}>{'Kuntur'}</Text>
                <Text style={styles.cardMainSubtitle}>{'a la Escucha'}</Text>
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
                <View style={styles.rowCards}>
                    <View style={styles.cardSmall}>
                        <Icon name="headphones" size={32} color={colors.icon} style={{ marginBottom: 6 }} />
                        <Text style={styles.cardSmallLabel}>Última Alerta</Text>
                        <Text style={styles.cardSmallValue}>21:39</Text>
                    </View>
                    <View style={styles.cardSmall}>
                        <Icon name="chart-bar" size={32} color={colors.icon} style={{ marginBottom: 6 }} />
                        <Text style={styles.cardSmallLabel}>Tipos de Incidencias</Text>
                        <Text style={styles.cardSmallValue}>20</Text>
                    </View>
                </View>
                <View style={styles.tabBar}>
                    <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Historial')}>
                        <Icon name="history" size={24} color={colors.icon} />
                        <Text style={styles.tabLabel}>Historial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
                        <Icon name="microphone" size={24} color={colors.accent} />
                        <Text style={[styles.tabLabel, { color: colors.accent }]}>Monitorear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                        <Icon name="account-group" size={24} color={colors.icon} />
                        <Text style={styles.tabLabel}>Contactos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                        <Icon name="map-search" size={24} color={colors.icon} />
                        <Text style={styles.tabLabel}>Encontrar</Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: 50,
        marginBottom: 60,
        paddingHorizontal: 18,
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

