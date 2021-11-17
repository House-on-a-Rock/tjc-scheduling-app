import { Link } from 'react-router-dom';

// Material UI components
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

// TODO style Transition Modal to something more aesthetic pleasing
// TODO abstract Forgot Password logic out

export const TransitionsModal = ({ open, setOpen, description, status }) => {
  const classes = useStyles();
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
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            className={classes.paper}
          >
            <Grid item className={classes.title} xs={6}>
              <h2 id="transition-modal-title">Transition modal</h2>
            </Grid>
            <Grid item className={classes.content} xs={8}>
              <div style={{ height: '80%' }}>
                {status ? (
                  <CircularProgress />
                ) : (
                  <>
                    <p>{description}</p>
                  </>
                )}
              </div>
            </Grid>
            <Grid item>
              <Button component={Link} to="/auth/login">
                Click to go back to login page
              </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: '60%',
      minHeight: theme.spacing(35),
    },
    title: {},
    content: { height: '100%' },
  }),
);
