/**
 * Tiana Luxora - Centralized Theme Color & Design Token System
 * Modifying colors here updates theme values across the application.
 */

export const THEME_COLORS = {
  primary: "#83254e",
  primaryRgb: "131, 37, 78",

  accent: "#c47c94",
  accentRgb: "196, 124, 148",

  gold: "#c5a880",
  goldLight: "#f5eedc",

  bgGradient: "linear-gradient(135deg, #fdf9f7 0%, #f7ece8 100%)",
  bgLight: "#faf6f4",

  accentLight: "#f5e4ea",
  accentLightHover: "#edd3dd",

  disabled: "#a65377",
  primaryDark: "#6c1e40",

  white: "#ffffff",
  black: "#000000",
};

/**
 * Returns RGBA color string with specified opacity for primary color.
 * @param {number} opacity 
 */
export const primaryAlpha = (opacity) => `rgba(${THEME_COLORS.primaryRgb}, ${opacity})`;

/**
 * Returns RGBA color string with specified opacity for accent color.
 * @param {number} opacity 
 */
export const accentAlpha = (opacity) => `rgba(${THEME_COLORS.accentRgb}, ${opacity})`;

export default THEME_COLORS;

