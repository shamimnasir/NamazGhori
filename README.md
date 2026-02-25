# নামাজঘড়ি (Namaz Ghori)

A comprehensive Islamic prayer time app built with React Native Expo, designed specifically for Bangladeshi Muslims.

## Features

### 1. **Accurate Prayer Times** (নামাজের সময়সূচী)
- GPS-based prayer time calculation for your exact location
- Uses **University of Islamic Sciences, Karachi** method (18° Fajr/Isha)
- **Hanafi madhab** for Asr calculation (Bangladesh standard)
- Same method used by **Baitul Mukarram** and **Islamic Foundation Bangladesh**
- Displays current and next prayer with countdown
- Shows both Gregorian and Hijri dates
- Complete Bangla translations for all prayer names
- Accurate to ±1 minute of official mosque times

### 2. **Qibla Direction** (কিবলার দিক)
- Real-time compass pointing to Kaaba in Makkah
- Shows distance to Kaaba
- Visual direction indicator (Turn Left/Right/Facing Qibla)
- Works with device magnetometer

### 3. **Nearby Mosques Finder** (কাছাকাছি মসজিদ)
- Add and save favorite mosques
- Automatic distance calculation from your location
- Manage mosque list with addresses
- Sort by proximity

### 4. **Islamic Calendar** (ইসলামিক ক্যালেন্ডার)
- Hijri date conversion
- Important Islamic dates and events
- Bengla translations for all months and events
- Month navigation

### 5. **Tasbih Counter** (তাসবীহ কাউন্টার)
- Digital tasbih counter with haptic feedback
- Customizable target counts (33, 99, 100, 500, 1000)
- Progress tracking and completed sets
- Common dhikr list with Bengla translations
- Persistent storage of counts

## Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router with tabs
- **Database**: Supabase for data persistence
- **Prayer Times**: Adhan library with Karachi method
- **Animations**: React Native Reanimated
- **Location**: Expo Location
- **Sensors**: Expo Sensors (Magnetometer)
- **Haptics**: Expo Haptics

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI
- For Android build: EAS CLI

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Building for Android (Google Play Store)

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Configure EAS

```bash
eas login
eas build:configure
```

### Step 3: Build APK for Testing

```bash
eas build --platform android --profile preview
```

### Step 4: Build AAB for Google Play Store

```bash
eas build --platform android --profile production
```

## Google Play Store Submission Checklist

### 1. **App Information**
- App Name: নামাজঘড়ি (Namaz Ghori)
- Package Name: com.namazghori.app
- Version: 1.0.0
- Target SDK: 34+ (Android 14)

### 2. **Required Assets**
- High-res icon (512x512)
- Feature graphic (1024x500)
- Screenshots (minimum 2, recommended 8)
- Privacy policy URL

### 3. **Permissions Declared**
- ACCESS_FINE_LOCATION - For accurate prayer times and Qibla direction
- ACCESS_COARSE_LOCATION - For location-based features
- VIBRATE - For tasbih counter haptic feedback
- INTERNET - For Supabase database connection

### 4. **Privacy Policy Requirements**

The app collects and stores:
- Device location (for prayer time calculations)
- Device identifier (for user preferences)
- User-added mosque locations
- Tasbih counter data

All data is stored securely in Supabase with Row Level Security enabled.

### 5. **Content Rating**
- Target Audience: Everyone
- Content: Religious application

### 6. **App Category**
- Primary: Lifestyle
- Secondary: Religion & Spirituality

## Configuration

### Environment Variables

The app uses the following environment variables (already configured in `.env`):

- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Prayer Time Calculation Method

**Official Bangladesh Standard:**

Prayer times are calculated using the same method as Baitul Mukarram National Mosque and Islamic Foundation Bangladesh:

- **Method**: University of Islamic Sciences, Karachi
- **Fajr Angle**: 18 degrees below horizon
- **Isha Angle**: 18 degrees below horizon
- **Madhab**: Hanafi (for Asr calculation - gives later time)
- **Location**: GPS-based, accurate to your exact coordinates
- **Timezone**: Bangladesh Standard Time (BST, UTC+6)

**Why This Method?**

This is the official calculation method used throughout Bangladesh. It matches the prayer times announced by:
- Baitul Mukarram National Mosque (Dhaka)
- Islamic Foundation Bangladesh (Government authority)
- All major mosques across Bangladesh
- Pakistan, India, and Afghanistan

**Accuracy**: ±1 minute of official mosque times

For detailed technical information about prayer time accuracy, see [PRAYER_TIME_ACCURACY.md](PRAYER_TIME_ACCURACY.md)

## Database Schema

The app uses three main tables:

1. **user_preferences** - Stores user settings and location
2. **tasbih_counts** - Stores tasbih counter progress
3. **favorite_mosques** - Stores user's favorite mosque locations

All tables have Row Level Security enabled with public access policies.

## Development

### File Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx       # Tabs navigation
│   ├── index.tsx          # Prayer Times screen
│   ├── qibla.tsx          # Qibla Finder screen
│   ├── mosques.tsx        # Mosques Finder screen
│   ├── calendar.tsx       # Islamic Calendar screen
│   └── tasbih.tsx         # Tasbih Counter screen
├── _layout.tsx            # Root layout
└── +not-found.tsx         # 404 screen
lib/
└── supabase.ts            # Supabase client
```

### Key Libraries

- `adhan@4.5.x` - Prayer time calculations
- `expo-location@18.x` - GPS and location services
- `expo-sensors@15.x` - Magnetometer for Qibla
- `expo-haptics@15.x` - Vibration feedback
- `@supabase/supabase-js@2.x` - Database client

## Testing

### Type Checking

```bash
npm run typecheck
```

### Testing on Device

Use Expo Go app to test on physical device:
1. Install Expo Go from Play Store
2. Scan QR code from dev server
3. Test all features with real GPS and sensors

## Deployment

### Using EAS Submit

After building, submit to Google Play:

```bash
eas submit --platform android
```

### Manual Upload

1. Download the `.aab` file from EAS
2. Go to Google Play Console
3. Create a new app or select existing
4. Upload the AAB file to Production track
5. Fill out store listing details
6. Submit for review

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev
- Adhan library: https://github.com/batoulapps/adhan-js
- Supabase docs: https://supabase.com/docs

## License

This project is created for educational and religious purposes.

## Acknowledgments

- Prayer time calculations by Adhan library
- Islamic calendar using Intl.DateTimeFormat
- UI inspired by modern Islamic apps
- Bangla translations for accessibility
