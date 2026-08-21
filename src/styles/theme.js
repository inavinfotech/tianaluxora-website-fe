/**
 * Tiana Luxora - Centralized Theme Color & Design Token System
 * Modifying colors here updates theme values across the application.
 */

export const THEME_COLORS = {
  primary: "#83254e",
  primaryRgb: "131, 37, 78",

  accent: "#d97398",
  accentRgb: "217, 115, 152",

  bgGradient: "linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%)",
  bgLight: "#fcf5f8",

  accentLight: "#f7c2d4",
  accentLightHover: "#f4b8cc",

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
