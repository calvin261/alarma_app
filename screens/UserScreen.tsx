import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { colors, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../components/Footer';
import Header from '../components/Header';
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

type RootStackParamList = {
  HistorialDetalle: { incident: Incident };
  [key: string]: any;
};

const UserScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [zoneFilter, setZoneFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchIncidents();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    fetchIncidents(true).then(() => setRefreshing(false));
  };

  const renderItem = ({ item }: { item: Incident }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('HistorialDetalle', { incident: item })}
      activeOpacity={0.8}
    >
      <View style={styles.itemRow}>
        <View style={styles.iconContainer}>
          <Icon name="alert-circle" size={32} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.location}</Text>
          <Text style={styles.itemSubtitle}>{new Date(item.timestamp).toLocaleString('es-ES')}</Text>
          {item.aiAnalysis && (
            <View style={styles.incidentTypeContainer}>
              <Icon name="robot" size={16} color={colors.danger} style={{ marginRight: 4 }} />
              <Text style={styles.incidentType}>{item.aiAnalysis}</Text>
            </View>
          )}
        </View>
        <Icon name="chevron-right" size={28} color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[colors.background, colors.secondary]} style={styles.gradient}>
      <Header />
      <Text style={styles.title}>Historial de Incidentes</Text>
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por zona"
          value={zoneFilter}
          onChangeText={setZoneFilter}
        />
        <TouchableOpacity style={[styles.input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }]} onPress={() => setShowDatePicker(true)}>
          <Icon name="calendar" size={20} color={colors.icon} style={{ marginRight: 6 }} />
          <Text style={{ color: dateFilter ? colors.text : colors.subtitle, fontSize: 15 }}>
            {dateFilter ? dateFilter : 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateFilter ? new Date(dateFilter) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                setDateFilter(`${yyyy}-${mm}-${dd}`);
              }
            }}
          />
        )}
      </View>
      <FlatList
        data={incidents}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        contentContainerStyle={{ paddingBottom: 80 }} // Ajustar el margen inferior para evitar superposición con el tabBar
      />
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
