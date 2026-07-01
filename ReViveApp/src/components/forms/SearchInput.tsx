import React from 'react';
import { NativeSyntheticEvent, StyleProp, TextInputSubmitEditingEventData, ViewStyle } from 'react-native';
import { AppTextInput } from './AppTextInput';

export interface SearchInputProps {
  /** Label or placeholder for the search input */
  label?: string;
  /** Current search query string */
  value: string;
  /** Callback called when query text changes */
  onChangeText: (text: string) => void;
  /** Custom style for the input wrapper */
  style?: StyleProp<ViewStyle>;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional callback triggered when search is submitted via keyboard */
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  /** Optional callback triggered when the clear button is pressed */
  onClear?: () => void;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * SearchInput is a specialized input field styled and optimized for searches.
 * Displays a search icon and an automatic clear button when text is entered.
 */
export const SearchInput: React.FC<SearchInputProps> = React.memo(({
  label = 'Search',
  value,
  onChangeText,
  style,
  placeholder = 'Search here...',
  onSubmitEditing,
  onClear,
  accessibilityLabel,
}) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <AppTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={style}
      placeholder={placeholder}
      leftIcon="magnify"
      rightIcon={value ? 'close' : undefined}
      onRightIconPress={handleClear}
      autoCapitalize="none"
      accessibilityLabel={accessibilityLabel || label}
      // Pass underlying props for keyboard behaviors if needed,
      // here we simulate key properties using our modular wrapper
    />
  );
});

SearchInput.displayName = 'SearchInput';
