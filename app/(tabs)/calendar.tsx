import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import Header from '@/components/Header';

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

interface ImportantDate {
  hijriDate: string;
  event: string;
  bengaliName: string;
}

export default function CalendarScreen() {
  const [gregorianDate, setGregorianDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);

  const hijriMonths = [
    { en: 'Muharram', bn: 'মুহাররম' },
    { en: 'Safar', bn: 'সফর' },
    { en: 'Rabi al-Awwal', bn: 'রবিউল আউয়াল' },
    { en: 'Rabi al-Thani', bn: 'রবিউস সানি' },
    { en: 'Jumada al-Awwal', bn: 'জমাদিউল আউয়াল' },
    { en: 'Jumada al-Thani', bn: 'জমাদিউস সানি' },
    { en: 'Rajab', bn: 'রজব' },
    { en: 'Shaban', bn: 'শাবান' },
    { en: 'Ramadan', bn: 'রমজান' },
    { en: 'Shawwal', bn: 'শাওয়াল' },
    { en: 'Dhul Qadah', bn: 'জিলকদ' },
    { en: 'Dhul Hijjah', bn: 'জিলহজ' },
  ];

  const importantDates: ImportantDate[] = [
    { hijriDate: '1 Muharram', event: 'Islamic New Year', bengaliName: 'ইসলামিক নববর্ষ' },
    { hijriDate: '10 Muharram', event: 'Day of Ashura', bengaliName: 'আশুরা' },
    { hijriDate: '12 Rabi al-Awwal', event: 'Mawlid al-Nabi', bengaliName: 'ঈদ-এ-মিলাদুন্নবী' },
    { hijriDate: '27 Rajab', event: 'Isra and Miraj', bengaliName: 'শবে মিরাজ' },
    { hijriDate: '15 Shaban', event: 'Shab-e-Barat', bengaliName: 'শবে বরাত' },
    { hijriDate: '1-30 Ramadan', event: 'Month of Ramadan', bengaliName: 'রমজান মাস' },
    { hijriDate: '27 Ramadan', event: 'Laylat al-Qadr', bengaliName: 'শবে কদর' },
    { hijriDate: '1 Shawwal', event: 'Eid al-Fitr', bengaliName: 'ঈদুল ফিতর' },
    { hijriDate: '8-10 Dhul Hijjah', event: 'Hajj Days', bengaliName: 'হজের দিনসমূহ' },
    { hijriDate: '9 Dhul Hijjah', event: 'Day of Arafah', bengaliName: 'আরাফার দিন' },
    { hijriDate: '10 Dhul Hijjah', event: 'Eid al-Adha', bengaliName: 'ঈদুল আযহা' },
  ];

  useEffect(() => {
    convertToHijri(gregorianDate);
  }, [gregorianDate]);

  const convertToHijri = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '0');
    const monthName = parts.find((p) => p.type === 'month')?.value || '';
    const year = parseInt(parts.find((p) => p.type === 'year')?.value || '0');

    const monthIndex = hijriMonths.findIndex((m) => m.en === monthName);

    setHijriDate({
      day,
      month: monthIndex + 1,
      year,
      monthName,
    });
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(gregorianDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setGregorianDate(newDate);
  };

  const getGregorianMonthName = () => {
    return gregorianDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getBengaliMonthName = () => {
    if (!hijriDate) return '';
    const monthIndex = hijriDate.month - 1;
    return hijriMonths[monthIndex]?.bn || '';
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
        <View style={styles.dateCard}>
          <View style={styles.dateNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => changeMonth(-1)}>
              <ChevronLeft size={24} color="#047857" />
            </TouchableOpacity>
            <View style={styles.dateDisplay}>
              <CalendarIcon size={24} color="#047857" />
              <Text style={styles.dateText}>{getGregorianMonthName()}</Text>
            </View>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => changeMonth(1)}>
              <ChevronRight size={24} color="#047857" />
            </TouchableOpacity>
          </View>
        </View>

        {hijriDate && (
          <View style={styles.hijriCard}>
            <Text style={styles.hijriLabel}>Current Hijri Date</Text>
            <Text style={styles.hijriDate}>
              {hijriDate.day} {hijriDate.monthName} {hijriDate.year}
            </Text>
            <Text style={styles.hijriBengali}>
              {hijriDate.day} {getBengaliMonthName()} {hijriDate.year}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Islamic Dates</Text>
          <Text style={styles.sectionSubtitle}>গুরুত্বপূর্ণ ইসলামিক তারিখসমূহ</Text>
        </View>

        <View style={styles.eventsList}>
          {importantDates.map((date, index) => (
            <View key={index} style={styles.eventCard}>
              <View style={styles.eventIconContainer}>
                <CalendarIcon size={20} color="#047857" />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{date.event}</Text>
                <Text style={styles.eventBengaliName}>{date.bengaliName}</Text>
                <Text style={styles.eventDate}>{date.hijriDate}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About the Islamic Calendar</Text>
          <Text style={styles.infoText}>
            The Islamic calendar, also known as the Hijri calendar, is a lunar calendar consisting of 12 months in a year of 354 or 355 days. It is used to determine the proper days of Islamic holidays and rituals.
          </Text>
          <Text style={styles.infoText}>
            ইসলামিক ক্যালেন্ডার, যা হিজরি ক্যালেন্ডার নামেও পরিচিত, একটি চন্দ্র ক্যালেন্ডার যা ৩৫৪ বা ৩৫৫ দিনের ১২ মাস নিয়ে গঠিত। এটি ইসলামিক উৎসব এবং আচার-অনুষ্ঠানের সঠিক দিন নির্ধারণে ব্যবহৃত হয়।
          </Text>
        </View>

        <View style={styles.monthsSection}>
          <Text style={styles.sectionTitle}>Islamic Months</Text>
          <Text style={styles.sectionSubtitle}>ইসলামিক মাসসমূহ</Text>
          <View style={styles.monthsGrid}>
            {hijriMonths.map((month, index) => (
              <View
                key={index}
                style={[
                  styles.monthCard,
                  hijriDate?.month === index + 1 && styles.currentMonthCard,
                ]}>
                <Text
                  style={[
                    styles.monthNumber,
                    hijriDate?.month === index + 1 && styles.currentMonthText,
                  ]}>
                  {index + 1}
                </Text>
                <Text
                  style={[
                    styles.monthName,
                    hijriDate?.month === index + 1 && styles.currentMonthText,
                  ]}>
                  {month.en}
                </Text>
                <Text
                  style={[
                    styles.monthBengaliName,
                    hijriDate?.month === index + 1 && styles.currentMonthText,
                  ]}>
                  {month.bn}
                </Text>
              </View>
            ))}
          </View>
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
  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  hijriCard: {
    backgroundColor: '#047857',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  hijriLabel: {
    fontSize: 14,
    color: '#D1FAE5',
    marginBottom: 8,
  },
  hijriDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  hijriBengali: {
    fontSize: 18,
    color: '#D1FAE5',
  },
  section: {
    marginBottom: 16,
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
  },
  eventsList: {
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  eventBengaliName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '600',
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
  monthsSection: {
    marginBottom: 24,
  },
  monthsGrid: {
    marginTop: 16,
  },
  monthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentMonthCard: {
    backgroundColor: '#047857',
  },
  monthNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
    marginRight: 16,
    width: 30,
  },
  monthName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  monthBengaliName: {
    fontSize: 14,
    color: '#6B7280',
  },
  currentMonthText: {
    color: '#FFFFFF',
  },
});
