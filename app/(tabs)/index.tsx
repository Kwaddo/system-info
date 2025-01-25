import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import * as Device from 'expo-device';

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const info = {
      'Device Name': Device.deviceName || 'Unknown Device',
      'System Name': Device.osName || 'Unknown OS',
      'System Version': Device.osVersion || 'Unknown Version',
      'Brand': Device.brand || 'Unknown Brand',
      'Model': Device.modelName || 'Unknown Model',
      'Manufacturer': Device.manufacturer || 'Unknown Manufacturer',
    };
    setSystemInfo(info);
  }, []);

  if (!systemInfo) {
    return <Text style={[styles.text, styles.centeredText]}>Loading...</Text>;
  }

  return (
    <View style={[styles.container, colorScheme === 'dark' ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.heading, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
        System Information
      </Text>
      {Object.entries(systemInfo).map(([key, value]) => (
        <Text
          key={key}
          style={[styles.text, styles.centeredText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}
        >
          {key as typeof systemInfo}: {value}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  centeredText: {
    textAlign: 'center',
  },
  lightBg: {
    backgroundColor: '#f5f5f5',
  },
  darkBg: {
    backgroundColor: '#1c1c1e',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
});

export default SystemInfo;