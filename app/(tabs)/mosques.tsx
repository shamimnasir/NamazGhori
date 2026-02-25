import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { MapPin, Plus, Trash2, Navigation2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import * as Device from 'expo-device';
import Header from '@/components/Header';

interface Mosque {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export default function MosquesScreen() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMosque, setNewMosque] = useState({
    name: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
    loadMosques();
  }, []);

  const initializeLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        setLocation({
          coords: {
            latitude: 23.8103,
            longitude: 90.4125,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  const loadMosques = async () => {
    try {
      const deviceId = Device.modelName || 'unknown-device';
      const { data, error } = await supabase
        .from('favorite_mosques')
        .select('*')
        .eq('user_id', deviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMosques(
          data.map((m) => ({
            id: m.id,
            name: m.name,
            address: m.address || '',
            latitude: parseFloat(m.latitude),
            longitude: parseFloat(m.longitude),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading mosques:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const getMosquesWithDistance = () => {
    if (!location) return mosques;

    return mosques.map((mosque) => ({
      ...mosque,
      distance: calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        mosque.latitude,
        mosque.longitude
      ),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const handleAddMosque = async () => {
    if (!newMosque.name.trim()) {
      Alert.alert('Error', 'Please enter mosque name');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location is required to add a mosque');
      return;
    }

    try {
      const deviceId = Device.modelName || 'unknown-device';
      const { error } = await supabase.from('favorite_mosques').insert({
        user_id: deviceId,
        name: newMosque.name,
        address: newMosque.address,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (error) throw error;

      setNewMosque({ name: '', address: '' });
      setShowAddForm(false);
      loadMosques();
      Alert.alert('Success', 'Mosque added successfully');
    } catch (error) {
      console.error('Error adding mosque:', error);
      Alert.alert('Error', 'Failed to add mosque');
    }
  };

  const handleDeleteMosque = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_mosques')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadMosques();
    } catch (error) {
      console.error('Error deleting mosque:', error);
      Alert.alert('Error', 'Failed to delete mosque');
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Mosque',
      `Are you sure you want to remove ${name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteMosque(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Favorite Mosque</Text>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Mosque</Text>
            <TextInput
              style={styles.input}
              placeholder="Mosque Name *"
              value={newMosque.name}
              onChangeText={(text) => setNewMosque({ ...newMosque, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address (optional)"
              value={newMosque.address}
              onChangeText={(text) => setNewMosque({ ...newMosque, address: text })}
            />
            <Text style={styles.formNote}>
              Location will be set to your current position
            </Text>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setNewMosque({ name: '', address: '' });
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMosque}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : mosques.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MapPin size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No mosques added yet</Text>
            <Text style={styles.emptySubtext}>
              Add your favorite mosques to easily find them
            </Text>
          </View>
        ) : (
          <View style={styles.mosquesList}>
            {getMosquesWithDistance().map((mosque) => (
              <View key={mosque.id} style={styles.mosqueCard}>
                <View style={styles.mosqueIcon}>
                  <MapPin size={24} color="#047857" />
                </View>
                <View style={styles.mosqueInfo}>
                  <Text style={styles.mosqueName}>{mosque.name}</Text>
                  {mosque.address ? (
                    <Text style={styles.mosqueAddress}>{mosque.address}</Text>
                  ) : null}
                  {mosque.distance !== undefined && (
                    <View style={styles.distanceContainer}>
                      <Navigation2 size={14} color="#6B7280" />
                      <Text style={styles.distanceText}>
                        {mosque.distance < 1
                          ? `${Math.round(mosque.distance * 1000)} meters away`
                          : `${mosque.distance.toFixed(1)} km away`}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(mosque.id, mosque.name)}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    backgroundColor: '#F9FAFB',
    flex: 1,
    padding: 16,
  },
  addButton: {
    backgroundColor: '#047857',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  formNote: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: 12,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#047857',
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  mosquesList: {
    paddingBottom: 16,
  },
  mosqueCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mosqueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mosqueInfo: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
});
