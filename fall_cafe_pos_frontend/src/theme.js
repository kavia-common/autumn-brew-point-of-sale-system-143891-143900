export const theme = {
  name: 'Custom Theme',
  classic: true,
  colors: {
    primary: '#1E3A8A', // blue-900
    secondary: '#F59E0B', // amber-500
    success: '#F59E0B',
    error: '#DC2626',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#111827',
    subtleBorder: 'rgba(17,24,39,0.08)',
    shadow: '0 8px 24px rgba(17,24,39,0.08)'
  },
  gradient: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(245,158,11,0.08))'
};

// PUBLIC_INTERFACE
export function formatCurrency(value) {
  /** Format numbers as currency for display. */
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
