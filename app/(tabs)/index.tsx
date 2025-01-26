import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import * as Device from 'expo-device';

async function getUptimeInMinutes() {
  const uptimeInMilliseconds = await Device.getUptimeAsync();
  const uptimeInMinutes = Math.floor(uptimeInMilliseconds / 1000 / 60);
  return uptimeInMinutes+" Minutes";
}

function getTotalMemoryInGB() {
  const totalMemoryInBytes = Device.totalMemory;
  if (totalMemoryInBytes === null) {
    return 'Unknown Memory';
  }
  const totalMemoryInGB = Math.round(totalMemoryInBytes / (1024 * 1024 * 1024));
  return totalMemoryInGB+" GB";
}

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const info = {
      'Device Name': Device.deviceName || 'Unknown Device',
      'Device Design Name': Device.designName || 'Unknown Design',
      'Device Product Name': Device.productName || 'Unknown Product',
      'System Name': Device.osName || 'Unknown OS',
      'System Version': Device.osVersion || 'Unknown Version',
      'System Build Number': Device.osBuildId || 'Unknown Build Number',
      'System API Level': Device.osInternalBuildId || 'Unknown API Level',
      'Total Memory': getTotalMemoryInGB() || 'Unknown Memory Level',
      'Brand': Device.brand || 'Unknown Brand',
      'Model': Device.modelName || 'Unknown Model',
      'Device Type': Device.deviceType || 'Unknown Device Type',
      'Device Year Class': Device.deviceYearClass || 'Unknown Year Class',
      'Device Model ID': Device.modelId || 'Unknown Identifier',
      'Manufacturer': Device.manufacturer || 'Unknown Manufacturer',
      'Supported Architecture CPU': Device.supportedCpuArchitectures || 'Unknown Architecture',
      'Current Uptime': getUptimeInMinutes() || 'Unknown Uptime',
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