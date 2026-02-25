# Google Play Store Deployment Guide

This guide provides step-by-step instructions for deploying নামাজঘড়ি (Namaz Ghori) to Google Play Store.

## Prerequisites

1. Google Play Developer Account ($25 one-time fee)
2. EAS CLI installed (`npm install -g eas-cli`)
3. Expo account (free at expo.dev)

## Step 1: Prepare Your Environment

### 1.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 1.2 Login to Expo

```bash
eas login
```

### 1.3 Configure EAS Build

```bash
eas build:configure
```

This creates `eas.json` with build profiles.

## Step 2: Generate Signing Keys

### 2.1 Generate Keystore (Automatic)

EAS can generate and manage your keystore automatically:

```bash
eas credentials
```

Select:
1. Android
2. Production
3. Set up a new keystore

EAS will generate and securely store your keystore.

### 2.2 Alternative: Use Existing Keystore

If you have an existing keystore:

```bash
eas credentials
```

Then select "Use an existing keystore" and provide:
- Keystore file path
- Keystore password
- Key alias
- Key password

## Step 3: Build for Production

### 3.1 Build AAB (Android App Bundle)

```bash
eas build --platform android --profile production
```

This creates an `.aab` file optimized for Google Play Store.

### 3.2 Monitor Build Progress

- Check build status at: https://expo.dev/accounts/[your-account]/projects/namazghori/builds
- Build typically takes 10-20 minutes
- You'll receive an email when complete

### 3.3 Download AAB File

Once complete, download the `.aab` file from the EAS dashboard.

## Step 4: Prepare Store Listing Assets

### 4.1 Create Required Graphics

#### App Icon
- Size: 512x512 pixels
- Format: PNG
- Must be square with no transparency
- Should represent Islamic prayer/mosque theme

#### Feature Graphic
- Size: 1024x500 pixels
- Format: PNG or JPG
- Showcases app's main features
- No text should be cut off

#### Screenshots (Minimum 2, Recommended 8)
- Portrait: 1080x1920 pixels or higher
- Landscape: 1920x1080 pixels or higher
- Show all 5 main features:
  1. Prayer Times screen
  2. Qibla Finder
  3. Mosques list
  4. Islamic Calendar
  5. Tasbih Counter

### 4.2 Prepare Store Listing Text

#### Short Description (80 characters max)
```
Accurate prayer times, Qibla direction, and Islamic calendar for Bangladesh
```

#### Full Description (4000 characters max)
```
নামাজঘড়ি (Namaz Ghori) - Your Complete Islamic Companion

Are you looking for accurate prayer times based on your location in Bangladesh? Need to find the Qibla direction for your prayers? Want to keep track of Islamic dates and dhikr? Look no further!

FEATURES:

🕌 ACCURATE PRAYER TIMES (নামাজের সময়সূচী)
• Automatic location-based prayer time calculations
• Uses Karachi method with Hanafi madhab
• Displays current and next prayer
• Shows both Gregorian and Hijri dates
• Complete Bangla translation

🧭 QIBLA DIRECTION (কিবলার দিক)
• Real-time compass pointing to Kaaba
• Shows exact direction and distance to Makkah
• Easy-to-use visual indicators
• Works offline after initial setup

🕋 NEARBY MOSQUES FINDER (কাছাকাছি মসজিদ)
• Save your favorite mosques
• Automatic distance calculation
• Add mosque locations with addresses
• Sort by proximity

📅 ISLAMIC CALENDAR (ইসলামিক ক্যালেন্ডার)
• Hijri date conversion
• Important Islamic dates and events
• Complete list of Islamic months in Bangla
• Ramadan, Eid, and other important dates

📿 TASBIH COUNTER (তাসবীহ কাউন্টার)
• Digital tasbih counter with haptic feedback
• Multiple target counts (33, 99, 100, 500, 1000)
• Track completed sets
• Common dhikr list with Bangla translations
• Your progress is automatically saved

WHY CHOOSE নামাজঘড়ি?

✓ 100% Free with no ads
✓ Works offline (after initial setup)
✓ Accurate location-based calculations
✓ Complete Bangla language support
✓ Clean and easy-to-use interface
✓ No unnecessary permissions
✓ Regular updates and improvements

PERMISSIONS:

• Location: Required for accurate prayer times and Qibla direction
• Vibration: Used for tasbih counter feedback
• Internet: For syncing your preferences (works offline too)

ABOUT:

নামাজঘড়ি (Namaz Ghori) is designed specifically for Muslims in Bangladesh and worldwide who want accurate Islamic prayer times and a reliable Qibla direction finder. The app calculates prayer times based on your exact location using the Karachi calculation method, which is widely accepted in Bangladesh.

Whether you're at home, traveling, or anywhere in the world, নামাজঘড়ি ensures you never miss a prayer. The app combines traditional Islamic practices with modern technology to provide you with the most accurate and reliable prayer times.

SUPPORT:

We're constantly working to improve the app. If you have any suggestions or encounter any issues, please contact us.

May Allah accept your prayers and ibadah. JazakAllah Khair!
```

### 4.3 Create Privacy Policy

Host a privacy policy on your website or GitHub Pages. Example content:

```
Privacy Policy for নামাজঘড়ি (Namaz Ghori)

Last updated: [Date]

This app collects the following data:

1. LOCATION DATA
   - Used for calculating accurate prayer times
   - Used for determining Qibla direction
   - Never shared with third parties
   - Stored locally and in secure database

2. DEVICE IDENTIFIER
   - Used for storing user preferences
   - Not linked to personal information
   - Not shared with third parties

3. USER-GENERATED CONTENT
   - Favorite mosque locations you add
   - Tasbih counter progress
   - Stored securely with Row Level Security

4. NO TRACKING
   - We don't use analytics
   - We don't use advertising
   - We don't sell your data

For questions, contact: [your-email@example.com]
```

## Step 5: Create Google Play Console App

### 5.1 Access Google Play Console

1. Go to: https://play.google.com/console
2. Sign in with your Google Play Developer account
3. Click "Create app"

### 5.2 Fill Out App Details

#### Basic Information
- **App name**: নামাজঘড়ি (Namaz Ghori)
- **Default language**: English (UK)
- **App or game**: App
- **Free or paid**: Free

#### Category & Tags
- **Category**: Lifestyle
- **Tags**: Religion, Islamic, Prayer, Qibla, Muslim

#### Contact Details
- **Email**: Your support email
- **Phone**: Optional
- **Website**: Optional

### 5.3 Set Up Store Listing

Navigate to "Store presence" → "Main store listing"

1. Upload all graphics:
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (at least 2)

2. Fill in descriptions (prepared in Step 4.2)

3. Categorization:
   - **App category**: Lifestyle
   - **Content rating**: Complete questionnaire (select "Everyone")

### 5.4 Privacy Policy

1. Add privacy policy URL
2. Declare data collection and usage
3. Complete Data safety form:
   - Location: Collected, Required, For app functionality
   - App activity: Collected, Optional, For personalization

## Step 6: Configure App Content

### 6.1 Content Rating

1. Go to "Policy" → "App content" → "Content rating"
2. Start questionnaire
3. Answer questions honestly:
   - Religious reference: Yes (Islamic content)
   - Violence: No
   - Controlled substances: No
   - Sexual content: No
   - Language: No
   - Discrimination: No
4. Submit for rating

### 6.2 Target Audience

1. Select age groups: 13+
2. Target audience: Primarily adults
3. Not a child-directed app

### 6.3 News App Declaration

- Select "No" (this is not a news app)

### 6.4 COVID-19 Contact Tracing

- Select "No"

### 6.5 Data Safety

Complete data safety section:
1. Data collection: Yes
   - Location (Approximate, Precise)
   - App interactions (App interactions)

2. Data usage:
   - App functionality
   - Personalization

3. Data sharing: No data shared with third parties

4. Security practices:
   - Data encrypted in transit
   - User can request data deletion
   - Committed to Google Play Families Policy

## Step 7: Upload AAB and Release

### 7.1 Create a Production Release

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your `.aab` file
4. Fill in release notes:

```
Initial release of নামাজঘড়ি (Namaz Ghori)

Features:
• Accurate prayer times based on your location
• Qibla direction finder with compass
• Save and find nearby mosques
• Islamic calendar with Hijri dates
• Tasbih counter with multiple targets
• Complete Bangla language support

Version 1.0.0 - December 2025
```

### 7.2 Review Release

1. Review all warnings and errors
2. Fix any issues flagged by Play Console
3. Ensure all required sections are complete:
   - ✓ Store listing
   - ✓ Content rating
   - ✓ Target audience
   - ✓ Privacy policy
   - ✓ Data safety
   - ✓ App category

### 7.3 Roll Out Release

1. Choose rollout percentage:
   - Start with 20% for testing
   - Gradually increase to 100%
   - Or go directly to 100% if confident

2. Click "Review release"
3. Click "Start rollout to Production"

## Step 8: Post-Submission

### 8.1 Review Process

- Google typically reviews within 2-7 days
- You'll receive email updates
- Check Play Console for status

### 8.2 If Rejected

- Read rejection reason carefully
- Fix issues mentioned
- Resubmit with explanations

### 8.3 After Approval

- App will be live on Play Store
- Monitor reviews and ratings
- Respond to user feedback
- Plan regular updates

## Step 9: Ongoing Maintenance

### 9.1 Version Updates

When updating:

```bash
# Update version in app.json
# Then build new version
eas build --platform android --profile production
```

### 9.2 Monitor Metrics

Track in Play Console:
- Installation numbers
- User ratings and reviews
- Crash reports
- User feedback

### 9.3 Respond to Reviews

- Reply to user reviews promptly
- Thank users for positive feedback
- Address issues mentioned in negative reviews
- Show you're actively maintaining the app

## Troubleshooting Common Issues

### Issue: Build Failed

**Solution**: Check build logs in EAS dashboard
- Often due to dependency conflicts
- Check if all required packages are installed
- Verify app.json configuration

### Issue: Signing Key Error

**Solution**: Regenerate or fix keystore
```bash
eas credentials
```

### Issue: Store Listing Rejected

**Solution**: Common reasons:
- Missing or incorrect screenshots
- Privacy policy not accessible
- Inappropriate content
- Insufficient description

### Issue: App Crashes on Real Device

**Solution**:
- Test on multiple Android versions
- Check permission handling
- Review crash reports in Play Console

## Best Practices

1. **Test Thoroughly**: Test on multiple devices and Android versions
2. **Monitor Feedback**: Regularly check reviews and respond
3. **Regular Updates**: Release updates every 1-2 months
4. **Clear Communication**: Be transparent in release notes
5. **User Support**: Provide easy way for users to contact you
6. **Performance**: Monitor app size and performance metrics
7. **Compliance**: Stay updated with Play Store policies

## Useful Resources

- **Google Play Console**: https://play.google.com/console
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **Android App Bundle**: https://developer.android.com/guide/app-bundle
- **Play Store Policies**: https://play.google.com/about/developer-content-policy/

## Support

If you encounter issues during deployment:
1. Check Expo forums: https://forums.expo.dev
2. Review Google Play Help Center
3. Contact Expo support for build issues
4. Contact Google Play support for store issues

---

Good luck with your app deployment! May it benefit the Muslim community worldwide. 🕌
