import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { RotateCcw, Settings } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import * as Device from 'expo-device';
import Header from '@/components/Header';

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [showTargets, setShowTargets] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const targetOptions = [33, 99, 100, 500, 1000];

  const commonDhikr = [
    { text: 'Subhan Allah', bengali: 'সুবহান আল্লাহ', count: 33 },
    { text: 'Alhamdulillah', bengali: 'আলহামদুলিল্লাহ', count: 33 },
    { text: 'Allahu Akbar', bengali: 'আল্লাহু আকবর', count: 33 },
    { text: 'La ilaha illallah', bengali: 'লা ইলাহা ইল্লাল্লাহ', count: 100 },
    { text: 'Astaghfirullah', bengali: 'আস্তাগফিরুল্লাহ', count: 100 },
  ];

  useEffect(() => {
    loadSavedCount();
  }, []);

  const loadSavedCount = async () => {
    try {
      const deviceId = Device.modelName || 'unknown-device';
      const { data } = await supabase
        .from('tasbih_counts')
        .select('*')
        .eq('user_id', deviceId)
        .maybeSingle();

      if (data) {
        setCount(data.count || 0);
        setTarget(data.target || 33);
      }
    } catch (error) {
      console.error('Error loading count:', error);
    }
  };

  const saveCount = async (newCount: number, newTarget: number) => {
    try {
      const deviceId = Device.modelName || 'unknown-device';
      const { data: existing } = await supabase
        .from('tasbih_counts')
        .select('id')
        .eq('user_id', deviceId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('tasbih_counts')
          .update({
            count: newCount,
            target: newTarget,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', deviceId);
      } else {
        await supabase.from('tasbih_counts').insert({
          user_id: deviceId,
          count: newCount,
          target: newTarget,
        });
      }
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    saveCount(newCount, target);

    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    rotation.value = withSequence(
      withSpring(10, { damping: 10 }),
      withSpring(-10, { damping: 10 }),
      withSpring(0, { damping: 10 })
    );

    if (Platform.OS !== 'web') {
      if (newCount % target === 0) {
        (async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        })();
      } else {
        (async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        })();
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    saveCount(0, target);
    if (Platform.OS !== 'web') {
      (async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      })();
    }
  };

  const handleSetTarget = (newTarget: number) => {
    setTarget(newTarget);
    saveCount(count, newTarget);
    setShowTargets(false);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const progress = (count % target) / target;
  const completedSets = Math.floor(count / target);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Target</Text>
            <Text style={styles.statValue}>{target}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completed Sets</Text>
            <Text style={styles.statValue}>{completedSets}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{count}</Text>
          </View>
        </View>

        <View style={styles.counterContainer}>
          <View style={styles.progressRing}>
            <View
              style={[
                styles.progressFill,
                { height: `${progress * 100}%` },
              ]}
            />
            <View style={styles.countDisplay}>
              <Text style={styles.currentCount}>{count % target}</Text>
              <Text style={styles.countLabel}>/ {target}</Text>
            </View>
          </View>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={handleIncrement}
              activeOpacity={0.8}>
              <Text style={styles.counterButtonText}>TAP</Text>
              <Text style={styles.counterButtonSubtext}>ট্যাপ করুন</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
            <RotateCcw size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowTargets(!showTargets)}>
            <Settings size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Target</Text>
          </TouchableOpacity>
        </View>

        {showTargets && (
          <View style={styles.targetSelector}>
            <Text style={styles.targetSelectorTitle}>Select Target</Text>
            <View style={styles.targetOptions}>
              {targetOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.targetOption,
                    target === option && styles.targetOptionActive,
                  ]}
                  onPress={() => handleSetTarget(option)}>
                  <Text
                    style={[
                      styles.targetOptionText,
                      target === option && styles.targetOptionTextActive,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.dhikrSection}>
          <Text style={styles.sectionTitle}>Common Dhikr</Text>
          <Text style={styles.sectionSubtitle}>প্রচলিত যিকির</Text>
          <View style={styles.dhikrList}>
            {commonDhikr.map((dhikr, index) => (
              <View key={index} style={styles.dhikrCard}>
                <View style={styles.dhikrInfo}>
                  <Text style={styles.dhikrText}>{dhikr.text}</Text>
                  <Text style={styles.dhikrBengali}>{dhikr.bengali}</Text>
                </View>
                <View style={styles.dhikrCount}>
                  <Text style={styles.dhikrCountText}>×{dhikr.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Tasbih</Text>
          <Text style={styles.infoText}>
            The Tasbih is a form of dhikr that involves the repetitive recitation of phrases glorifying Allah. It's traditionally counted using prayer beads or fingers.
          </Text>
          <Text style={styles.infoText}>
            তাসবীহ হল যিকিরের একটি রূপ যা আল্লাহর মহিমা কীর্তনের পুনরাবৃত্তিমূলক পাঠ জড়িত। এটি ঐতিহ্যগতভাবে প্রার্থনার মালা বা আঙ্গুল ব্যবহার করে গণনা করা হয়।
          </Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#047857',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D1FAE5',
  },
  countDisplay: {
    alignItems: 'center',
    zIndex: 1,
  },
  currentCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#047857',
  },
  countLabel: {
    fontSize: 18,
    color: '#6B7280',
  },
  counterButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  counterButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  counterButtonSubtext: {
    fontSize: 16,
    color: '#D1FAE5',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  controlButton: {
    backgroundColor: '#047857',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  targetSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  targetSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  targetOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  targetOption: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  targetOptionActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#047857',
  },
  targetOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  targetOptionTextActive: {
    color: '#047857',
  },
  dhikrSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  dhikrList: {
    gap: 12,
  },
  dhikrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dhikrInfo: {
    flex: 1,
  },
  dhikrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dhikrBengali: {
    fontSize: 14,
    color: '#6B7280',
  },
  dhikrCount: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dhikrCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
});
