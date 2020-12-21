import React from 'react';
import { Link } from 'react-router-dom';

// Material UI components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { useSelector } from '../../shared/utilities/useSelector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

interface TransitionsModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  description: string;
}

export const TransitionsModal = ({
  open,
  setOpen,
  description,
}: TransitionsModalProps) => {
  const classes = useStyles();
  const status = useSelector(({ load }) => load.loadStatus.AUTH);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            {status === 'LOADING' ? (
              <CircularProgress />
            ) : (
              status === 'LOADED' && (
                <>
                  <p>{description}</p>
                  <Button component={Link} to="/auth/login">
                    Click to go back to login page
                  </Button>
                </>
              )
            )}
          </div>
        </Fade>
      </Modal>
    </>
  );
};
