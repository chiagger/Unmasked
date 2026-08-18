import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText, colors, radii, spacing } from '@/design-system';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';
import {
  removeProfilePhoto,
  uploadProfilePhoto,
} from '@/features/profile/profilePhotoService';

export function ProfilePhotoPicker({
  name,
  onChange,
  photoUrl,
  userId,
}: {
  name: string;
  onChange: (photoUrl?: string) => void;
  photoUrl?: string;
  userId: string;
}) {
  const [busy, setBusy] = useState(false);

  const choose = async (source: 'camera' | 'library') => {
    if (busy) return;
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera access needed', 'Allow camera access to take a profile photo.');
        return;
      }
    }

    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.8,
    };
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    if (asset.fileSize && asset.fileSize >= 5 * 1024 * 1024) {
      Alert.alert(
        'Photo is too large',
        'Choose another photo smaller than 5 MB.',
      );
      return;
    }

    setBusy(true);
    try {
      const nextUrl = await uploadProfilePhoto({
        contentType: asset.mimeType,
        localUri: asset.uri,
        userId,
      });
      onChange(nextUrl);
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error
        ? String(error.code)
        : '';
      Alert.alert(
        'Could not upload photo',
        code.includes('object-not-found')
          ? 'Profile photo storage is not ready yet. Please try again after Firebase Storage is set up.'
          : code.includes('unauthorized') || code.includes('auth-mismatch')
            ? 'Your session could not authorize this upload. Please sign out, sign back in, and try again.'
            : 'Please check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const openChoices = () => Alert.alert(
    photoUrl ? 'Change profile photo' : 'Add a profile photo',
    'Choose where your photo comes from.',
    [
      { text: 'Take photo', onPress: () => choose('camera') },
      { text: 'Choose from library', onPress: () => choose('library') },
      ...(photoUrl ? [{
        text: 'Remove photo',
        style: 'destructive' as const,
        onPress: remove,
      }] : []),
      { text: 'Cancel', style: 'cancel' },
    ],
  );

  const remove = async () => {
    setBusy(true);
    try {
      await removeProfilePhoto(userId);
      onChange(undefined);
    } catch {
      Alert.alert('Could not remove photo', 'Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.row}>
      <View>
        <ProfileAvatar name={name} photoUrl={photoUrl} size={88} />
        <View style={styles.cameraBadge}>
          {busy ? (
            <ActivityIndicator color={colors.surfaceRaised} size="small" />
          ) : (
            <Ionicons color={colors.surfaceRaised} name="camera" size={18} />
          )}
        </View>
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyStrong">Profile photo</AppText>
        <AppText color={colors.textMuted} variant="caption">
          Help people recognize you. A clear photo works best.
        </AppText>
        <Pressable
          accessibilityLabel={photoUrl ? 'Change profile photo' : 'Add profile photo'}
          accessibilityRole="button"
          disabled={busy}
          onPress={openChoices}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <AppText color={colors.primary} variant="label">
            {busy ? 'Uploading…' : photoUrl ? 'Change photo' : 'Add photo'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.canvas,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  copy: { flex: 1, alignItems: 'flex-start', gap: spacing.xxs },
  action: { minHeight: 44, justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
