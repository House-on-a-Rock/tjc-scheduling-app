import { createMuiTheme } from '@material-ui/core/styles';

const tjcBlue = '#024B8D';
const tjcLightBlue = '#0083a9';
const tjcOrange = '#A15816';
const interactiveColorRed = '#A12D16';
const interactiveColorBlue = '#0684AB';
const primaryButtonColor = tjcBlue; // '#024B8D';
const mainTextColor = '#556071';
const mainTitleColor = mainTextColor;
const mainBackgroundColor = '#FFFFFF';
const secondaryBackgroundColor = '#EDEEF3';
const veryLightGrey = secondaryBackgroundColor;
const greyedOutButtonColor = '#C8C8C8';
const greyedOutBorderColor = greyedOutButtonColor;
const greyedOutBackgroundColor = '#2F2F2F';
const fastTransitionTime = '0.2s';
const slowTransitionTime = '1s';

export default createMuiTheme({
  palette: {
    common: {
      blue: `${tjcBlue}`,
      lightBlue: `${tjcLightBlue}`,
    },
    primary: {
      main: `${tjcBlue}`,
    },
    secondary: {
      main: `${tjcOrange}`,
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro',
    h1: {
      fontSize: '36px',
      color: mainTitleColor,
    },
    h2: {
      fontSize: '26px',
      color: mainTitleColor,
    },
    h3: {
      fontSize: '24px',
      color: mainTitleColor,
    },
    body: {
      fontSize: '16px',
    },
  },
});

// TODO: find a way to integrate custom names into createMuiTheme instead of this separate object:
// custom theme object for custom names:
export const themeExtension = {
  palette: {
    common: {
      blue: tjcBlue,
      lightBlue: tjcLightBlue,
    },
    primary: {
      main: tjcBlue,
    },
    secondary: {
      main: tjcOrange,
    },
  },
  transition: {
    fast: fastTransitionTime,
    slow: slowTransitionTime,
  },
  typography: {
    fontFamily: 'Source Sans Pro',
    common: {
      color: mainTextColor,
    },
  },
  card: {
    backgroundColor: mainBackgroundColor,
    boxShadow: '#CCCCCC 0 2px 23px',
    transition: fastTransitionTime,
    border: 'transparent 2px solid',
    hover: {
      // in case you just want to import hover style
      border: `${interactiveColorBlue} 2px solid`,
      boxShadow: '#CCDBE0 0 2px 23px',
    },
    '&:hover, &:focus, &:active': {
      border: `${interactiveColorBlue} 2px solid`,
      boxShadow: '#CCDBE0 0 2px 23px',
    },
  },
  button: {
    outlined: {
      backgroundColor: mainBackgroundColor,
      border: `${primaryButtonColor} 1px solid`,
      hover: {
        // in case you just want to import hover style
        boxShadow: '#D5E3F0 0 6px 15px',
      },
      '&:hover, &:focus, &:active': {
        boxShadow: '#D5E3F0 0 6px 15px',
      },
    },
    filled: {
      backgroundColor: primaryButtonColor,
      transition: fastTransitionTime,
      hover: {
        // in case you just want to import hover style
        backgroundColor: interactiveColorBlue,
        color: 'white',
        boxShadow: '#000B44 0 3px 10px',
      },
      '&:hover, &:focus, &:active': {
        backgroundColor: interactiveColorBlue,
        color: 'white',
        boxShadow: '#000B44 0 3px 10px',
      },
    },
    warning: {
      backgroundColor: 'pink',
      transition: fastTransitionTime,
      hover: {
        // in case you just want to import hover style
        backgroundColor: interactiveColorRed,
        color: 'white',
        boxShadow: `${interactiveColorRed} 0 3px 10px`,
      },
      '&:hover, &:focus, &:active': {
        backgroundColor: interactiveColorRed,
        color: 'white',
        boxShadow: `${interactiveColorRed} 0 3px 10px`,
      },
    },
    icon: {
      color: primaryButtonColor,
      transition: fastTransitionTime,
      hover: {
        // in case you just want to import hover style
        color: interactiveColorBlue,
      },
      '&:hover, &:focus, &:active': {
        color: interactiveColorBlue,
      },
    },
  },
  sideBar: {
    backgroundColor: secondaryBackgroundColor,
    boxShadow: '#CFCFCF 0 2px 23px',
    hover: {
      // in case you just want to import hover style
      backgroundColor: interactiveColorBlue,
    },
    '&:hover, &:focus, &:active': {
      backgroundColor: interactiveColorBlue,
    },
  },
  tabs: {
    borderBottom: `${veryLightGrey} 2px solid`,
    marginBottom: '-1px',
  },
  tabIndicator: {
    backgroundColor: tjcLightBlue,
    height: '0.3rem',
    width: '80px',
    marginLeft: '40px',
    zIndex: 2,
    borderRadius: '3px 3px 0 0',
  },
  tab: {
    color: mainTextColor,
    background: 'transparent',
    'text-transform': 'none',
    border: 'none',
    transition: fastTransitionTime,
    padding: '0 0 5px',
    margin: '0 -1px',
    '& span:first-child': {
      fontSize: 'large',
      borderWidth: '0 2px',
      borderColor: veryLightGrey,
      borderStyle: 'solid',
    },
    '&[aria-selected="true"]': {
      color: 'black',
      fontWeight: 'bold',
    },
    '&:hover': {
      color: 'white',
      background: tjcLightBlue,
      zIndex: 3,
      borderRadius: '5px 5px 0 0',
      boxShadow: `${greyedOutBackgroundColor} 0 20px 23px`,
      '& span:first-child': {
        border: 'none',
      },
    },
  },
  componentLoadingSpinner: {
    '&': {
      // '&' hack to get around un-assignable type error
      position: 'relative',
    },
    '& *': {
      // prevent interaction with the component's innards while it loads
      pointerEvents: 'none',
    },
    '&:before': {
      // this pseudo-component is the actual spinner
      zIndex: 9001 /* it's over 9000 */,
      content: '""',
      position: 'absolute',
      width: 70, // small in case component is small
      height: 70,
      top: 'calc(50% - 70px / 2)' /* -1/2 of height */,
      left: 'calc(50% - 70px / 2)' /* -1/2 of width */,
      boxSizing: 'border-box',
      border: '16px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '16px solid #0083a9',
      boxShadow: '0 0 20px 0 #00000050, inset 0 0 20px 0 #00000050',
      '-webkit-animation': 'spin 2s linear infinite' /* Safari */,
      animation: 'spin 2s linear infinite',
    },
    '&:after': {
      // use another pseudo-component to block interacting with rest of page while this component loads
      zIndex: 9000,
      content: '""',
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
      background: 'transparent',
    },
  },
};

export function sizedComponentLoadingSpinner(parentWidth, parentHeight) {
  const smallerDimension = Math.min(parentWidth, parentHeight);
  const sizedSpinner = themeExtension.componentLoadingSpinner;
  sizedSpinner['&:before'].width = smallerDimension / 2;
  sizedSpinner['&:before'].height = smallerDimension / 2;
  return sizedSpinner;
}

// to avoid loading the whole object:
export const paletteTheme = themeExtension.palette;
export const typographyTheme = themeExtension.typography;
export const transitionTheme = themeExtension.transition;
export const cardTheme = themeExtension.card;
export const buttonTheme = themeExtension.button;
export const sideBarTheme = themeExtension.sideBar;
export const tabTheme = themeExtension.tab;
export const tabGroupTheme = themeExtension.tabs;
export const tabIndicatorTheme = themeExtension.tabIndicator;
export const loadingTheme = themeExtension.componentLoadingSpinner;
