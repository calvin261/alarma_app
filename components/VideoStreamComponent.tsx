// components/VideoStreamComponent.jsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, FontFamily, FontSize } from '../theme';
export default function VideoStreamComponent({
    isStreaming,
    loading,
    error,
    quality,
    streamUrl,
    onStart,
    onStop,
    onQualityChange,
    connectionStatus,
    onReconnect,
    cameraIpUrl
}: {
    isStreaming: boolean;
    loading: boolean;
    error: string | null;
    quality: string;
    streamUrl: string | null;
    onStart: () => void;
    onStop: () => void;
    onQualityChange: (quality: string) => void;
    connectionStatus: string;
    onReconnect: () => void;
    cameraIpUrl: string;
}) {
    const webRef = useRef<any>(null);

    const mjpegHTML = `
    <!DOCTYPE html>
    <html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>body,html{margin:0;padding:0;background:#000;height:100%;overflow:hidden}
             img{width:100%;height:100%;object-fit:cover}</style>
    </head><body>
      <img src="${streamUrl || `${cameraIpUrl}/videofeed`}">
      <script>
        // recarga cada 30s para mantener vivo el MJPEG
        setInterval(() => {
          const img = document.querySelector('img');
          img.src = "${cameraIpUrl}/videofeed?" + Date.now();
        }, 30000);
      </script>
    </body></html>
  `;

    return (
        <View style={styles.wrapper}>
            <View style={styles.videoBox}>
                {loading && (
                    <View style={styles.overlayCenter}>
                        <ActivityIndicator size="large" color={colors.primary_2[500]} />
                        <Text style={styles.statusText}>Conectando…</Text>
                    </View>
                )}

                {!!error && (
                    <View style={styles.overlayCenter}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={onStart} style={styles.retryBtn}>
                            <Text style={styles.retryText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!loading && !error && isStreaming && (
                    <WebView
                        ref={webRef}
                        originWhitelist={['*']}
                        source={{ html: mjpegHTML }}
                        style={styles.webview}
                        javaScriptEnabled
                        domStorageEnabled
                    />
                )}

                {!loading && !error && !isStreaming && (
                    <View style={styles.overlayCenter}>
                        <Text style={styles.statusText}>Cámara desconectada</Text>
                    </View>
                )}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={isStreaming ? onStop : onStart}
                    style={[
                        styles.btn,
                        isStreaming ? styles.stopBtn : styles.startBtn
                    ]}
                >
                    {isStreaming ? <Icon name="stop" size={16} color="#fff" /> : <Icon name="play" size={16} color="#fff" />}
                    <Text style={styles.btnText}>
                        {isStreaming ? 'Detener' : 'Iniciar'}
                    </Text>
                </TouchableOpacity>

                {isStreaming && (
                    <TouchableOpacity onPress={onReconnect} style={styles.iconBtn}>
                        <Icon name="refresh" size={20} color={colors.neutro} />
                    </TouchableOpacity>
                )}

                {['HD', 'SD', 'LOW'].map(q => (
                    <TouchableOpacity
                        key={q}
                        onPress={() => onQualityChange(q)}
                        style={[
                            styles.qualityBtn,
                            quality === q && styles.qualityActive
                        ]}
                    >
                        <Text
                            style={[
                                styles.qualityText,
                                quality === q && styles.qualityTextActive
                            ]}
                        >
                            {q}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginVertical: 10 },
    videoBox: {
        height: 200,
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden'
    },
    webview: { flex: 1, backgroundColor: '#000' },
    overlayCenter: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    statusText: {
        color: colors.neutro,
        fontFamily: FontFamily.regular,
        marginTop: 8
    },
    errorText: {
        color: colors.danger[500],
        fontFamily: FontFamily.regular,
        textAlign: 'center'
    },
    retryBtn: {
        marginTop: 8,
        padding: 8,
        backgroundColor: colors.primary_2[500],
        borderRadius: 6
    },
    retryText: {
        color: '#fff',
        fontFamily: FontFamily.medium
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 6
    },
    startBtn: { backgroundColor: colors.primary_2[500] },
    stopBtn: { backgroundColor: colors.danger[500], marginRight: 10 },
    btnText: { color: '#fff', marginLeft: 6, fontFamily: FontFamily.medium },
    iconBtn: { marginHorizontal: 10 },
    qualityBtn: {
        marginLeft: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: colors.dark[700]
    },
    qualityActive: { backgroundColor: colors.primary_2[500] },
    qualityText: {
        color: colors.neutro,
        fontFamily: FontFamily.regular,
        fontSize: FontSize.small
    },
    qualityTextActive: { color: '#fff' }
});
