import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import ReactTooltip from 'react-tooltip';

interface TooltipProps {
  id: string;
  text: string;
}

export const Tooltip = ({ id, text }: TooltipProps) => {
  return (
    <div>
      <InfoIcon width={30} height={30} data-tip data-for={id} />
      <ReactTooltip id={id} type="info">
        <span>{text}</span>
      </ReactTooltip>
    </div>
  );
};
