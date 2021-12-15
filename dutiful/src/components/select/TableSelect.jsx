import { makeStyles, Popover } from '@material-ui/core';
import { Spacing } from 'components/spacing';
import { cloneElement, Children, forwardRef } from 'react';

export const TableSelect = forwardRef(
  ({ id, value, children, onChange, ...props }, ref) => {
    const classes = useStyles();
    const { onClick, open, onClose } = props;

    const childIdx = children.findIndex((child) => child.props.value === value);

    function handleClick(value) {
      onClick();
    }

    const SelectedElement = children[childIdx];
    const PoppinElements = manageChildrenProps(children, { onClick: handleClick });

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
          PaperProps={{ className: classes.paper }}
        >
          <div className={classes.popupTopBar}>{SelectedElement}</div>
          {/* // TODO  abstract to a reusable component */}
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
            }}
          >
            <span
              style={{
                color: 'rgba(55, 53, 47, 0.6)',
                fontSize: 12,
              }}
            >
              Select an option
            </span>
            <Spacing size={1} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: 'fit-content',
              }}
            >
              {PoppinElements}
            </div>
          </div>
        </Popover>
      </>
    );
  },
);

function manageChildrenProps(children, props) {
  let elements = Children.toArray(children);
  return elements.map((element) => cloneElement(element, props));
}

const useStyles = makeStyles((theme) => ({
  paper: { borderRadius: '2px' },
  popupTopBar: {
    background: 'rgba(242, 241, 238, 0.6)',
    paddingLeft: theme.spacing(2),
    height: theme.spacing(5.5),
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    width: theme.spacing(25),
  },
}));
