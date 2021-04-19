import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import ReactTooltip from 'react-tooltip';
import { makeStyles, createStyles } from '@material-ui/core';


export const Tooltip = ({ id, text }) => {
  const classes = useStyles();
  return (
    <div className={classes.tooltip}>
      <InfoIcon width={30} height={30} data-tip data-for={id} />
      <ReactTooltip id={id} type="info">
        <span>{text}</span>
      </ReactTooltip>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    tooltip: {
      position: 'relative',
      right: '0.5rem',
      top: '-0.7rem',
      width: 0,
    },
  }),
);
