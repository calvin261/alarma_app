import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { colors, theme } from '../theme';

export default function Footer() {
  const navigation = useNavigation();
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Historial')}>
        <Icon name="history" size={24} color={colors.icon} />
        <Text style={styles.tabLabel}>Historial</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabItem]} onPress={() => navigation.navigate('Home')}>
        <Icon name="shield-home-outline" size={24} color={colors.icon} />
        <Text style={styles.tabLabel}>Monitorear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Camaras')}>
        <Icon name="camera-wireless-outline" size={24} color={colors.icon} />
        <Text style={styles.tabLabel}>Camaras</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('UsersMap')}>
        <Icon name="google-maps" size={24} color={colors.icon} />
        <Text style={styles.tabLabel}>Encontrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
