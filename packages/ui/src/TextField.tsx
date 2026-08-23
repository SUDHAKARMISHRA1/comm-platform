import { TextInput, View, Text, type TextInputProps, StyleSheet } from 'react-native';

import { colors, radius, space, type } from './theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...props }: TextFieldProps) {
  const fieldLabel = label;
  return (
    <View style={styles.wrap}>
      <Text nativeID={`${props.accessibilityLabel ?? fieldLabel}-label`} style={styles.label}>
        {fieldLabel}
      </Text>
      <TextInput
        accessibilityLabel={fieldLabel}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error ? styles.inputError : null]}
        {...props}
      />
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { color: colors.text, fontSize: type.small, fontWeight: '600' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    fontSize: type.body,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: type.small },
});
