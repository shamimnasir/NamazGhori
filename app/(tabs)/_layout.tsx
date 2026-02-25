import { Tabs } from 'expo-router';
import { Clock, Compass, MapPin, Calendar, Circle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#047857',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prayer Times',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: 'Qibla',
          tabBarIcon: ({ size, color }) => (
            <Compass size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mosques"
        options={{
          title: 'Mosques',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasbih"
        options={{
          title: 'Tasbih',
          tabBarIcon: ({ size, color }) => (
            <Circle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
