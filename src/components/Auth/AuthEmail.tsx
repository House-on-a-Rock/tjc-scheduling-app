import React, { useState, FormEvent } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

// Custom
import { TransitionsModal } from '../shared/TransitionsModal';
import { EmailForm } from '../FormControl';
import { HttpResponseStatus, EmailState } from '../../shared/types/models';
import { useQuery, isValidEmail } from '../../shared/utilities/helperFunctions';
import history from '../../shared/services/history';
import { recoverEmail } from '../../query/apis';

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
  const classes = useStyles();

  const [email, setEmail] = useState<EmailState>({
    value: '',
    valid: true,
    message: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const [loadingState, setLoadingState] = useState(null);

  const query = JSON.parse(useQuery().get('message'));
  const error: HttpResponseStatus = query && {
    status: query?.status,
    message: query?.message,
  };

  async function handleClick(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setEmail({ ...email, valid: true, message: '' });
    if (isValidEmail(email.value)) {
      setLoadingState('LOADING');
      await recoverEmail(email.value);
      setLoadingState('LOADED');
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
        status={loadingState}
      />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {data.title}
        </Typography>
        {data.description && <Typography>{data.description}</Typography>}
        {error && <Typography>{`${error.status}: ${error.message}`}</Typography>}
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
        {data.history && <Button onClick={() => history.goBack()}>Remember it?</Button>}
      </div>
    </Container>
  );
};

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
