import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, theme } from '../theme';

export default function Header() {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/face.png')} style={styles.headerIcon} />
      <View style={styles.headerCenter}>
        <Image source={require('../assets/latters.png')} style={styles.headerLatters} />
      </View>
      <Image source={require('../assets/chip_set.png')} style={styles.headerIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
