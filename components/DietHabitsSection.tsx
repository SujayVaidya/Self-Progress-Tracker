import Checkbox from 'expo-checkbox';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface DietHabitsSectionProps {
  isAteJunkFood: boolean;
  isAteAfterSunset: boolean;
  onJunkFoodChange: (value: boolean) => void;
  onAfterSunsetChange: (value: boolean) => void;
}

export const DietHabitsSection: React.FC<DietHabitsSectionProps> = ({
  isAteJunkFood,
  isAteAfterSunset,
  onJunkFoodChange,
  onAfterSunsetChange,
}) => {
  return (
    <View>
      <View style={styles.questionRow}>
        <Text style={styles.questionText}> No Junk Food Today?</Text>
        <Checkbox
          value={isAteJunkFood}
          onValueChange={onJunkFoodChange}
          style={{ width: 24, height: 24, borderRadius: 4 }}
          color={isAteJunkFood ? '#007AFF' : undefined}
        />
      </View>
      <View style={styles.questionRow}>
        <Text style={styles.questionText}> No Food After Sunset?</Text>
        <Checkbox
          value={isAteAfterSunset}
          onValueChange={onAfterSunsetChange}
          style={{ width: 24, height: 24, borderRadius: 4 }}
          color={isAteAfterSunset ? '#007AFF' : undefined}
        />
      </View>
    </View>
  );
};

