import React, { useState } from 'react';
import { useSignalListener } from '../hooks/useSignalListener';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, FontFamily, FontSize, theme } from '../theme';
import Footer from '../components/Footer';
import Header from '../components/Header';
import VideoStreamComponent from '../components/VideoStreamComponent';
import { useStreaming } from '../hooks/useStreaming';
import { useCamera } from '../hooks/useCamara';


export default function ResumenScreen() {
    const { cameraIp, setCameraIp } = useCamera();
    useSignalListener('myId');
    const [ipInput, setIpInput] = useState('');
    // Always call useStreaming with a string
    const cameraIpUrl = cameraIp ? cameraIp : 'http://192.168.100.189:8080/';
    const {
        isVideoStreaming,
        videoLoading,
        videoError,
        videoQuality,
        streamUrl,
        connectionStatus,
        startVideoStream,
        stopVideoStream,
        changeVideoQuality,
        reconnectStream,
    } = useStreaming(cameraIpUrl);

    // Conditional rendering for registration form
    // if (!cameraIp) {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <Text style={styles.errorText}>
    //                 No se ha registrado ninguna IP de cámara. Regístrala aquí:
    //             </Text>
    //             <View style={{ width: '100%', marginTop: 20 }}>
    //                 <Text style={{ color: colors.neutro, fontFamily: FontFamily.medium, marginBottom: 8 }}>
    //                     IP de la cámara
    //                 </Text>
    //                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    //                     <View style={{ flex: 1 }}>
    //                         <TextInput
    //                             style={{
    //                                 backgroundColor: 'rgba(0,0,0,0.1)',
    //                                 color: colors.neutro,
    //                                 borderRadius: 8,
    //                                 padding: 12,
    //                                 fontFamily: FontFamily.medium,
    //                             }}
    //                             placeholder="http://192.168.1.1:8080"
    //                             placeholderTextColor={colors.neutro}
    //                             value={ipInput}
    //                             onChangeText={setIpInput}
    //                             autoCapitalize="none"
    //                             keyboardType="url"
    //                         />
    //                     </View>
    //                     <TouchableOpacity
    //                         style={{
    //                             backgroundColor: colors.primary,
    //                             paddingVertical: 12,
    //                             paddingHorizontal: 20,
    //                             borderRadius: 8,
    //                         }}
    //                         onPress={() => {
    //                             if (ipInput.trim()) {
    //                                 setCameraIp(ipInput.trim());
    //                                 Toast.show({
    //                                     type: 'success',
    //                                     text1: 'IP registrada',
    //                                     text2: ipInput.trim(),
    //                                     visibilityTime: 2000,
    //                                 });
    //                             } else {
    //                                 Toast.show({
    //                                     type: 'error',
    //                                     text1: 'Debes ingresar una IP válida',
    //                                     visibilityTime: 2000,
    //                                 });
    //                             }
    //                         }}
    //                     >
    //                         <Text style={{ color: colors.neutro, fontFamily: FontFamily.bold }}>
    //                             Registrar
    //                         </Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // }

    // ...existing code...
    const handleVideoStart = () => {
        Toast.show({
            type: 'info',
            text1: 'Conectando...',
            text2: `Cámara en ${cameraIpUrl}`,
            visibilityTime: 2000,
        });
        startVideoStream();
    };

    const handleVideoStop = () => {
        Toast.show({
            type: 'info',
            text1: 'Desconectando cámara IP...',
            visibilityTime: 2000,
        });
        stopVideoStream();
    };

    const handleQualityChange = (quality: string) => {
        if (isVideoStreaming) {
            Toast.show({
                type: 'info',
                text1: 'Cambiando calidad...',
                text2: `Nueva calidad: ${quality}`,
                visibilityTime: 2000,
            });
            changeVideoQuality(quality);
        } else {
            changeVideoQuality(quality);
            Toast.show({
                type: 'success',
                text1: `Calidad cambiada a ${quality}`,
                visibilityTime: 2000,
            });
        }
    };

    return (
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.background}>
            <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
                <Header />
                <VideoStreamComponent
                    isStreaming={isVideoStreaming}
                    loading={videoLoading}
                    error={videoError}
                    quality={videoQuality}
                    streamUrl={streamUrl}
                    connectionStatus={connectionStatus}
                    onReconnect={reconnectStream}
                    onStart={handleVideoStart}
                    onStop={handleVideoStop}
                    onQualityChange={handleQualityChange}

                    cameraIpUrl={cameraIpUrl}
                />
                
                <Footer />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { flex: 1, marginTop: 64, marginHorizontal: 16 },
    content: { marginTop: 40, flex: 1, paddingTop: 20, gap: 20, width: '100%' },
    location: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
    locationText: {
        color: colors.neutro,
        fontFamily: FontFamily.regular,
        fontSize: FontSize.small,
    },
    text: {
        borderLeftColor: colors.neutro,
        paddingLeft: 16,
        borderLeftWidth: 4,
        color: colors.neutro,
        fontFamily: FontFamily.bold,
        fontSize: FontSize.body,
    },
    transcriptionContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        maxHeight: '40%',
        padding: 16,
        borderRadius: 16,
    },
    textTranscription: {
        color: colors.neutro,
        fontFamily: FontFamily.light,
        fontSize: FontSize.small,
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: colors.danger[500],
        fontFamily: FontFamily.medium,
        fontSize: FontSize.body,
        textAlign: 'center',
    },
})

