export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const fonts = {
  size: fontSizes,
  weight: fontWeights,
  family: {
    sans: 'Inter',
  },
} as const;

export type Fonts = typeof fonts;