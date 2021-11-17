import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#024B8D',
      dark: '#00277E',
      light: '#227A9E',
    },
    secondary: {
      main: '#A12D16',
      dark: '#8F4111',
      light: '#B03336',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro',
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
