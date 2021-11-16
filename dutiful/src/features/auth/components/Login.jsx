import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import _ from 'lodash';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { deepPurple } from '@material-ui/core/colors';

import { Password, Textfield } from 'components/textfield';
import { Form } from 'components/form';
import { Button } from 'components/button';
import { StatusAlert } from 'components/alert/StatusAlert';
import { useAuth } from 'lib/auth';
import { loginCredStorage } from 'utils/storage';

// TODO make error's disappearance not affect the page layout

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string().required('Password is required'),
});

export const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState({});

  async function onSubmit(creds) {
    try {
      await login(creds);
      if (remember) loginCredStorage.setCredentials(creds);
      else loginCredStorage.clearCredentials();
      navigate('/');
    } catch (error) {
      console.error(error.response);
      setError(error.response);
    }
  }

  const defaultValues = loginCredStorage.getCredentials();

  useEffect(() => {
    if (defaultValues) setRemember(true);
    return;
  }, [defaultValues]);

  return (
    <Container className={classes.root} component="main" maxWidth="xs">
      <div className={classes.box}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h4">
          Dutiful Login
        </Typography>
        <div className={clsx(classes.error, _.isEmpty(error) && classes.hidden)}>
          <StatusAlert error={error} />
        </div>

        <Form
          className={classes.form}
          schema={validationSchema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        >
          {({ register, formState }) => {
            return (
              <>
                <Textfield
                  className={classes.textfield}
                  required
                  name="email"
                  label="Email"
                  error={!!formState?.errors.email}
                  {...register('email')}
                />
                <Typography variant="inherit" color="textSecondary">
                  {formState?.errors.email?.message}
                </Typography>
                <Password
                  className={classes.textfield}
                  required
                  name="password"
                  label="Password"
                  error={!!formState?.errors.password}
                  {...register('password')}
                />
                <Typography variant="inherit" color="textSecondary">
                  {formState?.errors.password?.message}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox value={remember} color="primary" checked={remember} />
                  }
                  label="Remember me"
                  onChange={() => setRemember(!remember)}
                />
                <Button
                  isLoading={isLoggingIn}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  type="submit"
                >
                  Sign In
                </Button>
              </>
            );
          }}
        </Form>
        <Grid container>
          <Grid item xs>
            <Link to="/auth/forgotPassword">Forgot password</Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  box: {
    marginTop: -theme.spacing(30),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: '20%',
  },
  form: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  hidden: {
    visibility: 'hidden',
  },
  avatar: {
    backgroundColor: deepPurple[500],
  },
  textfield: {
    marginTop: theme.spacing(3),
  },
}));

export default Login;
