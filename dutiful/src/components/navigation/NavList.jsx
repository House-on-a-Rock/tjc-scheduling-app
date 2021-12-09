import { Fragment, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons/';
import { NavigationDrawerContext } from 'providers/drawerProvider';
import { useToggle } from 'hooks/useToggle';

export const NavList = ({ options, nested = false, handleRoute, path = '' }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState('');
  const { isOpen: isDrawerOpen } = useContext(NavigationDrawerContext);

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
      {options.map((option, idx) => {
        if (option.type === 'title')
          return (
            <OrganizationItem
              key={`${option.title} ${idx}`}
              option={option}
              isDrawerOpen={isDrawerOpen}
            />
          );
        return (
          <NavListItem
            key={`${option.label} ${idx}`}
            className={clsx(nested && classes.nested)}
            option={option}
            onSelect={handleSelect(option.url)}
            selected={selected.includes(option.label)}
            path={path}
          />
        );
      })}
    </List>
  );
};

const OrganizationItem = ({ option, isDrawerOpen }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <ListItem className={classes.titleListItem}>
        {option.icon && (
          <ListItemIcon className={clsx(classes.listIcon, classes.titleIcon)}>
            {option.icon}
          </ListItemIcon>
        )}
        <ListItemText primary={option.title} classes={{ primary: classes.title }} />
      </ListItem>
      <Divider />
    </Fragment>
  );
};

const NavListItem = ({ className, option, onSelect, selected, path }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useToggle(false);
  const { isOpen: isDrawerOpen, setIsOpen: setDrawerOpen } = useContext(
    NavigationDrawerContext,
  );

  function handleSelect() {
    if (option.disabled) return;
    if (!isDrawerOpen && selected) return setDrawerOpen();
    if (isDrawerOpen && option.children) setIsExpanded();
    onSelect();
  }

  useEffect(() => {
    setIsExpanded(isDrawerOpen && selected && !!path);
  }, [isDrawerOpen, selected]);

  return (
    <>
      <ListItem
        key={option.label}
        className={className}
        classes={{ selected: classes.selected }}
        selected={selected}
        disabled={option.disabled}
        onClick={handleSelect}
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
        {option.children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {option.children && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
    color: theme.palette.secondary.main,
  },
  text: { fontWeight: 700 },
  selected: {
    '&$selected': {
      backgroundColor: theme.palette.grey[300],
      '&:hover': { backgroundColor: theme.palette.grey[300] },
    },
  },
  selectedItem: { color: theme.palette.primary.light },
  titleListItem: { margin: `${theme.spacing(2)}px 0` },
  title: { fontSize: theme.spacing(3) },
  titleIcon: { color: theme.palette.primary.main },
}));
