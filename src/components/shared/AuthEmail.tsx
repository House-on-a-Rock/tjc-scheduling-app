import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

// Custom
import { TransitionsModal } from './TransitionsModal';
import { EmailForm } from './EmailForm';
import { sendAuthEmail } from '../../store/actions';
import { HttpResponseStatus, EmailState } from '../../shared/types/models';
import { useQuery, isValidEmail } from '../../shared/utilities/helperFunctions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(25),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonRow: { display: 'flex', justifyContent: 'space-between' },
}));

interface AuthEmailProps {
  data: AuthEmailDataProps;
}

interface AuthEmailDataProps {
  history: boolean;
  title: string;
  description?: string;
  button: string;
}

export const AuthEmail = ({ data }: AuthEmailProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [email, setEmail] = useState<EmailState>({
    value: '',
    valid: true,
    message: null,
  });
  const [openModal, setOpenModal] = useState(false);

  // const query = JSON.parse(useQuery().get('message') ?? '');
  // const errorMessage: HttpResponseStatus = query && {
  //   status: query?.status,
  //   message: query?.message,
  // };

  function handleClick(event?: FormEvent<HTMLFormElement>): void {
    event?.preventDefault();
    setEmail({ ...email, valid: true, message: '' });
    if (isValidEmail(email.value)) {
      dispatch(sendAuthEmail(email.value));
      setOpenModal(true);
    } else {
      if (!isValidEmail(email.value))
        setEmail({
          ...email,
          valid: false,
          message: 'Enter a valid email address.',
        });
      if (email.value.length === 0)
        setEmail({
          ...email,
          valid: false,
          message: 'Please enter an email address.',
        });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <TransitionsModal
        open={openModal}
        setOpen={setOpenModal}
        description="A recovery email has been sent to your email"
      />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {data.title}
        </Typography>
        {data.description && <Typography>{data.description}</Typography>}
        {/* {errorMessage && (
          <Typography>{`${errorMessage.status}: ${errorMessage.message}`}</Typography>
        )} */}
        <form className={classes.form} noValidate onSubmit={handleClick}>
          <EmailForm
            name="email"
            label="Email Address"
            email={email}
            handleEmail={setEmail}
          />
        </form>
      </div>
      <div className={classes.buttonRow}>
        <Button onClick={() => handleClick()}>{data.button}</Button>
        {data.history && <Button onClick={() => history.back()}>Remember it?</Button>}
      </div>
    </Container>
  );
};
