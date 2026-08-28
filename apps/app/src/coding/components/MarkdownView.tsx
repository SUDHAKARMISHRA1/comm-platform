import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@comm-platform/ui';

let Markdown: React.ComponentType<{ children?: string }> | null = null;
if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Markdown = require('react-markdown').default;
}

export function MarkdownView({ content }: { content: string }) {
  if (Platform.OS === 'web' && Markdown) {
    return (
      <View style={styles.md}>
        <Markdown>{content}</Markdown>
      </View>
    );
  }
  return <Text style={styles.fallback}>{content}</Text>;
}

const styles = StyleSheet.create({
  md: { gap: space.sm },
  fallback: { color: colors.text, fontSize: type.body, lineHeight: 22 },
});
