import React from 'react';
import PropTypes from 'prop-types';

// mat ui
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';

import { makeStyles, createStyles } from '@material-ui/core/styles';

// TODO add tooltips after reworking them
const TemplateDisplay = ({ name, templateId, onAddClick, children }) => {
  const classes = useStyles();

  return (
    <Card raised className={classes.card} key={templateId.toString()}>
      <AddIcon onClick={() => onAddClick(templateId)} />
      <h3 style={{ margin: 5 }}>{name}</h3>
      {children}
    </Card>
  );
};
// howard u can work ur magic here hehe
const useStyles = makeStyles(() =>
  createStyles({
    card: { width: '80%', padding: 10, margin: 5 },
  }),
);

TemplateDisplay.propTypes = {
  name: PropTypes.string,
  templateId: PropTypes.number,
  onAddClick: PropTypes.func,
  children: PropTypes.node,
};

export default TemplateDisplay;
