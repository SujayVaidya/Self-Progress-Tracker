import Checkbox from 'expo-checkbox';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface JapaStotraSectionProps {
  japa: boolean[];
  stotra: boolean[];
  onJapaChange: (index: number, value: boolean) => void;
  onStotraChange: (index: number, value: boolean) => void;
}

const JapaStotraSectionComponent: React.FC<JapaStotraSectionProps> = ({
  japa,
  stotra,
  onJapaChange,
  onStotraChange,
}) => {
  return (
    <View>
      {/* Mantra Japa */}
      <View style={styles.activityContainer}>
        <View style={styles.activityRow}>
          <View style={[styles.activityImage, { backgroundColor: '#3A2E1F' }]}>
            <Text style={{ fontSize: 24, textAlign: 'center', lineHeight: 60, color: '#FFD700' }}>
              ॐ
            </Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Mantra Japa</Text>
            <View style={styles.checkboxContainer}>
              {[0, 1, 2].map((index) => (
                <Checkbox
                  key={index}
                  value={japa[index] || false}
                  onValueChange={(value) => onJapaChange(index, value)}
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                  color={japa[index] ? '#007AFF' : undefined}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Stotra Recitations */}
      <View style={styles.activityContainer}>
        <View style={styles.activityRow}>
          <View style={[styles.activityImage, { backgroundColor: '#2A3A2A' }]}>
            <Text style={{ fontSize: 20, textAlign: 'center', lineHeight: 50 }}>
              📜
            </Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Stotra Recitations </Text>
            <View style={styles.checkboxContainer}>
              {[0, 1, 2].map((index) => (
                <Checkbox
                  key={index}
                  value={stotra[index] || false}
                  onValueChange={(value) => onStotraChange(index, value)}
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                  color={stotra[index] ? '#007AFF' : undefined}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const JapaStotraSection = React.memo(JapaStotraSectionComponent);

