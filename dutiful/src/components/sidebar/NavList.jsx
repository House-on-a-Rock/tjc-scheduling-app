import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons/';

export const NavList = ({ options, nested = false, handleRoute, path = '', open }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState('');

  function handleSelect(url) {
    return (nestedUrl = '') => {
      const route = url + nestedUrl ?? '';
      setSelected(route);
      handleRoute(route);
    };
  }

  useEffect(() => {
    const selectedOption = options.find((option) => path.includes(option.url));
    if (selectedOption) setSelected(selectedOption.url);
    if (nested && selectedOption) handleRoute(selectedOption.url);
  }, [path, options, nested]);

  return (
    <List>
      {options.map((option) => {
        return (
          <NavListItem
            key={option.label}
            className={clsx(nested && classes.nested)}
            option={option}
            onSelect={handleSelect(option.url)}
            selected={selected.includes(option.label)}
            path={path}
            isDrawerOpen={open}
          />
        );
      })}
    </List>
  );
};

const NavListItem = ({ className, option, onSelect, selected, path, isDrawerOpen }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function handleSelect() {
    if (option.children) setOpen(!open);
    onSelect();
  }

  useEffect(() => {
    setOpen(isDrawerOpen && selected);
  }, [isDrawerOpen, selected]);

  return (
    <>
      <ListItem
        key={option.label}
        className={className}
        classes={{ selected: classes.selected }}
        selected={selected}
        onClick={() => handleSelect()}
      >
        <ListItemIcon
          className={clsx(classes.listIcon, selected && classes.selectedItem)}
        >
          {option.icon}
        </ListItemIcon>
        <ListItemText
          primary={option.title}
          className={clsx(classes.text, selected && classes.selectedItem)}
        />
        {option.children && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {option.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <NavList
            options={option.children}
            nested
            handleRoute={(event) => onSelect(event)}
            path={path.replace(option.url, '')}
          />
        </Collapse>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
