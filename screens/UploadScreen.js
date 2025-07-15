import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile } from '../services/storageService';
import { analyzeVideo } from '../services/visionService';

export default function UploadScreen() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isExpoGo, setIsExpoGo] = useState(false);

  React.useEffect(() => {
    // Detectar si se está usando Expo Go
    if (global?.ExpoGo) setIsExpoGo(true);
  }, []);

  const pickAndUpload = async () => {
    setSuccess(false);
    setAnalysisResult(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/*', 'application/octet-stream'], // Solo videos
        copyToCacheDirectory: true,
      });
      if (!result || result.type === 'cancel') return;
      const { uri, name, size, mimeType } = result;
      if (!uri || !name || !size) {
        Alert.alert('Archivo inválido', 'Selecciona un archivo válido.');
        return;
      }
      // Validar tipo de archivo de video soportado
      const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/avi', 'video/mpeg', 'video/webm', 'video/3gpp', 'video/3gpp2', 'video/x-msvideo', 'video/x-flv', 'video/x-ms-wmv', 'video/mov'];
      if (mimeType && !validVideoTypes.includes(mimeType)) {
        Alert.alert('Tipo de archivo no soportado', 'El formato seleccionado no es compatible. Usa videos mp4, mkv, avi, mov, webm, etc.');
        return;
      }
      if (size > 50 * 1024 * 1024) {
        Alert.alert('Archivo demasiado grande', 'El archivo debe ser menor a 50 MB.');
        return;
      }
      setUploading(true);
      const downloadUrl = await uploadFile(uri, name, setProgress);
      setUploading(false);
      setSuccess(true);
      setAnalyzing(true);
      const analysis = await analyzeVideo(downloadUrl);
      setAnalysisResult(analysis);
      setAnalyzing(false);
    } catch (error) {
      setUploading(false);
      setAnalyzing(false);
      Alert.alert('Error', 'No se pudo cargar o analizar el archivo. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carga de Video/Audio</Text>
      <TouchableOpacity style={styles.button} onPress={pickAndUpload} disabled={uploading || analyzing}>
        <Text style={styles.buttonText}>{uploading ? 'Cargando...' : analyzing ? 'Analizando...' : 'Seleccionar archivo'}</Text>
      </TouchableOpacity>
      {isExpoGo && (
        <Text style={{ color: '#E53935', marginBottom: 12, textAlign: 'center' }}>
          ¡Estás usando Expo Go! Las notificaciones push y algunos módulos nativos no funcionarán aquí. Usa un development build para probar todas las funciones.
        </Text>
      )}
      {uploading && (
        <View style={{ width: '100%', marginTop: 16 }}>
          {/* Barra de progreso personalizada */}
          <View style={{ height: 8, backgroundColor: '#E3E6ED', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: `${progress}%`, height: 8, backgroundColor: '#1976D2' }} />
          </View>
          <Text style={{ textAlign: 'center', marginTop: 8 }}>{progress.toFixed(0)}%</Text>
        </View>
      )}
      {success && <Text style={styles.success}>¡Archivo cargado exitosamente!</Text>}
      {analyzing && <ActivityIndicator color="#1976D2" style={{ marginTop: 16 }} />}
      {analysisResult && (
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>Resultado del análisis:</Text>
          <Text style={{ color: analysisResult.threatDetected ? '#E53935' : '#388E3C', fontWeight: 'bold' }}>
            {analysisResult.threatDetected ? '¡Amenaza detectada!' : 'No se detectaron amenazas.'}
          </Text>
          <Text style={{ color: '#333', marginTop: 4 }}>{analysisResult.details || ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1976D2', marginBottom: 24 },
  button: { backgroundColor: '#1976D2', padding: 16, borderRadius: 12, width: '100%', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  success: { color: '#388E3C', fontWeight: 'bold', marginTop: 16, fontSize: 16 },
  analysisBox: { backgroundColor: '#F5F7FB', padding: 16, borderRadius: 10, marginTop: 16, width: '100%' },
  analysisTitle: { fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
}); 