import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ContentSectionProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: any;
}

export default function ContentSection({
  title,
  icon,
  children,
  style,
}: ContentSectionProps) {
  const themeColors = useThemeColors();

  return (
    <View style={[styles.section, { backgroundColor: themeColors.card }, style]}>
      {(title || icon) && (
        <View style={styles.sectionHeader}>
          {icon}
          {title && (
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {title}
            </Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
