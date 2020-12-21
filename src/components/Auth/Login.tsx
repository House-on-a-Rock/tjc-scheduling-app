import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link as RouterLink, Redirect } from 'react-router-dom';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import { Copyright } from '../shared/Copyright';
import { PasswordForm, ValidatedTextField } from '../shared';

// Actions
import { checkCredentials } from '../../store/actions';
import { RootState } from '../../store';

// Types
import { HttpResponseStatus, PasswordState, EmailState } from '../../shared/types/models';
import {
  setLocalStorageState,
  removeLocalStorageState,
  getLocalStorageItem,
  isValidEmail,
} from '../../shared/utilities';
import { EmailForm } from '../shared/EmailForm';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      bottom: 0,
    },
  },
  paper: {
    marginTop: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const rememberedEmailState: EmailState = {
    value: getLocalStorageItem('rmmbrshvs')?.email,
    valid: true,
    message: '',
  };
  const rememberedPasswordState: PasswordState = {
    value: getLocalStorageItem('rmmbrshvs')?.password,
    valid: true,
    message: '',
    visible: false,
  };

  const { isLoggedIn, loading, response: error } = useSelector(
    ({ auth }: RootState) => auth,
  );

  const [remembered, setRemembered] = useState<boolean>(
    !!getLocalStorageItem('rmmbrshvs'),
  );
  const [email, setEmail] = useState<EmailState>(
    rememberedEmailState.value
      ? rememberedEmailState
      : { value: '', valid: true, message: null },
  );
  const [password, setPassword] = useState<PasswordState>(
    rememberedPasswordState.value
      ? rememberedPasswordState
      : {
          value: '',
          valid: true,
          visible: false,
          message: null,
        },
  );

  function handleLogin(event?: FormEvent<HTMLFormElement>): void {
    event?.preventDefault();
    setEmail({ ...email, valid: true, message: '' });
    setPassword({ ...password, valid: true, message: '' });
    if (isValidEmail(email.value) && password.value.length) {
      dispatch(checkCredentials(email.value, password.value));
    } else {
      if (password.value.length === 0)
        setPassword({
          ...password,
          valid: false,
          message: 'Please enter a password',
        });
      if (!isValidEmail(email.value)) {
        setEmail({
          ...email,
          valid: false,
          message: 'Enter a valid email address.',
        });
      }
      if (email.value.length === 0)
        setEmail({
          ...email,
          valid: false,
          message: 'Please enter an email address.',
        });
    }
  }

  if (isLoggedIn) {
    if (remembered)
      setLocalStorageState('rmmbrshvs', {
        email: email.value,
        password: password.value,
      });
    else removeLocalStorageState('auth');
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Typography color="error">{`${error?.status}: ${error?.message}`}</Typography>
        )}

        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <ValidatedTextField
            name="email"
            label="Email Address"
            input={email}
            handleChange={setEmail}
            type="email"
            autoComplete="email"
          />
          <PasswordForm
            name="Password"
            label="Password"
            password={password}
            handlePassword={setPassword}
          />

          <FormControlLabel
            control={<Checkbox value={remembered} color="primary" checked={remembered} />}
            label="Remember me"
            onChange={() => setRemembered(!remembered)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            type="submit"
            onClick={() => handleLogin()}
          >
            {loading ? <CircularProgress /> : 'Sign In'}
          </Button>
        </form>
      </div>

      <Grid container>
        <Grid item xs>
          <RouterLink to="/auth/forgotPassword">Forgot password</RouterLink>
        </Grid>
      </Grid>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
