import { Pressable, Text } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { colors, radius, space, type } from './theme';

type ButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, variant = 'primary', disabled, style, ...props }: ButtonProps) {
  const backgroundColor =
    variant === 'ghost' ? 'transparent' : colors.primary;
  const color = variant === 'ghost' ? colors.primary : colors.primaryText;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={[
        {
          backgroundColor,
          borderColor: variant === 'ghost' ? colors.primary : colors.primary,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingVertical: space.sm + 4,
          paddingHorizontal: space.md,
          opacity: disabled ? 0.6 : 1,
          alignItems: 'center',
        },
        style,
      ]}
      {...props}
    >
      <Text style={{ color, fontSize: type.body, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
