import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppButton,
  AppText,
  colors,
  layout,
  radii,
  spacing,
} from '@/design-system';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const today = new Date();
const earliestYear = today.getFullYear() - 100;

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayDate(value: string) {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Choose your date of birth';
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function DateOfBirthPicker({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const fallback = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [visibleMonth, setVisibleMonth] = useState(parseDate(value) ?? fallback);
  const [choosingYear, setChoosingYear] = useState(false);
  const [yearPage, setYearPage] = useState(
    Math.floor((visibleMonth.getFullYear() - earliestYear) / 12) * 12 + earliestYear,
  );

  const show = () => {
    const selected = parseDate(value) ?? fallback;
    setDraft(value);
    setVisibleMonth(selected);
    setYearPage(
      Math.floor((selected.getFullYear() - earliestYear) / 12) * 12 + earliestYear,
    );
    setChoosingYear(false);
    setOpen(true);
  };

  const chooseYear = (year: number) => {
    const month = visibleMonth.getMonth();
    const day = Math.min(visibleMonth.getDate(), daysInMonth(year, month));
    setVisibleMonth(new Date(year, month, day));
    setChoosingYear(false);
  };

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const calendarDays = Array.from(
    { length: 42 },
    (_, index) => {
      const day = index - monthStart.getDay() + 1;
      return day >= 1 && day <= daysInMonth(monthStart.getFullYear(), monthStart.getMonth())
        ? day
        : null;
    },
  );
  const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  const nextMonthIsFuture = nextMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <View style={styles.field}>
      <AppText variant="label">Date of birth</AppText>
      <Pressable
        accessibilityHint="Opens a calendar"
        accessibilityLabel={`Date of birth, ${displayDate(value)}`}
        accessibilityRole="button"
        onPress={show}
        style={({ pressed }) => [styles.input, pressed && styles.inputPressed]}>
        <Ionicons color={colors.primary} name="calendar-outline" size={20} />
        <AppText color={value ? colors.text : colors.textMuted} style={styles.inputCopy}>
          {displayDate(value)}
        </AppText>
        <Ionicons color={colors.textMuted} name="chevron-down" size={18} />
      </Pressable>
      <View style={styles.privacyNote}>
        <Ionicons color={colors.primary} name="shield-checkmark-outline" size={18} />
        <AppText color={colors.textMuted} style={styles.privacyCopy} variant="caption">
          Your date of birth stays private. Other people will only see your age.
        </AppText>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
        transparent
        visible={open}>
        <View style={styles.sheetRoot}>
          <Pressable
            accessibilityLabel="Close date picker"
            onPress={() => setOpen(false)}
            style={styles.backdrop}
          />
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitle}>
                <AppText variant="heading">Your date of birth</AppText>
                <AppText color={colors.textMuted} variant="caption">
                  Only your calculated age appears on your profile.
                </AppText>
              </View>
              <Pressable
                accessibilityLabel="Close"
                accessibilityRole="button"
                onPress={() => setOpen(false)}
                style={styles.closeButton}>
                <Ionicons color={colors.textMuted} name="close" size={22} />
              </Pressable>
            </View>

            {choosingYear ? (
              <View style={styles.yearPicker}>
                <View style={styles.calendarHeader}>
                  <Pressable
                    accessibilityLabel="Previous years"
                    disabled={yearPage <= earliestYear}
                    onPress={() => setYearPage(current => Math.max(earliestYear, current - 12))}
                    style={styles.iconButton}>
                    <Ionicons color={colors.primary} name="chevron-back" size={20} />
                  </Pressable>
                  <AppText variant="bodyStrong">{yearPage}–{Math.min(yearPage + 11, today.getFullYear())}</AppText>
                  <Pressable
                    accessibilityLabel="Next years"
                    disabled={yearPage + 12 > today.getFullYear()}
                    onPress={() => setYearPage(current => current + 12)}
                    style={styles.iconButton}>
                    <Ionicons color={yearPage + 12 > today.getFullYear() ? colors.border : colors.primary} name="chevron-forward" size={20} />
                  </Pressable>
                </View>
                <View style={styles.years}>
                  {Array.from({ length: 12 }, (_, index) => yearPage + index).map(year => {
                    const unavailable = year > today.getFullYear();
                    const selected = year === visibleMonth.getFullYear();
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected, disabled: unavailable }}
                        disabled={unavailable}
                        key={year}
                        onPress={() => chooseYear(year)}
                        style={[styles.year, selected && styles.selectedDay]}>
                        <AppText color={selected ? colors.surfaceRaised : unavailable ? colors.border : colors.text} variant="label">{year}</AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.calendar}>
                <View style={styles.calendarHeader}>
                  <Pressable
                    accessibilityLabel="Previous month"
                    onPress={() => setVisibleMonth(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
                    style={styles.iconButton}>
                    <Ionicons color={colors.primary} name="chevron-back" size={20} />
                  </Pressable>
                  <Pressable
                    accessibilityHint="Opens year selection"
                    accessibilityRole="button"
                    onPress={() => setChoosingYear(true)}
                    style={styles.monthButton}>
                    <AppText color={colors.primary} variant="bodyStrong">
                      {monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </AppText>
                    <Ionicons color={colors.primary} name="chevron-down" size={16} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Next month"
                    disabled={nextMonthIsFuture}
                    onPress={() => setVisibleMonth(nextMonth)}
                    style={styles.iconButton}>
                    <Ionicons color={nextMonthIsFuture ? colors.border : colors.primary} name="chevron-forward" size={20} />
                  </Pressable>
                </View>
                <View style={styles.weekdays}>
                  {weekdays.map((weekday, index) => (
                    <AppText color={colors.textMuted} key={`${weekday}-${index}`} style={styles.weekday} variant="caption">{weekday}</AppText>
                  ))}
                </View>
                <View style={styles.days}>
                  {calendarDays.map((day, index) => {
                    if (!day) return <View key={`empty-${index}`} style={styles.day} />;
                    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
                    const unavailable = date > today;
                    const selected = draft === toDateValue(date);
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected, disabled: unavailable }}
                        disabled={unavailable}
                        key={toDateValue(date)}
                        onPress={() => setDraft(toDateValue(date))}
                        style={[styles.day, selected && styles.selectedDay]}>
                        <AppText color={selected ? colors.surfaceRaised : unavailable ? colors.border : colors.text} variant="label">{day}</AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <AppButton
              disabled={!draft}
              fullWidth
              label="Use this date"
              onPress={() => {
                onChange(draft);
                setOpen(false);
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  input: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, paddingHorizontal: spacing.md },
  inputPressed: { borderColor: colors.primary },
  inputCopy: { flex: 1 },
  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, paddingHorizontal: spacing.xs },
  privacyCopy: { flex: 1 },
  sheetRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  sheet: { gap: spacing.lg, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.surfaceRaised, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  handle: { width: 40, height: 4, alignSelf: 'center', borderRadius: radii.pill, backgroundColor: colors.border },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  sheetTitle: { flex: 1, gap: spacing.xxs },
  closeButton: { width: layout.minimumTouchTarget, height: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surface },
  calendar: { gap: spacing.sm },
  calendarHeader: { minHeight: layout.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: layout.minimumTouchTarget, height: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center' },
  monthButton: { minHeight: layout.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, paddingHorizontal: spacing.sm },
  weekdays: { flexDirection: 'row' },
  weekday: { width: '14.285%', textAlign: 'center' },
  days: { flexDirection: 'row', flexWrap: 'wrap' },
  day: { width: '14.285%', minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill },
  selectedDay: { backgroundColor: colors.primary },
  yearPicker: { gap: spacing.sm },
  years: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  year: { width: '23%', minHeight: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surface },
});
