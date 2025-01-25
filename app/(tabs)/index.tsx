import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);

  useEffect(() => {
    // Get system info from expo-device
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
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>System Information</Text>
      {Object.entries(systemInfo).map(([key, value]) => (
        <Text key={key} style={styles.text}>
          {key as typeof systemInfo}: {value}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginVertical: 4 },
});

export default SystemInfo;
