// Paleta y tema global inspirado en la imagen de referencia
export const colors = {
  primary: '#7B2FF2', // violeta principal del gradiente
  secondary: '#F357A8', // rosa del gradiente
  background: '#2B2B4B', // fondo oscuro
  card: '#3B3B5B', // tarjetas
  accent: '#2FA45C', // verde de check
  text: '#FFFFFF',
  subtitle: '#B0B0D0',
  icon: '#FFFFFF',
  button: '#7B2FF2',
  buttonText: '#FFFFFF',
  buttonSecondary: '#F5F7FB',
  buttonSecondaryText: '#7B2FF2',
  neutro: "#EEEEEEFF",
  border: '#444466',

  dark: {
    900: "#060811FF",
    800: "#070A13FF",
    700: "#090B15FF",
    600: "#0A0D17FF",
    500: "#0B0F1AFF",
    400: "#23252EFF",
    300: "#53555CFF",
    200: "#6D6F75FF",
    100: "#888A8FFF",
  },
  danger: {
    900: "#CB4A4FFF",
    800: "#CB4C51FF",
    700: "#D16266FF",
    600: "#D7787BFF",
    500: "#DD8E90FF",
    400: "#E2A3A6FF",
    300: "#E8B9BBFF",
    200: "#EECFD0FF",
    100: "#F3E4E6FF",
  },
  success: {
    900: "#2FA45CFF",
    800: "#32A55DFF",
    700: "#4BB071FF",
    600: "#64BA85FF",
    500: "#7DC598FF",
    400: "#95D0ACFF",
    300: "#AEDAC0FF",
    200: "#C7E5D4FF",
    100: "#E0EFE7FF",
  },
  secondary_2: {
    900: "#412754FF",
    800: "#4D2D65FF",
    700: "#673A89FF",
    600: "#74409CFF",
    500: "#74409BFF",
    400: "#8454A7FF",
    300: "#9469B2FF",
    200: "#A37DBDFF",
    100: "#C2A7D3FF",
  },
  primary_2: {
    900: "#283354FF",
    800: "#2E3B62FF",
    700: "#334371FF",
    600: "#384B80FF",
    500: "#384C81FF",
    400: "#4E5D8EFF",
    300: "#7A82A9FF",
    200: "#A5AAC5FF",
    100: "#BBBFD4FF",
  },

};
export const FontFamily = {
  regular: 'Poppins-Regular',
  bold: 'Poppins-Bold',
  semiBold: 'Poppins-SemiBold',
  medium: 'Poppins-Medium',
  light: 'Poppins-Light',
};
export const FontSize = {
    xxs: 10,
    xs: 12,
    small: 14,
    body: 16,
    large: 18,
};
export const theme = {
  colors,
  borderRadius: 18,
  fontFamily: FontFamily.regular,
  fontSize: FontSize.body,
};
