// Spacing scale based on 4px grid system
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Common spacing values with semantic names
export const layout = {
  // Screen padding
  screenPadding: spacing[4], // 16px
  screenPaddingHorizontal: spacing[4], // 16px
  screenPaddingVertical: spacing[6], // 24px
  
  // Card spacing
  cardPadding: spacing[4], // 16px
  cardMargin: spacing[4], // 16px
  cardRadius: 12,
  
  // Component spacing
  componentSpacing: spacing[4], // 16px
  sectionSpacing: spacing[6], // 24px
  itemSpacing: spacing[3], // 12px
  
  // Input spacing
  inputPadding: spacing[3], // 12px
  inputMargin: spacing[2], // 8px
  
  // Button spacing
  buttonPadding: spacing[3], // 12px
  buttonPaddingLarge: spacing[4], // 16px
  buttonMargin: spacing[2], // 8px
  
  // Header spacing
  headerHeight: 56,
  headerPadding: spacing[4], // 16px
  
  // Tab bar spacing
  tabBarHeight: 60,
  tabBarPadding: spacing[2], // 8px
  
  // List spacing
  listItemPadding: spacing[4], // 16px
  listItemMargin: spacing[1], // 4px
  
  // Modal spacing
  modalPadding: spacing[6], // 24px
  modalMargin: spacing[4], // 16px
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // Border width
  borderWidth: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    8: 8,
  },
  
  // Shadow elevation
  elevation: {
    0: 0,
    1: 2,
    2: 4,
    3: 8,
    4: 12,
    5: 16,
  },
  
  // Icon sizes
  iconSize: {
    xs: 12,
    sm: 16,
    base: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
    '3xl': 56,
  },
  
  // Avatar sizes
  avatarSize: {
    xs: 24,
    sm: 32,
    base: 40,
    md: 48,
    lg: 56,
    xl: 64,
    '2xl': 80,
    '3xl': 96,
  },
  
  // Chart dimensions
  chartHeight: {
    sm: 200,
    base: 250,
    lg: 300,
    xl: 350,
  },
  
  // Minimum touch target size (accessibility)
  minTouchTarget: 44,
  
  // Safe area insets (will be overridden by actual device values)
  safeArea: {
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  },
};

export type SpacingKey = keyof typeof spacing;
export type LayoutKey = keyof typeof layout;