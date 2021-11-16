import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { Password, Textfield } from 'components/textfield';
import { Form } from 'components/form';
import { Button } from 'components/button';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
});

export const Login = () => {
  const classes = useStyles();

  function onSubmit(data) {
    console.log({ data });
  }

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Typography component="h1" variant="h5">
          Welcome to Dutiful
        </Typography>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Form schema={validationSchema} onSubmit={onSubmit} className={classes.form}>
          {({ register, formState }) => (
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
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
              >
                Sign In
              </Button>
            </>
          )}
        </Form>
      </div>

      <Grid container>
        <Grid item xs>
          <RouterLink to="/auth/forgotPassword">Forgot password</RouterLink>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '50%' },
  box: {
    marginTop: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
