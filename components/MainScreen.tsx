import { Activity, Flame, UtensilsCrossed } from 'lucide-react-native';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';
import { supabase } from '../supabase';
import { AccordionSection } from './AccordionSection';
import { DietHabitsSection } from './DietHabitsSection';
import { JapaStotraSection } from './JapaStotraSection';
import { LoadingIndicator } from './LoadingIndicator';
import { PhysicalWellbeingSection } from './PhysicalWellbeingSection';
import { WeeklyCalendarStrip } from './WeeklyCalendarStrip';

interface SadhanaData {
  date: string;
  japa: boolean[];
  stotra: boolean[];
  is_exercise_done: boolean;
  is_ate_junkfood: boolean;
  is_ate_after_sunset: boolean;
}

export const MainScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format('YYYY-MM-DD')
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form state
  const [japa, setJapa] = useState<boolean[]>([false, false, false]);
  const [stotra, setStotra] = useState<boolean[]>([false, false, false]);
  const [isExerciseDone, setIsExerciseDone] = useState<boolean>(false);
  const [isAteJunkFood, setIsAteJunkFood] = useState<boolean>(false);
  const [isAteAfterSunset, setIsAteAfterSunset] = useState<boolean>(false);

  // Accordion states
  const [japaExpanded, setJapaExpanded] = useState<boolean>(true);
  const [physicalExpanded, setPhysicalExpanded] = useState<boolean>(false);
  const [dietExpanded, setDietExpanded] = useState<boolean>(false);

  // Fetch data from Supabase
  const fetchData = useCallback(async (date: string, isInitialLoad: boolean = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setContentLoading(true);
      }
      const { data, error } = await supabase
        .from('sadhna_logs')
        .select('*')
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new dates
        console.error('Error fetching data:', error);
        throw error;
      }

      if (data) {
        // Pre-fill form with existing data
        setJapa(data.japa || [false, false, false]);
        setStotra(data.stotra || [false, false, false]);
        setIsExerciseDone(data.is_exercise_done || false);
        setIsAteJunkFood(data.is_ate_junkfood || false);
        setIsAteAfterSunset(data.is_ate_after_sunset || false);
      } else {
        // Reset to defaults if no data exists
        setJapa([false, false, false]);
        setStotra([false, false, false]);
        setIsExerciseDone(false);
        setIsAteJunkFood(false);
        setIsAteAfterSunset(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setContentLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(selectedDate, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data when date changes (after initial load)
  useEffect(() => {
    if (!loading) {
      fetchData(selectedDate, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, loading]);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // Handle japa checkbox changes
  const handleJapaChange = (index: number, value: boolean) => {
    const newJapa = [...japa];
    newJapa[index] = value;
    setJapa(newJapa);
  };

  // Handle stotra checkbox changes
  const handleStotraChange = (index: number, value: boolean) => {
    const newStotra = [...stotra];
    newStotra[index] = value;
    setStotra(newStotra);
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const dataToUpsert: SadhanaData = {
        date: selectedDate,
        japa,
        stotra,
        is_exercise_done: isExerciseDone,
        is_ate_junkfood: isAteJunkFood,
        is_ate_after_sunset: isAteAfterSunset,
      };

      const { error } = await supabase
        .from('sadhna_logs')
        .upsert(dataToUpsert, {
          onConflict: 'date',
        });

      if (error) {
        console.error('Error submitting data:', error);
        Alert.alert('Error', 'Failed to save data. Please try again.');
        return;
      }

      Alert.alert('Success', 'Your daily log has been saved!');
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>My Daily Sadhana</Text>

        <WeeklyCalendarStrip
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20, marginTop: 20, paddingBottom: 100, zIndex: 10 }}
        >
          {contentLoading ? (
            <View style={styles.contentLoadingContainer}>
              <LoadingIndicator />
            </View>
          ) : (
            <>
              {/* Japa & Stotra Section */}
              <AccordionSection
                title="Japa & Stotra"
                icon={<Flame size={24} color="#FFA726" />}
                isExpanded={japaExpanded}
                onToggle={() => setJapaExpanded(!japaExpanded)}
              >
                <JapaStotraSection
                  japa={japa}
                  stotra={stotra}
                  onJapaChange={handleJapaChange}
                  onStotraChange={handleStotraChange}
                />
              </AccordionSection>

              {/* Physical Well-being Section */}
              <AccordionSection
                title="Physical Well-being"
                icon={<Activity size={24} color="#66BB6A" />}
                isExpanded={physicalExpanded}
                onToggle={() => setPhysicalExpanded(!physicalExpanded)}
              >
                <PhysicalWellbeingSection
                  isExerciseDone={isExerciseDone}
                  onExerciseChange={setIsExerciseDone}
                />
              </AccordionSection>

              {/* Diet & Habits Section */}
              <AccordionSection
                title="Diet & Habits"
                icon={<UtensilsCrossed size={24} color="#42A5F5" />}
                isExpanded={dietExpanded}
                onToggle={() => setDietExpanded(!dietExpanded)}
              >
                <DietHabitsSection
                  isAteJunkFood={isAteJunkFood}
                  isAteAfterSunset={isAteAfterSunset}
                  onJunkFoodChange={setIsAteJunkFood}
                  onAfterSunsetChange={setIsAteAfterSunset}
                />
              </AccordionSection>
            </>
          )}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {submitting
              ? 'Submitting...'
              : selectedDate === moment().format('YYYY-MM-DD')
                ? "Submit Today's Log"
                : `Submit Log for ${moment(selectedDate).format('MMM D')}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

