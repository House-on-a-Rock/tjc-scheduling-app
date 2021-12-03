import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress, Fade, Backdrop, Modal } from '@material-ui/core';
import { LinkButton } from 'components/button';

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
                {status ? <CircularProgress /> : <p>{description}</p>}
              </div>
            </Grid>
            <Grid item>
              <LinkButton to="/auth/login">Click to go back to login page</LinkButton>
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
