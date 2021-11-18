import * as Yup from 'yup';
import _ from 'lodash';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Container, makeStyles, Typography } from '@material-ui/core';
import { StatusAlert } from 'components/alert/StatusAlert';
import { Button } from 'components/button';
import { Form } from 'components/form';
import { TransitionsModal } from 'components/modal';
import { Textfield } from 'components/textfield';
import { recoverEmail } from 'features/auth/api';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
});

export const ForgotPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const title = 'Forgot Password';
  const description =
    'Lost your password? Please enter your email address. You will receive a link to create a new password via email.';
  const button = 'Reset Password';
  const [error, setError] = useState({});

  async function handleSubmit(email) {
    setOpen(true);
    setSubmitting(true);
    try {
      await recoverEmail(email);
      setSubmitting(false);
      setError({});
    } catch (error) {
      console.error(error.response);
      setError(error.response);
      setSubmitting(false);
    }
  }
  return (
    <Container className={classes.root} component="main" maxWidth="xs">
      <TransitionsModal
        open={open}
        setOpen={setOpen}
        description="A recovery email has been sent to your email"
        status={submitting}
      />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        {description && <Typography>{description}</Typography>}
        <div className={clsx(classes.error, _.isEmpty(error) && classes.hidden)}>
          <StatusAlert error={error} />
        </div>
        <Form className={classes.form} schema={validationSchema} onSubmit={handleSubmit}>
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
                <div className={classes.buttonRow}>
                  <Button type="submit" variant="contained" color="primary">
                    {button}
                  </Button>
                  <Button onClick={() => navigate(-1)}>Remember it?</Button>
                </div>
              </>
            );
          }}
        </Form>
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
  paper: {
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
    marginTop: theme.spacing(3),
  },
  textfield: {
    margin: `${theme.spacing(1.5)}px 0`,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
