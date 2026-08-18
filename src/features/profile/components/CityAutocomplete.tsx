import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, colors, layout, radii, shadows, spacing, typography } from '@/design-system';
import {
  cityAutocompleteIsConfigured,
  searchCities,
  type CityPrediction,
} from '@/features/profile/cityAutocompleteService';

function createSessionToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CityAutocomplete({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<CityPrediction[]>([]);
  const [selectedValue, setSelectedValue] = useState(value);
  const sessionToken = useRef('');
  const configured = cityAutocompleteIsConfigured();

  useEffect(() => {
    if (!configured || !focused || value.trim().length < 2 || value === selectedValue) {
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setLoading(true);
      searchCities(value.trim(), sessionToken.current, controller.signal)
        .then(results => {
          setPredictions(results);
          setRequestFailed(false);
        })
        .catch(error => {
          if (error instanceof Error && error.name === 'AbortError') return;
          setPredictions([]);
          setRequestFailed(true);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [configured, focused, selectedValue, value]);

  const choose = (prediction: CityPrediction) => {
    setSelectedValue(prediction.displayText);
    onChange(prediction.displayText);
    setPredictions([]);
    setFocused(false);
    sessionToken.current = '';
  };

  const menuVisible = focused && (loading || requestFailed || predictions.length > 0);

  return (
    <View style={[styles.field, menuVisible && styles.fieldRaised]}>
      <AppText variant="label">City</AppText>
      <View style={[styles.inputShell, focused && styles.inputShellFocused]}>
        <Ionicons color={colors.textMuted} name="location-outline" size={20} />
        <TextInput
          accessibilityLabel="City"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={text => {
            setSelectedValue('');
            setPredictions([]);
            setRequestFailed(false);
            onChange(text);
          }}
          onFocus={() => {
            if (!sessionToken.current) sessionToken.current = createSessionToken();
            setFocused(true);
          }}
          placeholder="Start typing a city"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={styles.input}
          value={value}
        />
        {loading ? <ActivityIndicator color={colors.primary} size="small" /> : null}
      </View>
      {menuVisible ? (
        <View style={styles.menu}>
          {predictions.map(prediction => (
            <Pressable
              accessibilityRole="button"
              key={prediction.id}
              onPressIn={() => choose(prediction)}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
              <Ionicons color={colors.primary} name="location-outline" size={19} />
              <View style={styles.optionCopy}>
                <AppText variant="bodyStrong">{prediction.city}</AppText>
                {prediction.context ? <AppText color={colors.textMuted} variant="caption">{prediction.context}</AppText> : null}
              </View>
            </Pressable>
          ))}
          {requestFailed ? (
            <View style={styles.errorState}>
              <Ionicons color={colors.warning} name="alert-circle-outline" size={19} />
              <AppText color={colors.textMuted} style={styles.optionCopy} variant="caption">
                City suggestions are unavailable. You can continue typing your city manually.
              </AppText>
            </View>
          ) : null}
          <AppText color={colors.textMuted} style={styles.attribution} variant="caption">Google Maps</AppText>
        </View>
      ) : null}
      {!configured ? <AppText color={colors.textMuted} variant="caption">Autocomplete is unavailable; you can still enter your city.</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { position: 'relative', gap: spacing.xs },
  fieldRaised: { zIndex: 20 },
  inputShell: { minHeight: layout.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, paddingHorizontal: spacing.md },
  inputShellFocused: { borderColor: colors.focus },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.sm, ...typography.body },
  menu: { position: 'absolute', zIndex: 30, top: 82, left: 0, right: 0, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, ...shadows.soft },
  option: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  optionPressed: { backgroundColor: colors.primarySoft },
  optionCopy: { flex: 1 },
  errorState: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  attribution: { alignSelf: 'flex-end', paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
});
