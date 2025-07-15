import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { getIncidents } from '../services/firestoreService';

export default function HistoryScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [marked, setMarked] = useState([]);

  const fetchIncidents = async () => {
    setLoading(true);
    const filters = {};
    if (category) filters.category = category;
    if (date) filters.startDate = date;
    const data = await getIncidents(filters);
    setIncidents(data);
    setLoading(false);
  };

  useEffect(() => { fetchIncidents(); }, [category, date]);

  const toggleMark = (id) => {
    setMarked((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Incidentes</Text>
      <View style={styles.filters}>
        <TextInput placeholder="Categoría" value={category} onChangeText={setCategory} style={styles.input} />
        <TextInput placeholder="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} style={styles.input} />
        <TouchableOpacity style={styles.button} onPress={fetchIncidents}><Text style={styles.buttonText}>Filtrar</Text></TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator color="#1976D2" /> : (
        incidents.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 24 }}>No hay incidentes para mostrar.</Text>
        ) : (
          <FlatList
            data={incidents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => toggleMark(item.id)}>
                <Text style={styles.itemTitle}>{item.type} - {item.category}</Text>
                <Text style={styles.itemText}>{item.date} {item.time} - {item.location}</Text>
                <Text style={{ color: marked.includes(item.id) ? '#E53935' : '#1976D2' }}>
                  {marked.includes(item.id) ? '🔔 Notificarme' : 'Marcar para notificación'}
                </Text>
              </TouchableOpacity>
            )}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1976D2', marginBottom: 12, textAlign: 'center' },
  filters: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#E3E6ED', borderRadius: 8, padding: 8, marginRight: 4 },
  button: { backgroundColor: '#1976D2', padding: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: '#F5F7FB', padding: 12, borderRadius: 10, marginBottom: 8 },
  itemTitle: { fontWeight: 'bold', color: '#1976D2' },
  itemText: { color: '#333' },
}); 