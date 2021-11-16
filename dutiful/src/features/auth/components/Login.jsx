import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import _ from 'lodash';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';

import { Password, Textfield } from 'components/textfield';
import { Form } from 'components/form';
import { Button } from 'components/button';
import { useAuth } from 'lib/auth';
import { loginCredStorage } from 'utils/storage';
import { StatusAlert } from 'components/alert/StatusAlert';
import clsx from 'clsx';

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

  async function onSubmit(data) {
    try {
      const response = await login(data);
      if (remember) loginCredStorage.setCredentials(data);
      else loginCredStorage.clearCredentials();
      setError({});
    } catch (error) {
      console.log(error.response);
      setError(error.response);
    }
  }

  const defaultValues = loginCredStorage.getCredentials();

  useEffect(() => defaultValues && setRemember(true), []);

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <div className={clsx(classes.error, _.isEmpty(error) && classes.hidden)}>
          <StatusAlert error={error} />
        </div>

        <Typography component="h1" variant="h5">
          Welcome to Dutiful
        </Typography>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
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
                  required
                  name="email"
                  label="Email"
                  margin="dense"
                  error={formState?.errors.email}
                  {...register('email')}
                />
                <Typography variant="inherit" color="textSecondary">
                  {formState?.errors.email?.message}
                </Typography>
                <Password
                  required
                  name="password"
                  label="Password"
                  margin="dense"
                  error={formState?.errors.password}
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
            <RouterLink to="/auth/forgotPassword">Forgot password</RouterLink>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  box: {
    marginTop: -theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    width: '100%',
    marginBottom: theme.spacing(3),
    height: '20%',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

export default Login;

// async function handleLogin(event) {
//   event?.preventDefault();
//   setEmail({ ...email, valid: true, message: '' });
//   setPassword({ ...password, valid: true, message: '' });
//   if (isValidEmail(email.value) && password.value.length) {
//     const res = await authenticateLogin(email.value, password.value);
//     const { data, status, statusText } = res;
//     const { token } = data;
//     if (token) {
//       axios.defaults.headers.common.authorization = token;
//       setLocalStorageState('access_token', token);
//       history.push('/');
//       loginHandler();
//     }
//   } else {
//     if (password.value.length === 0)
//       setPassword({
//         ...password,
//         valid: false,
//         message: 'Please enter a password',
//       });
//     if (!isValidEmail(email.value)) {
//       setEmail({
//         ...email,
//         valid: false,
//         message: 'Enter a valid email address.',
//       });
//     }
//     if (email.value.length === 0)
//       setEmail({
//         ...email,
//         valid: false,
//         message: 'Please enter an email address.',
//       });
//   }
// }

// const rememberedEmailState = {
//   value: getLocalStorageItem('rmmbrshvs')?.email,
//   valid: true,
//   message: '',
// };
// const rememberedPasswordState = {
//   value: getLocalStorageItem('rmmbrshvs')?.password,
//   valid: true,
//   message: '',
//   visible: false,
// };

// const [remembered, setRemembered] = useState(!!getLocalStorageItem('rmmbrshvs'));
// const [email, setEmail] = useState(
//   rememberedEmailState.value
//     ? rememberedEmailState
//     : { value: '', valid: true, message: null },
// );
// const [password, setPassword] = useState(
//   rememberedPasswordState.value
//     ? rememberedPasswordState
//     : {
//         value: '',
//         valid: true,
//         visible: false,
//         message: null,
//       },
// );
