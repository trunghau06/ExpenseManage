export const colors = {
  // Màu chủ đạo & Chức năng
  primary: '#1E40AF',
  primaryHover: '#172554',
  secondary: '#38BDF8',
  income: '#10B981',
  expense: '#EF4444',
  neutral: '#64748B',

  // Nền, Khung & Chữ
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1F2937',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  // Gradient Colors (Dùng với expo-linear-gradient hoặc react-native-linear-gradient)
  bgAuthGradient: ['#c6daf4', '#FFFFFF', '#baddf5'] as const,
  btnGradient: ['#1E40AF', '#172554'] as const,
  iconGradient: ['#2563EB', '#1D4ED8'] as const,

  // Shadows
  shadowPrimary: 'rgba(37, 99, 235, 0.35)',
  shadowCard: 'rgba(0, 30, 90, 0.08)',
  focusRing: 'rgba(30, 64, 175, 0.12)',
} as const;

export type Colors = typeof colors;