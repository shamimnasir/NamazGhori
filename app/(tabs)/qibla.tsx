import { View, Text, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Qibla, Coordinates } from 'adhan';
import { AlertCircle, Navigation } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Header from '@/components/Header';

export default function QiblaScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [heading, setHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const rotation = useSharedValue(0);

  useEffect(() => {
    initializeQibla();

    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  const initializeQibla = async () => {
    try {
      if (Platform.OS === 'web') {
        setError('Compass functionality is not available on web. Please use the mobile app.');
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required to determine Qibla direction');
        setLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);

      const coords = new Coordinates(
        locationData.coords.latitude,
        locationData.coords.longitude
      );
      const qibla = Qibla(coords);

      setQiblaDirection(qibla);

      Magnetometer.setUpdateInterval(100);
      Magnetometer.addListener((data) => {
        const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        const normalizedAngle = (angle + 360) % 360;
        setHeading(normalizedAngle);
      });

      setLoading(false);
    } catch (err) {
      console.error('Error initializing Qibla:', err);
      setError('Unable to get location. Please check your settings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const direction = qiblaDirection - heading;
    const normalizedDirection = ((direction + 360) % 360);
    rotation.value = withSpring(-normalizedDirection, {
      damping: 15,
      stiffness: 100,
    });
  }, [heading, qiblaDirection]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const getDirectionText = () => {
    const direction = (qiblaDirection - heading + 360) % 360;
    if (direction < 10 || direction > 350) {
      return 'Facing Qibla';
    } else if (direction < 180) {
      return 'Turn Right';
    } else {
      return 'Turn Left';
    }
  };

  const getDistanceToKaaba = () => {
    if (!location) return 0;

    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const R = 6371;
    const dLat = ((kaabaLat - location.coords.latitude) * Math.PI) / 180;
    const dLon = ((kaabaLon - location.coords.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.coords.latitude * Math.PI) / 180) *
        Math.cos((kaabaLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing compass...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Direction to Kaaba</Text>
          <Text style={styles.infoValue}>{Math.round(qiblaDirection)}°</Text>
          <Text style={styles.infoDistance}>
            Distance: {getDistanceToKaaba()} km
          </Text>
        </View>

        <View style={styles.compassContainer}>
          <View style={styles.compassCircle}>
            <View style={styles.compassCenter}>
              <Text style={styles.compassCenterText}>N</Text>
            </View>

            <Animated.View style={[styles.arrowContainer, animatedStyle]}>
              <View style={styles.arrow} />
              <Navigation size={80} color="#047857" strokeWidth={3} />
            </Animated.View>
          </View>
        </View>

        <View style={styles.directionCard}>
          <Text style={styles.directionLabel}>Direction</Text>
          <Text style={styles.directionText}>{getDirectionText()}</Text>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to use:</Text>
          <Text style={styles.instructionText}>
            • Hold your device flat{'\n'}
            • Rotate your body until the arrow points upward{'\n'}
            • The green arrow points to Kaaba in Makkah{'\n'}
            • Ensure you're away from magnetic interference
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
  },
  content: {
    backgroundColor: '#F9FAFB',
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#047857',
  },
  infoDistance: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  compassCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  compassCenter: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassCenterText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
  },
  directionCard: {
    backgroundColor: '#047857',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  directionLabel: {
    fontSize: 14,
    color: '#D1FAE5',
    marginBottom: 8,
  },
  directionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
