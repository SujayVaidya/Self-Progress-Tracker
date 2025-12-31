import Checkbox from 'expo-checkbox';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface PhysicalWellbeingSectionProps {
  isExerciseDone: boolean;
  onExerciseChange: (value: boolean) => void;
}

const PhysicalWellbeingSectionComponent: React.FC<PhysicalWellbeingSectionProps> = ({
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

export const PhysicalWellbeingSection = React.memo(PhysicalWellbeingSectionComponent);

