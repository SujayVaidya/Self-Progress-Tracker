import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from '../styles';

export const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

