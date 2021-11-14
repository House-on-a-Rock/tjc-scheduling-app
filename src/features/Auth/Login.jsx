import React, { useState, useContext } from 'react';
import axios from 'axios';
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
// import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import { Copyright } from '../shared';
import { PasswordForm, ValidatedTextField } from '../FormControl';
import history from '../../shared/services/history';
import {
  setLocalStorageState,
  removeLocalStorageState,
  getLocalStorageItem,
  isValidEmail,
} from '../../shared/utilities';
import AuthContext from '../../shared/services/AuthContext';
import { authenticateLogin } from '../../apis';

const Login = () => {
  const classes = useStyles();
  const rememberedEmailState = {
    value: getLocalStorageItem('rmmbrshvs')?.email,
    valid: true,
    message: '',
  };
  const rememberedPasswordState = {
    value: getLocalStorageItem('rmmbrshvs')?.password,
    valid: true,
    message: '',
    visible: false,
  };

  const [remembered, setRemembered] = useState(!!getLocalStorageItem('rmmbrshvs'));
  const [email, setEmail] = useState(
    rememberedEmailState.value
      ? rememberedEmailState
      : { value: '', valid: true, message: null },
  );
  const [password, setPassword] = useState(
    rememberedPasswordState.value
      ? rememberedPasswordState
      : {
          value: '',
          valid: true,
          visible: false,
          message: null,
        },
  );

  async function handleLogin(event) {
    event?.preventDefault();
    setEmail({ ...email, valid: true, message: '' });
    setPassword({ ...password, valid: true, message: '' });
    if (isValidEmail(email.value) && password.value.length) {
      const res = await authenticateLogin(email.value, password.value);
      const { data, status, statusText } = res;
      const { token } = data;
      if (token) {
        axios.defaults.headers.common.authorization = token;
        setLocalStorageState('access_token', token);
        history.push('/');
        loginHandler();
      }
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

  const auth = useContext(AuthContext);
  const loginHandler = () => {
    auth.login();
  };

  if (auth.isLoggedIn) {
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
        {/* {error && (
          <Typography color="error">{`${error?.status}: ${error?.message}`}</Typography>
        )} */}

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
            Sign In
            {/* {loading ? <CircularProgress /> : 'Sign In'} */}
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

export default Login;
