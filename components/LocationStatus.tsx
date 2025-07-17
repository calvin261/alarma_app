import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';

interface LocationStatusProps {
  location: string | null;
  loading: boolean;
  error: string | null;
}

const LocationStatus: React.FC<LocationStatusProps> = ({ location, loading, error }) => (
  <View style={[styles.location, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}> 
    <Icon name="map-marker" size={18} color={colors.accent} style={{ marginRight: 6 }} />
    {loading ? (
      <ActivityIndicator size="small" color={colors.accent} />
    ) : error ? (
      <Text style={{ color: colors.danger[500], textAlign: 'center' }}>{error}</Text>
    ) : location ? (
      <Text style={{ color: colors.text, textAlign: 'center' }}>{location}</Text>
    ) : (
      <Text style={{ textAlign: 'center' }}>Ubicación desconocida</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  location: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
    display: 'flex',
    justifyContent: 'center',
  },
});

export default LocationStatus;
