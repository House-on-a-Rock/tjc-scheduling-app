import { makeStyles, Popover } from '@material-ui/core';
import { cloneElement, Children, forwardRef } from 'react';

export const TableSelect = forwardRef(({ id, value, children, ...props }, ref) => {
  const { onClick, open, onClose } = props;
  const childIdx = children.findIndex((child) => child.props.value === value);

  const SelectedElement = children[childIdx];
  const PoppinElements = <ul>{manageChildrenProps(children, { onClick: onClose })}</ul>;

  return (
    <>
      {SelectedElement}
      <Popover
        id={open ? `table-select-${id}` : undefined}
        open={open}
        anchorEl={ref?.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={onClose}
        TransitionProps={{ timeout: { enter: 0, exit: 0 } }}
      >
        {PoppinElements}
      </Popover>
    </>
  );
});

function manageChildrenProps(children, props) {
  let elements = Children.toArray(children);
  return elements.map((element) => cloneElement(element, props));
}
const Paper = () => {};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: ' table-cell',
    padding: theme.spacing(1),
    fontSize: '0.875rem',
    textAlign: 'left',
    lineHeight: 1.43,

    // vertical-align: inherit;
  },
}));
