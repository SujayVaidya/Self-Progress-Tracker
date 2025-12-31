import React from 'react';
import { View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import { styles } from '../styles';

interface PhysicalWellbeingSectionProps {
  isExerciseDone: boolean;
  onExerciseChange: (value: boolean) => void;
}

export const PhysicalWellbeingSection: React.FC<PhysicalWellbeingSectionProps> = ({
  isExerciseDone,
  onExerciseChange,
}) => {
  return (
    <View style={styles.questionRow}>
      <Text style={styles.questionText}>Did you exercise?</Text>
      <Checkbox
        value={isExerciseDone}
        onValueChange={onExerciseChange}
        style={{ width: 24, height: 24, borderRadius: 4 }}
        color={isExerciseDone ? '#007AFF' : undefined}
      />
    </View>
  );
};

