import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/design-system/tokens';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  content: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
