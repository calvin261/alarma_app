
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { colors, FontFamily, FontSize } from '../theme';
import Header from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../components/Footer';
import LocationStatus from '../components/LocationStatus';
import * as Location from 'expo-location';

const ProcesoScreen = () => {
    const [location, setLocation] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [photo, setPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/appmineria-73303.firebasestorage.app/o/evidencias%2FScreenshot%202025-07-17%20151528.png?alt=media&token=8d20d928-2d01-45b0-8186-9a8d680513ad'); // Replace with actual photo URL
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

    return (
        <LinearGradient
            colors={[colors.primary_2[500], colors.secondary_2[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Header />
                <ScrollView>
                    <LocationStatus location={location} loading={loadingLocation} error={locationError} />
                    <View style={styles.content}>
                        <Image source={{ uri: photo }} style={styles.image} />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.title}>Parte Policial</Text>
                        <View style={styles.containerBlack}>
                            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                                <Text style={styles.textContainer}>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, illum eos praesentium, officiis doloribus nulla molestiae neque minus facere fugiat quam tempore necessitatibus mollitia ex magnam excepturi alias laborum omnis.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi veritatis debitis fugiat dolorum placeat aliquid ipsam pariatur neque consequatur? Cupiditate nemo vero, consectetur animi temporibus aliquam sapiente totam praesentium! Mollitia.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                </Text>
                            </ScrollView>
                        </View>
                        <Text style={styles.title2}>Sentencia</Text>
                        <View style={styles.containerBlack}>
                            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                                <Text style={styles.textContainer}>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, illum eos praesentium, officiis doloribus nulla molestiae neque minus facere fugiat quam tempore necessitatibus mollitia ex magnam excepturi alias laborum omnis.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi veritatis debitis fugiat dolorum placeat aliquid ipsam pariatur neque consequatur? Cupiditate nemo vero, consectetur animi temporibus aliquam sapiente totam praesentium! Mollitia.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ut rem quasi, quibusdam dicta ducimus, alias vitae impedit eius nesciunt ratione repudiandae pariatur voluptate facilis, illo vero tempore temporibus ad.
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <Footer />
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 16,

        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        marginTop: 64,
        marginHorizontal: 16,
    },
    content: {
        justifyContent: 'center',
        gap: 10,
    },
    title: {
        marginTop: 40,
        borderLeftWidth: 4,
        paddingLeft: 8,
        borderColor: colors.neutro,
        color: colors.neutro,
        fontSize: FontSize.body,
        fontFamily: FontFamily.bold,
    },
    title2: {
        borderLeftWidth: 4,
        paddingLeft: 8,
        borderColor: colors.neutro,
        color: colors.neutro,
        fontSize: FontSize.body,
        fontFamily: FontFamily.bold,
    },
    containerBlack: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        maxHeight: '35%',
        padding: 16,
        borderRadius: 16,
    },
    textContainer: {
        color: colors.neutro,
        fontFamily: FontFamily.light,
        fontSize: FontSize.small,
        lineHeight: 20,
    }
});
export default ProcesoScreen;