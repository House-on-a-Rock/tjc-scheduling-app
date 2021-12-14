import { createTheme } from '@material-ui/core/styles';

const primary = '#024B8D';
const primaryLight = '#227A9E';
const primaryDark = '#00277E';
const secondary = '#A12D16';
const secondaryLight = '#B03336';
const secondaryDark = '#8F4111';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: primary,
      light: primaryLight,
      dark: primaryDark,
    },
    secondary: {
      main: secondary,
      light: secondaryLight,
      dark: secondaryDark,
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    // fontFamily: 'Source Sans Pro',
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        // borderBottom: 'none',
        border: '1px solid rgb(238, 238, 237)',
        padding: '0 16px',
        '&:first-child': {
          borderLeft: 'none',
        },
        '&:last-child': { borderRight: 'none' },
      },
    },
    MuiTableRow: {
      root: { height: '43px' },
    },
  },
});
