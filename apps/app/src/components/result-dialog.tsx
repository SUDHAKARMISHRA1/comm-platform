import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

export function ResultDialog({
  visible,
  title,
  body,
  ok,
  onClose,
}: {
  visible: boolean;
  title: string;
  body: string;
  ok: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.kicker, ok ? styles.ok : styles.bad]}>{ok ? 'Success' : 'Failed'}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Pressable onPress={onClose} style={styles.btn}>
            <Text style={styles.btnText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
  },
  kicker: { fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase', fontSize: 11 },
  ok: { color: colors.success },
  bad: { color: colors.danger },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 22 },
  btn: {
    marginTop: space.sm,
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  btnText: { color: colors.primaryText, fontWeight: '700' },
});
