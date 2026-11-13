export const colors = {
  primary: '#1E40AF',
  primaryHover: '#172554',
  secondary: '#38BDF8',
  income: '#10B981',
  expense: '#EF4444',
  neutral: '#64748B',

  bg: '#F1F9FF',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1F2937',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  bgAuthGradient: [
    '#C6DAF4',
    '#FFFFFF',
    '#BADDF5',
  ] as const,

  btnGradient: [
    '#1E40AF',
    '#172554',
  ] as const,

  iconGradient: [
    '#2563EB',
    '#1D4ED8',
  ] as const,

  balanceGradient: [
    '#15379A',
    '#2458B8',
    '#08758A',
  ] as const,

  successSoft: '#ECFDF5',
  warning: '#F59E0B',
  errorSoft: 'rgba(239, 68, 68, 0.1)',
  inputSurface: 'rgba(255, 255, 255, 0.9)',
  glassSurface: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',
  modalOverlay: 'rgba(0, 0, 0, 0.45)',
  modalOverlaySoft: 'rgba(0, 0, 0, 0.4)',

  shadowPrimary: 'rgba(37, 99, 235, 0.35)',
  shadowCard: 'rgba(0, 30, 90, 0.08)',
  focusRing: 'rgba(255, 255, 255, 0.16)',
} as const;

export type Colors = typeof colors;