import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, colors, radii, spacing } from '@/design-system';

export function ProfileAvatar({
  name,
  photoUrl,
  size = 48,
  expandable = false,
}: {
  expandable?: boolean;
  name: string;
  photoUrl?: string;
  size?: number;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const shape = { width: size, height: size, borderRadius: radii.pill };

  if (photoUrl?.trim()) {
    const photo = (
      <Image
        accessibilityLabel={`${name}'s profile photo`}
        cachePolicy="memory-disk"
        contentFit="cover"
        source={photoUrl}
        style={shape}
        transition={150}
      />
    );
    if (!expandable) return photo;
    return (
      <>
        <Pressable
          accessibilityHint="Opens the photo full screen"
          accessibilityLabel={`Enlarge ${name}'s profile photo`}
          accessibilityRole="button"
          onPress={() => setViewerOpen(true)}
          style={({ pressed }) => pressed && styles.avatarPressed}>
          {photo}
        </Pressable>
        <Modal
          animationType="fade"
          onRequestClose={() => setViewerOpen(false)}
          statusBarTranslucent
          transparent
          visible={viewerOpen}>
          <View style={styles.viewer}>
            <Pressable
              accessibilityLabel="Close enlarged profile photo"
              onPress={() => setViewerOpen(false)}
              style={styles.backdrop}
            />
            <SafeAreaView accessibilityViewIsModal style={styles.viewerSafeArea}>
              <View style={styles.photoGroup}>
                <View style={styles.viewerHeader}>
                  <Pressable
                    accessibilityLabel="Close enlarged profile photo"
                    accessibilityRole="button"
                    hitSlop={6}
                    onPress={() => setViewerOpen(false)}
                    style={({ pressed }) => [styles.close, pressed && styles.closePressed]}>
                    <Ionicons color={colors.text} name="close" size={20} />
                  </Pressable>
                </View>
                <Image
                  accessibilityLabel={`${name}'s enlarged profile photo`}
                  cachePolicy="memory-disk"
                  contentFit="contain"
                  source={photoUrl}
                  style={styles.fullPhoto}
                  transition={150}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={[styles.fallback, shape]}>
      <AppText color={colors.secondary} variant={size >= 60 ? 'title' : 'heading'}>
        {(name || '?')[0].toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondarySoft,
  },
  avatarPressed: { opacity: 0.76, transform: [{ scale: 0.96 }] },
  viewer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(12, 25, 27, 0.94)' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  viewerSafeArea: { flex: 1, justifyContent: 'center' },
  photoGroup: { width: '100%', gap: spacing.sm, paddingHorizontal: spacing.lg },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  close: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
  },
  closePressed: { opacity: 0.72 },
  fullPhoto: { width: '100%', aspectRatio: 1, borderRadius: radii.md },
});
