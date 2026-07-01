import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Card, Icon, Text, useTheme } from 'react-native-paper';

export interface CategoryCardProps {
  /** Display label for the category (e.g. 'Clothes', 'Furniture') */
  label: string;
  /** Icon name (MaterialCommunityIcons) representing the category */
  icon: string;
  /** Callback function triggered when the category tile is pressed */
  onPress: () => void;
  /** Custom styles to apply to the card container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * CategoryCard displays individual item categories in a grid or horizontal scroll.
 * Features a large central icon, text label, and responsive press feedback.
 */
export const CategoryCard: React.FC<CategoryCardProps> = React.memo(({
  label,
  icon,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `Category, ${label}`}
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: theme.colors.primaryContainer }}
        style={styles.pressable}
      >
        <Icon
          source={icon}
          size={36}
          color={theme.colors.primary}
        />
        <Text
          variant="labelMedium"
          style={[styles.label, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    elevation: 1,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

CategoryCard.displayName = 'CategoryCard';
