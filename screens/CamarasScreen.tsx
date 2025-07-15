import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Button } from 'react-native';
type RootStackParamList = {
    Camaras: undefined;
    UsersMap: undefined;
    // otras pantallas si es necesario
};
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors, theme } from '../theme';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

interface Camera {
    id: string;
    title: string;
    source: any;
    location: string;
    latitude: number;
    longitude: number;
}

const cameras: Camera[] = [
    { id: '1', title: 'Cámara Kuntur 03', source: require('../assets/videos/robo_film.mp4'), location: "Centro comercial 'El Tejar'", latitude: -0.22985, longitude: -78.52495 },
    { id: '2', title: 'Local 2', source: require('../assets/videos/robo_film_2.mp4'), location: "Centro comercial 'El Tejar'", latitude: -0.22985, longitude: -78.52495 },
    { id: '3', title: 'Local 3', source: require('../assets/videos/robo_film_3.mp4'), location: "Centro comercial 'El Tejar'", latitude: -0.22985, longitude: -78.52495 },
    { id: '4', title: 'Local 4', source: require('../assets/videos/robo_film_4.mp4'), location: "Centro comercial 'El Tejar'", latitude: -0.22985, longitude: -78.52495 }
];
export default function CamarasScreen() {
    const [selectedCam, setSelectedCam] = useState<Camera | null>(null);
    const videoRef = useRef<Video>(null);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Camaras'>>();

    if (selectedCam) {
        return (
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.content}>
                    <Button title="< Volver a Cámaras" onPress={() => setSelectedCam(null)} color={colors.primary} />
                    <Text style={styles.locationText}><Feather name="map-pin" size={16} color={colors.text} /> {selectedCam.location}</Text>
                    <Video
                        ref={videoRef}
                        style={styles.video}
                        source={selectedCam.source}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                            if (status.isLoaded && status.didJustFinish) {
                                videoRef.current?.replayAsync();
                            }
                        }}
                    />
                    <Text style={styles.camTitle}>{selectedCam.title}</Text>
                    <View style={styles.coordsContainer}>
                        <Text style={styles.coordText}>Latitud: {selectedCam.latitude}</Text>
                        <Text style={styles.coordText}>Longitud: {selectedCam.longitude}</Text>
                    </View>
                    <TouchableOpacity style={styles.alertButton} onPress={() => alert('Notificando a UPC...')}>
                        <Feather name="bell" size={20} color="#fff" />
                        <Text style={styles.alertButtonText}>Alertar</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Footer />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.grid}>
                    {cameras.map((cam: Camera) => (
                        <TouchableOpacity key={cam.id} style={styles.card} onPress={() => setSelectedCam(cam)}>
                            <Video
                                source={cam.source}
                                style={styles.thumbnail}
                                resizeMode={ResizeMode.COVER}
                                isMuted={true}
                                shouldPlay={true}
                                isLooping={true}
                                useNativeControls={false}
                                pointerEvents="none"
                            />
                            <Text style={styles.title}>{cam.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={[styles.alertButton, { marginTop: 30, backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('UsersMap')}
                >
                    <Feather name="map" size={20} color="#fff" />
                    <Text style={styles.alertButtonText}>Encontrar usuarios en el mapa</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 18, paddingBottom: 100 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: CARD_SIZE, marginBottom: 18 },
    thumbnail: { width: '100%', height: CARD_SIZE, backgroundColor: colors.card, borderRadius: theme.borderRadius },
    title: { marginTop: 8, color: colors.text, textAlign: 'center', fontWeight: '500' },
    locationText: { color: colors.text, fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
    video: { width: '100%', height: 250, borderRadius: theme.borderRadius, backgroundColor: '#000' },
    camTitle: { color: colors.text, fontSize: 14, textAlign: 'center', marginTop: 8 },
    coordsContainer: { marginVertical: 20 },
    coordText: { color: colors.text, fontSize: 18, textAlign: 'center', marginVertical: 5 },
    alertButton: { flexDirection: 'row', backgroundColor: '#E57373', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
    alertButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
