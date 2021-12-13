import { makeStyles, Popover } from '@material-ui/core';
import { cloneElement, Children, forwardRef } from 'react';
import { usePortalRef } from 'hooks';

export const TableSelect = forwardRef(({ value, children }, ref) => {
  const { open, anchorRef, handleClose, handleToggle } = usePortalRef({ ref });
  const idx = children.findIndex((child) => child.props.item.value === value);
  const id = open ? 'simple-popover' : undefined;

  const SelectedElement = manageChildrenProps(children[idx], {
    onClick: () => handleToggle(),
  });
  const PoppinElements = (
    <ul>{manageChildrenProps(children, { onClick: handleClose })}</ul>
  );

  return (
    <>
      {SelectedElement}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorRef?.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handleClose}
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
