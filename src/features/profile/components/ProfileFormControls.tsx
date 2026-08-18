import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppText, colors, layout, radii, spacing, typography } from '@/design-system';

export function FormSection({
  title,
  description,
  visibility = 'Shown on your profile',
  children,
  initiallyOpen = false,
}: {
  title: string;
  description: string;
  visibility?: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(current => !current)}
        style={({ pressed }) => [styles.sectionHeader, pressed && styles.sectionHeaderPressed]}>
        <View style={styles.sectionCopy}>
          <AppText variant="heading">{title}</AppText>
          <AppText color={colors.textMuted} variant="caption">{description}</AppText>
        </View>
        <Ionicons
          color={colors.primary}
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
        />
      </Pressable>
      {open ? (
        <View style={styles.sectionBody}>
          <View style={styles.visibilityRow}>
            <Ionicons color={colors.textMuted} name="eye-outline" size={16} />
            <AppText color={colors.textMuted} variant="caption">{visibility}</AppText>
          </View>
          {children}
        </View>
      ) : null}
    </View>
  );
}

export function FormField({ label, hint, multiline, style, ...props }: TextInputProps & {
  label: string;
  hint?: string;
}) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      {hint ? <AppText color={colors.textMuted} variant="caption">{hint}</AppText> : null}
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        style={[styles.input, multiline && styles.multiline, style]}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
}

export function InlineAddField({
  value,
  onChangeText,
  onAdd,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  const disabled = !value.trim();
  return (
    <View style={styles.inlineInputShell}>
      <TextInput
        accessibilityLabel="Add an interest"
        onChangeText={onChangeText}
        onSubmitEditing={onAdd}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="done"
        selectionColor={colors.primary}
        style={styles.inlineInput}
        value={value}
      />
      <Pressable
        accessibilityLabel="Add interest"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onAdd}
        style={[styles.inlineAdd, disabled && styles.inlineAddDisabled]}>
        <Ionicons color={disabled ? colors.textMuted : colors.surfaceRaised} name="add" size={22} />
      </Pressable>
    </View>
  );
}

const commonLanguages = [
  'English',
  'Italian',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Arabic',
  'Mandarin Chinese',
  'Hindi',
] as const;

export function LanguagePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selected = value.split(',').map(language => language.trim()).filter(Boolean);
  const [customLanguage, setCustomLanguage] = useState('');

  const commit = (languages: string[]) => onChange(languages.join(', '));
  const toggle = (language: string) => commit(
    selected.includes(language)
      ? selected.filter(item => item !== language)
      : [...selected, language],
  );
  const addCustom = () => {
    const language = customLanguage.trim();
    if (!language || selected.some(item => item.toLocaleLowerCase() === language.toLocaleLowerCase())) return;
    commit([...selected, language]);
    setCustomLanguage('');
  };

  return (
    <View style={styles.field}>
      <AppText variant="label">Languages you’re comfortable using</AppText>
      <AppText color={colors.textMuted} variant="caption">Choose at least one. Add another language if it isn’t listed.</AppText>
      <View style={styles.choices}>
        {commonLanguages.map(language => {
          const isSelected = selected.includes(language);
          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              key={language}
              onPress={() => toggle(language)}
              style={[styles.choice, isSelected && styles.choiceSelected]}>
              {isSelected ? <Ionicons color={colors.primary} name="checkmark" size={16} /> : null}
              <AppText color={isSelected ? colors.primary : colors.text} variant="caption">{language}</AppText>
            </Pressable>
          );
        })}
        {selected.filter(language => !commonLanguages.includes(language as typeof commonLanguages[number])).map(language => (
          <Pressable
            accessibilityHint="Removes this language"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: true }}
            key={language}
            onPress={() => toggle(language)}
            style={[styles.choice, styles.choiceSelected]}>
            <Ionicons color={colors.primary} name="checkmark" size={16} />
            <AppText color={colors.primary} variant="caption">{language}</AppText>
          </Pressable>
        ))}
      </View>
      <InlineAddField onAdd={addCustom} onChangeText={setCustomLanguage} placeholder="Add another language" value={customLanguage} />
    </View>
  );
}

export function ChoiceGroup<T extends string>({
  label,
  hint,
  allowDeselect = false,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  allowDeselect?: boolean;
  options: readonly (readonly [T, string])[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      {hint ? <AppText color={colors.textMuted} variant="caption">{hint}</AppText> : null}
      <View accessibilityRole="radiogroup" style={styles.choices}>
        {options.map(([option, optionLabel]) => {
          const selected = value === option;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={option}
              onPress={() => onChange(selected && allowDeselect ? '' as T : option)}
              style={[styles.choice, selected && styles.choiceSelected]}>
              {selected ? <Ionicons color={colors.primary} name="checkmark" size={16} /> : null}
              <AppText color={selected ? colors.primary : colors.text} variant="caption">
                {optionLabel}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function MultiChoiceGroup<T extends string>({
  label,
  hint,
  options,
  values,
  onChange,
}: {
  label: string;
  hint?: string;
  options: readonly (readonly [T, string])[];
  values: readonly T[];
  onChange: (values: T[]) => void;
}) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      {hint ? <AppText color={colors.textMuted} variant="caption">{hint}</AppText> : null}
      <View style={styles.choices}>
        {options.map(([option, optionLabel]) => {
          const selected = values.includes(option);
          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              key={option}
              onPress={() => onChange(
                selected ? values.filter(item => item !== option) : [...values, option],
              )}
              style={[styles.choice, selected && styles.choiceSelected]}>
              {selected ? <Ionicons color={colors.primary} name="checkmark" size={16} /> : null}
              <AppText color={selected ? colors.primary : colors.text} variant="caption">
                {optionLabel}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ToggleRow({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText color={colors.textMuted} variant="caption">{description}</AppText>
      </View>
      <Switch
        accessibilityLabel={label}
        onValueChange={onChange}
        thumbColor={value ? colors.primary : colors.textMuted}
        trackColor={{ false: colors.surfaceMuted, true: colors.primarySoft }}
        value={value}
      />
    </View>
  );
}

const commonPronouns = ['she/her', 'he/him', 'they/them', 'she/they', 'he/they'] as const;
const alternativePronouns = ['any pronouns', 'use my name'] as const;
const pronounPresets = [...commonPronouns, ...alternativePronouns] as const;

function cleanPronounSide(value: string) {
  return value
    .replace(/[/\r\n\u0000-\u001F\u007F]/g, '')
    .toLocaleLowerCase()
    .slice(0, 20);
}

export function PronounPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const valueIsCommon = commonPronouns.includes(value as typeof commonPronouns[number]);
  const valueIsCustom = value.includes('/') && !valueIsCommon;
  const [initialFirst = '', initialSecond = ''] = valueIsCustom ? value.split('/') : [];
  const [customOpen, setCustomOpen] = useState(false);
  const [first, setFirst] = useState(initialFirst);
  const [second, setSecond] = useState(initialSecond);
  const cachedCustomPair = first.trim() && second.trim()
    ? `${first.trim()}/${second.trim()}`
    : '';

  const updateCustom = (nextFirst: string, nextSecond: string) => {
    setFirst(nextFirst);
    setSecond(nextSecond);
  };

  const selectPreset = (option: string) => {
    setCustomOpen(false);
    onChange(option);
  };

  const openCustom = () => {
    if (valueIsCustom) {
      const [savedFirst = '', savedSecond = ''] = value.split('/');
      setFirst(cleanPronounSide(savedFirst));
      setSecond(cleanPronounSide(savedSecond));
    }
    setCustomOpen(true);
  };

  const saveCustom = () => {
    const normalizedFirst = first.trim();
    const normalizedSecond = second.trim();
    if (!normalizedFirst || !normalizedSecond) return;
    onChange(`${normalizedFirst}/${normalizedSecond}`);
    setCustomOpen(false);
  };

  return (
    <View style={styles.field}>
      <AppText variant="label">Pronouns</AppText>
      <AppText color={colors.textMuted} variant="caption">Choose a common pair or build your own.</AppText>
      <AppText color={colors.textMuted} variant="label">Choices</AppText>
      <View style={styles.choices}>
        {pronounPresets.map(option => (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: value === option }}
            key={option}
            onPress={() => selectPreset(option)}
            style={[styles.choice, value === option && styles.choiceSelected]}>
            {value === option ? <Ionicons color={colors.primary} name="checkmark" size={16} /> : null}
            <AppText color={value === option ? colors.primary : colors.text} variant="caption">{option}</AppText>
          </Pressable>
        ))}
        {cachedCustomPair ? (
          <Pressable
            accessibilityHint={valueIsCustom ? 'Opens the custom pronoun editor' : 'Selects this custom pronoun pair'}
            accessibilityRole="radio"
            accessibilityState={{ checked: valueIsCustom }}
            onPress={() => valueIsCustom ? openCustom() : onChange(cachedCustomPair)}
            style={[styles.choice, valueIsCustom && styles.choiceSelected]}>
            {valueIsCustom ? <Ionicons color={colors.primary} name="checkmark" size={16} /> : null}
            <AppText color={valueIsCustom ? colors.primary : colors.text} variant="caption">{cachedCustomPair}</AppText>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: customOpen }}
        onPress={openCustom}
        style={styles.customToggle}>
        <Ionicons color={colors.primary} name="add" size={20} />
        <AppText color={colors.primary} variant="bodyStrong">Build my own pair</AppText>
      </Pressable>
      <Modal
        animationType="slide"
        onRequestClose={() => setCustomOpen(false)}
        statusBarTranslucent
        transparent
        visible={customOpen}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetRoot}>
          <Pressable accessibilityLabel="Cancel custom pronouns" onPress={() => setCustomOpen(false)} style={styles.sheetBackdrop} />
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitle}>
                <AppText variant="heading">Build your own pair</AppText>
                <AppText color={colors.textMuted} variant="caption">Enter the pronouns you want displayed.</AppText>
              </View>
              <Pressable accessibilityLabel="Close" accessibilityRole="button" onPress={() => setCustomOpen(false)} style={styles.closeButton}>
                <Ionicons color={colors.textMuted} name="close" size={22} />
              </Pressable>
            </View>
            <View style={styles.customInputs}>
              <View style={styles.customSide}>
                <AppText color={colors.textMuted} variant="caption">First</AppText>
                <TextInput
                  accessibilityLabel="First pronoun"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  maxLength={20}
                  onChangeText={text => updateCustom(cleanPronounSide(text), second)}
                  placeholder="xe"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.primary}
                  style={styles.customInput}
                  value={first}
                />
              </View>
              <AppText color={colors.primary} style={styles.slash} variant="title">/</AppText>
              <View style={styles.customSide}>
                <AppText color={colors.textMuted} variant="caption">Second</AppText>
                <TextInput
                  accessibilityLabel="Second pronoun"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                  onChangeText={text => updateCustom(first, cleanPronounSide(text))}
                  placeholder="xem"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.primary}
                  style={styles.customInput}
                  value={second}
                />
              </View>
            </View>
            {first.trim() || second.trim() ? (
              <View style={styles.sheetPreview}>
                <AppText color={colors.textMuted} variant="caption">Your profile will show</AppText>
                <AppText color={first.trim() && second.trim() ? colors.primary : colors.textMuted} variant="bodyStrong">
                  {first.trim() || '…'}/{second.trim() || '…'}
                </AppText>
              </View>
            ) : null}
            <View style={styles.sheetActions}>
              <AppButton disabled={!first.trim() || !second.trim()} fullWidth label="Save pronouns" onPress={saveCustom} />
              <Pressable accessibilityRole="button" onPress={() => setCustomOpen(false)} style={styles.cancelButton}>
                <AppText color={colors.primary} variant="label">Cancel</AppText>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    minHeight: layout.minimumTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  sectionHeaderPressed: { backgroundColor: colors.surface },
  sectionCopy: { flex: 1, gap: spacing.xxs },
  sectionBody: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primarySoft,
    gap: spacing.lg,
    marginBottom: spacing.xl,
    marginLeft: spacing.xs,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingTop: spacing.xs,
  },
  visibilityRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  field: { gap: spacing.xs },
  input: {
    minHeight: layout.minimumTouchTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
  multiline: { minHeight: 88 },
  inlineInputShell: { minHeight: layout.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, paddingLeft: spacing.md, paddingRight: spacing.xs },
  inlineInput: { flex: 1, color: colors.text, paddingVertical: spacing.sm, ...typography.body },
  inlineAdd: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.primary },
  inlineAddDisabled: { backgroundColor: colors.surfaceMuted },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  choice: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  choiceSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  toggleCopy: { flex: 1, gap: spacing.xxs },
  customToggle: { minHeight: layout.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start' },
  sheetRoot: { flex: 1, justifyContent: 'flex-end' },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  sheet: { gap: spacing.lg, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.surfaceRaised, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  sheetHandle: { width: 40, height: 4, alignSelf: 'center', borderRadius: radii.pill, backgroundColor: colors.border },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  sheetTitle: { flex: 1, gap: spacing.xxs },
  closeButton: { width: layout.minimumTouchTarget, height: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surface },
  sheetPreview: { gap: spacing.xxs, borderRadius: radii.md, backgroundColor: colors.primarySoft, padding: spacing.md },
  sheetActions: { gap: spacing.xxs },
  cancelButton: { minHeight: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  customInputs: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  customSide: { flex: 1, gap: spacing.xxs },
  customInput: { minHeight: layout.minimumTouchTarget, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, color: colors.text, paddingHorizontal: spacing.md, ...typography.body },
  slash: { minWidth: 16, paddingTop: spacing.lg, textAlign: 'center' },
});
