import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/design-system';
import { getSocialAuthProvider } from '@/features/auth/authService';

interface SocialAuthButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function SocialAuthButton(props: SocialAuthButtonProps) {
  const provider = getSocialAuthProvider();
  if (!provider) return null;

  return (
    <AppButton
      {...props}
      fullWidth
      icon={
        <Ionicons name={provider === 'apple' ? 'logo-apple' : 'logo-google'} size={20} />
      }
      label={`Continue with ${provider === 'apple' ? 'Apple' : 'Google'}`}
      variant="social"
    />
  );
}
