import { useCallback, useState, useEffect } from 'react';
import { Drawer, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { ToolbarPlaceholder } from 'components/header';

const maxDrawerWidth = 280;
const minDrawerWidth = 70;
const minBreakPoint = 120;
const maxBreakPoint = 230;

const Dragger = ({ handleMouseDown }) => {
  const classes = useStyles();
  return <div onMouseDown={handleMouseDown} className={classes.dragger} />;
};

export const ResizeableDrawer = ({ open, children }) => {
  const [drawerWidth, setDrawerWidth] = useState(minDrawerWidth);
  const [ease, setEase] = useState(true);
  const classes = useStyles({ drawerWidth });

  function handleMouseDown(e) {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
  }

  function handleMouseUp(e) {
    const currWidth = e.clientX - document.body.offsetLeft;
    const shouldOpen =
      (drawerWidth === 70 && currWidth >= minBreakPoint) ||
      (drawerWidth === 280 && currWidth >= maxBreakPoint);
    setDrawerWidth(shouldOpen ? maxDrawerWidth : minDrawerWidth);
    setEase(true);

    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  }

  const handleMouseMove = useCallback((e) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    const withinMinMax = newWidth > minDrawerWidth && newWidth < maxDrawerWidth;
    if (withinMinMax) setDrawerWidth(newWidth);
  }, []);

  useEffect(() => {
    if (drawerWidth !== minDrawerWidth && drawerWidth !== maxDrawerWidth) setEase(false);
  }, [drawerWidth]);

  useEffect(() => {
    if (open) setDrawerWidth(maxDrawerWidth);
    else setDrawerWidth(minDrawerWidth);
  }, [open]);

  return (
    <Drawer
      className={clsx(classes.transitioningDrawer, ease && classes.ease)}
      classes={{
        paper: clsx(classes.root, classes.transitioningDrawer, ease && classes.ease),
      }}
      variant="permanent"
    >
      <ToolbarPlaceholder />
      <Dragger handleMouseDown={handleMouseDown} />
      {children}
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[200],
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
  },
  transitioningDrawer: {
    width: (props) => props.drawerWidth,
  },
  ease: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  dragger: {
    width: '1px',
    cursor: 'ew-resize',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      border: `1px solid ${theme.palette.primary.light} `,
    },
    '&:active': {
      border: `1px solid ${theme.palette.primary.light} `,
    },
  },
}));
