// Pantalla principal: muestra el estado del sistema y permite activar/desactivar la escucha
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { colors, theme } from '../theme';
import * as Notifications from 'expo-notifications';
import database from '@react-native-firebase/database';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import LocationStatus from '../components/LocationStatus';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../components/Footer';

// Define el tipo de rutas principales
export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Login: undefined;
    Register: undefined;
    Mapa: undefined;
    Welcome: undefined;
    Encontrar: undefined;
    Resumen: undefined;
    Proceso: undefined;
    User: undefined;
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
    // El listener global se inicializa en App.tsx mediante SignalListenerProvider
    // screenHeight: alto de pantalla para diseño responsivo
    const screenHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [isOn, setIsOn] = useState(false);

    const [location, setLocation] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);



    // Escribe el estado de activación en la base de datos en tiempo real
    const writteRealDatabase = async (data: { trigger: boolean; timestamp: number }) => {
        try {
            database()
                .ref(`/signals/myId`)
                .set({
                    trigger: data.trigger,
                    timestamp: data.timestamp
                })
                .then(() => console.log('Data set.'));
        } catch (error) {
            console.error('Error escribiendo en la base de datos:', error);
        }
    };
    // Cambia el estado de escucha y actualiza la base de datos
    const handleToggle = async () => {
        await writteRealDatabase({ trigger: !isOn, timestamp: Date.now() });
        setIsOn(!isOn);
    };

    // Obtener ubicación de forma asíncrona
    // Obtiene la ubicación actual del usuario al cargar la pantalla
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
    // Maneja la respuesta a notificaciones push y navega al historial si corresponde
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data?.incidentType) {
                navigation.navigate('Historial' as never);
            }
        });
        return () => subscription.remove();
    }, [navigation]);

    return (
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
            <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
                <Header />
                <LocationStatus location={location} loading={loadingLocation} error={locationError} />
                <View style={[styles.cardMain, { height: screenHeight * 0.63, marginBottom: 2 }]}>
                    <View style={[styles.circleIcon, isOn ? styles.circleIconOn : styles.circleIconOff]}>
                        <Image
                            source={isOn ? require('../assets/power_on_icon.png') : require('../assets/power_off_icon.png')}
                            style={{ width: 160, height: 160 }}
                        />
                    </View>
                    <Text style={[styles.cardMainTitle, { color: isOn ? colors.accent[500] : colors.danger[500] }]}>{'Kuntur'}</Text>
                    <Text style={[styles.cardMainSubtitle, { color: isOn ? colors.accent[400] : colors.danger[400] }]}>{isOn ? 'a la Escucha' : 'Apagado'}</Text>
                    <TouchableOpacity
                        style={[styles.buttonMain, isOn ? styles.buttonMainOn : styles.buttonMainOff]}
                        onPress={handleToggle}
                    >
                        <Icon name="power" size={24} color={isOn ? colors.accent[500] : colors.danger[500]} />
                        <Text style={[styles.buttonMainText, isOn ? styles.buttonMainTextOn : styles.buttonMainTextOff]}>
                            {isOn ? "Apagar" : "Activar"}
                        </Text>
                    </TouchableOpacity>
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

        fontSize: 20,
        marginTop: 75,
        fontWeight: 'light',
        fontFamily: theme.fontFamily,
    },
    cardMainSubtitle: {
        color: colors.danger[500],
        fontSize: 20,

        fontWeight: 'light',
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
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    circleIconOff: {
        backgroundColor: colors.danger[200],
        borderColor: colors.danger[200],
    },
    buttonMain: {
        marginTop: 70,
        borderRadius: theme.borderRadius,
        paddingVertical: 12,
        paddingHorizontal: 38,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonMainOn: {
        backgroundColor: colors.accent[500],
    },
    buttonMainOff: {
        backgroundColor: colors.danger[200],

    },
    buttonMainText: {
        fontSize: 20,
        fontWeight: 'light',
        letterSpacing: 1,
    },
    buttonMainTextOn: {
        color: colors.accent,
    },
    buttonMainTextOff: {
        color: colors.danger[500],
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

