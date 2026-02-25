import { View, Text, StyleSheet, Image } from 'react-native';
import { Menu } from 'lucide-react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>NamazGhori</Text>
          <Text style={styles.subtitle}>নামাজঘড়ি</Text>
        </View>
      </View>
      <Menu size={24} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#047857',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#D1FAE5',
  },
});
