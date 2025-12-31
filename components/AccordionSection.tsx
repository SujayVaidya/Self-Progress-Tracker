import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Layout
} from 'react-native-reanimated';
import { styles } from '../styles';

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSectionComponent: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}) => {
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(isExpanded ? 1 : 0, { duration: 200 });
  }, [isExpanded]);

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.accordionCard}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderContent}>
          <View style={styles.accordionIcon}>{icon}</View>
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color="#AAAAAA" />
        ) : (
          <ChevronDown size={20} color="#AAAAAA" />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <Animated.View 
          style={[styles.accordionContent, animatedContentStyle]}
          layout={Layout.springify()}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
};

export const AccordionSection = React.memo(AccordionSectionComponent);

