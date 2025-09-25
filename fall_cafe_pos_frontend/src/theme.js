//
// Theme configuration for the Fall Cafe POS application
//

// PUBLIC_INTERFACE
export const theme = {
  name: "Custom Theme",
  description: "Autumn-inspired classic theme",
  colors: {
    primary: "#1E3A8A", // Deep Blue
    secondary: "#F59E0B", // Amber
    success: "#F59E0B",
    error: "#DC2626",
    background: "#F3F4F6",
    surface: "#FFFFFF",
    text: "#111827",
    accent1: "#D97706", // darker amber
    accent2: "#9A3412", // rust
    accent3: "#92400E", // brownish orange
    outline: "#E5E7EB",
    subtleText: "#6B7280",
  },
  // Elevation tokens for classic clean UI
  elevation: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 4px 8px rgba(0,0,0,0.06)",
    lg: "0 10px 15px rgba(0,0,0,0.08)",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
  }
};
