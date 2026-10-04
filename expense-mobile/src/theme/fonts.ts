export const fontSizes = {
  xs: 12,   // 0.75rem  — nhãn nhỏ, ghi chú phụ
  sm: 14,   // 0.875rem — text phụ, placeholder, link
  base: 16, // 1rem     — chữ nội dung chuẩn, input text
  md: 18,   // 1.125rem — nút bấm chính, tiêu đề nhỏ
  lg: 20,   // 1.25rem  — icon header, sub-heading
  xl: 24,   // 1.5rem   — tiêu đề h2 form
  xxl: 28,  // 1.75rem  — tiêu đề card lớn
  xxxl: 32, // 2rem     — tiêu đề h1 dashboard
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
    sans: 'Inter', // Cài đặt nếu dùng @expo-google-fonts/inter
  },
} as const;

export type Fonts = typeof fonts;