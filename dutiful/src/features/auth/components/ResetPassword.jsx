import * as Yup from 'yup';
import _ from 'lodash';
import clsx from 'clsx';
import { useState } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

// Custom
import { Form } from 'components/form';
import { Password } from 'components/textfield';
import { TransitionsModal } from 'components/modal';
import { PasswordStrengthMeter } from 'components/elements';
import { StatusAlert } from 'components/alert/StatusAlert';
import { Button } from 'components/button';

// TODO render form alerts only "onSubmit"

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password is too short - should be 6 chars minimum.')
    .max(40, 'Password is too long.'),
  confirmPassword: Yup.string()
    .required('Confirmation password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const ResetPassword = () => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    setError(null);
    if (event) setLoading(true);
    setLoading(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <TransitionsModal
        open={openModal}
        setOpen={setOpenModal}
        description="You've successfully changed your password!"
        status={loading}
      />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Typography>Type in your new password</Typography>
        <div className={clsx(classes.error, _.isEmpty(error) && classes.hidden)}>
          <StatusAlert error={error} />
        </div>
        <Form
          className={classes.form}
          schema={validationSchema}
          onSubmit={handleSubmit}
          defaultValues={{ password: '', confirmPassword: '' }}
        >
          {({ register, formState, watch }) => {
            return (
              <>
                <Password
                  className={classes.textfield}
                  required
                  name="password"
                  label="Password"
                  error={!!formState?.errors.password}
                  {...register('password')}
                />
                <PasswordStrengthMeter password={watch('password')} />
                <Password
                  className={classes.textfield}
                  required
                  name="confirmPassword"
                  label="Confirm Password"
                  error={!!formState?.errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  type="submit"
                >
                  Reset Password
                </Button>
              </>
            );
          }}
        </Form>
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
  form: {
    width: '100%',
  },
  textfield: {
    margin: `${theme.spacing(1.5)}px 0`,
  },
}));
