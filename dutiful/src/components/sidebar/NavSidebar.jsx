import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ToolbarPlaceholder } from 'components/header';

const drawerWidth = 280;

export const NavSidebar = ({ open, options }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <ToolbarPlaceholder />
      <NavList options={options} />
    </Drawer>
  );
};

const NavList = ({ options, nested = false }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState();

  function handleSelect(label) {
    return () => {
      setSelected(label);
    };
  }

  useEffect(() => {
    setSelected(options[0].label);
  }, []);

  return (
    <List>
      {options.map((option) => {
        return (
          <NavListItem
            key={option.label}
            className={clsx(nested && classes.nested)}
            option={option}
            onSelect={handleSelect(option.label)}
            selected={selected === option.label}
          />
        );
      })}
    </List>
  );
};

const NavListItem = ({ className, option, onSelect, selected }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function handleSelect() {
    if (option.children) setOpen(!open);
    onSelect();
  }

  useEffect(() => {
    if (!selected) setOpen(false);
  }, [selected]);

  return (
    <>
      <ListItem
        key={option.label}
        button
        to={option.url}
        component={Link}
        onClick={handleSelect}
        selected={selected}
        className={className}
        classes={{ selected: classes.selected }}
      >
        <ListItemIcon
          className={clsx(classes.listIcon, selected && classes.selectedItem)}
        >
          {option.icon}
        </ListItemIcon>
        <ListItemText
          primary={option.title}
          className={clsx(classes.listText, selected && classes.selectedItem)}
        />
        {option.children && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {option.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <NavList options={option.children} nested />
        </Collapse>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: theme.palette.secondary.main,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background: theme.palette.secondary.main,
  },
  listIcon: {
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  text: {
    color: 'white',
    fontWeight: 700,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  selected: {
    '&$selected': {
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: 'white',
      },
    },
  },
  selectedItem: {
    color: theme.palette.secondary.main,
  },
}));
