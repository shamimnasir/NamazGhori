import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Madhab } from 'adhan';
import { MapPin, AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import * as Device from 'expo-device';
import Header from '@/components/Header';

interface PrayerTimeData {
  name: string;
  time: string;
  arabicName: string;
}

export default function PrayerTimesScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        const dhaka: Coordinates = new Coordinates(23.8103, 90.4125);
        calculatePrayerTimes(dhaka, 'Dhaka, Bangladesh');
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required for accurate prayer times');
        setLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);

      const address = await Location.reverseGeocodeAsync({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      const locationString = address[0]
        ? `${address[0].city || address[0].district || ''}, ${address[0].country || ''}`
        : 'Current Location';

      setLocationName(locationString);

      const coords = new Coordinates(
        locationData.coords.latitude,
        locationData.coords.longitude
      );

      calculatePrayerTimes(coords, locationString);
      await saveUserPreferences(locationData.coords.latitude, locationData.coords.longitude, locationString);

      setLoading(false);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Unable to get location. Please check your settings.');
      setLoading(false);
    }
  };

  const saveUserPreferences = async (lat: number, lon: number, name: string) => {
    try {
      const deviceId = Device.modelName || 'unknown-device';

      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', deviceId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_preferences')
          .update({
            location_latitude: lat,
            location_longitude: lon,
            location_name: name,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', deviceId);
      } else {
        await supabase
          .from('user_preferences')
          .insert({
            user_id: deviceId,
            location_latitude: lat,
            location_longitude: lon,
            location_name: name,
          });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const calculatePrayerTimes = (coords: Coordinates, locName: string) => {
    const date = new Date();
    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;
    params.adjustments.fajr = 0;
    params.adjustments.dhuhr = 0;
    params.adjustments.asr = 0;
    params.adjustments.maghrib = 0;
    params.adjustments.isha = 0;

    const times = new PrayerTimes(coords, date, params);

    const prayers: PrayerTimeData[] = [
      {
        name: 'Fajr',
        arabicName: 'ফজর',
        time: formatTime(times.fajr),
      },
      {
        name: 'Sunrise',
        arabicName: 'সূর্যোদয়',
        time: formatTime(times.sunrise),
      },
      {
        name: 'Dhuhr',
        arabicName: 'যোহর',
        time: formatTime(times.dhuhr),
      },
      {
        name: 'Asr',
        arabicName: 'আসর',
        time: formatTime(times.asr),
      },
      {
        name: 'Maghrib',
        arabicName: 'মাগরিব',
        time: formatTime(times.maghrib),
      },
      {
        name: 'Isha',
        arabicName: 'ইশা',
        time: formatTime(times.isha),
      },
    ];

    setPrayerTimes(prayers);

    const current = times.currentPrayer();
    const next = times.nextPrayer();

    const prayerNames: { [key: string]: string } = {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      none: 'None',
    };

    setCurrentPrayer(prayerNames[current] || 'None');
    setNextPrayer(prayerNames[next] || 'None');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCurrentHijriDate = () => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(today);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading prayer times...</Text>
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
      <ScrollView style={styles.scrollContent}>

      <View style={styles.locationCard}>
        <MapPin size={20} color="#047857" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationText}>{locationName || 'Dhaka, Bangladesh'}</Text>
          <Text style={styles.hijriDate}>{getCurrentHijriDate()}</Text>
        </View>
      </View>

      {currentPrayer !== 'None' && (
        <View style={styles.currentPrayerCard}>
          <Text style={styles.currentPrayerLabel}>Current Prayer</Text>
          <Text style={styles.currentPrayerName}>{currentPrayer}</Text>
          {nextPrayer !== 'None' && (
            <Text style={styles.nextPrayerText}>Next: {nextPrayer}</Text>
          )}
        </View>
      )}

      <View style={styles.prayerTimesContainer}>
        {prayerTimes.map((prayer, index) => (
          <View
            key={index}
            style={[
              styles.prayerCard,
              currentPrayer === prayer.name && styles.activePrayerCard,
            ]}>
            <View style={styles.prayerInfo}>
              <Text
                style={[
                  styles.prayerName,
                  currentPrayer === prayer.name && styles.activePrayerText,
                ]}>
                {prayer.name}
              </Text>
              <Text
                style={[
                  styles.prayerArabicName,
                  currentPrayer === prayer.name && styles.activePrayerText,
                ]}>
                {prayer.arabicName}
              </Text>
            </View>
            <Text
              style={[
                styles.prayerTime,
                currentPrayer === prayer.name && styles.activePrayerText,
              ]}>
              {prayer.time}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Calculation Method: University of Islamic Sciences, Karachi
        </Text>
        <Text style={styles.footerNote}>
          Fajr: 18° | Isha: 18° | Asr: Hanafi (Standard)
        </Text>
        <Text style={styles.footerNote}>
          Used by Baitul Mukarram & Islamic Foundation Bangladesh
        </Text>
        <Text style={styles.footerNote}>
          Times calculated based on your GPS location
        </Text>
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
  locationCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  hijriDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  currentPrayerCard: {
    backgroundColor: '#047857',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPrayerLabel: {
    fontSize: 14,
    color: '#D1FAE5',
    marginBottom: 8,
  },
  currentPrayerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextPrayerText: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 8,
  },
  prayerTimesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  prayerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePrayerCard: {
    backgroundColor: '#059669',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  prayerArabicName: {
    fontSize: 14,
    color: '#6B7280',
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#047857',
  },
  activePrayerText: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerNote: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
