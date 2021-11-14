import { useState } from 'react';
import zxcvbn from 'zxcvbn';

// Material UI
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

// Custom
import TransitionsModal from '../shared/TransitionsModal';
import { PasswordStrengthMeter, PasswordForm } from '../FormControl';
import { useQuery } from '../../shared/utilities/helperFunctions';
import { sendNewPassword } from '../../apis';

const ResetPassword = () => {
  const classes = useStyles();
  const query = useQuery();
  const token = query.get('token') ?? '';

  const [password, setPassword] = useState({
    value: '',
    valid: true,
    visible: false,
    message: null,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    valid: true,
    visible: false,
    message: null,
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(null);
  const testedResult = zxcvbn(password.value);

  function onHandlePassword(newPassword) {
    if (!password.valid) {
      setPassword({
        ...password,
        valid: true,
        message: '',
        value: newPassword.value,
      });
    } else setPassword({ ...password, value: newPassword.value });
  }
  function onHandleConfirmPassword(newConfirmPassword) {
    if (!confirmPassword.valid)
      setConfirmPassword({
        ...confirmPassword,
        valid: true,
        message: '',
        value: newConfirmPassword.value,
      });
    else setConfirmPassword({ ...confirmPassword, value: newConfirmPassword.value });
  }

  function createPasswordLabel(result) {
    switch (result.score) {
      case 0:
        return 'Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  }
  async function submitNewPassword(newPasswordValue, confirmPasswordValue, event) {
    event?.preventDefault();
    setLoading('LOADING');
    if (newPasswordValue.length === 0)
      setPassword({
        ...password,
        valid: false,
        message: 'Please enter a password',
      });
    if (confirmPasswordValue.length === 0)
      setConfirmPassword({
        ...confirmPassword,
        valid: false,
        message: 'Please enter a password',
      });
    else if (newPasswordValue !== confirmPasswordValue) {
      setPasswordMessage(`Passwords aren't the same`);
      setPassword({
        ...password,
        value: '',
      });
      setConfirmPassword({
        ...confirmPassword,
        value: '',
      });
    } else if (createPasswordLabel(testedResult) === 'Weak') {
      setPassword({ ...password, value: '' });
      setConfirmPassword({
        ...confirmPassword,
        value: '',
      });
      setPasswordMessage('Please enter a stronger password');
    } else {
      setOpenModal(true);
      setPassword({ ...password, value: '', valid: true, message: '' });

      setConfirmPassword({
        ...confirmPassword,
        value: '',
        valid: true,
        message: '',
      });
      const { status, statusText } = await sendNewPassword(token, newPasswordValue);
      if (status < 300) setLoading('LOADED');
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <TransitionsModal
        open={openModal}
        setOpen={setOpenModal}
        description={`You've successfully changed your password!`}
        status={loading}
      />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {passwordMessage ? (
          <Typography color="error">{passwordMessage}</Typography>
        ) : (
          <Typography>Type in your new password</Typography>
        )}

        <form
          className={classes.form}
          noValidate
          onSubmit={(event) =>
            submitNewPassword(password.value, confirmPassword.value, event)
          }
        >
          <PasswordForm
            name="password"
            label="New Password"
            password={password}
            handlePassword={onHandlePassword}
          />
          <PasswordStrengthMeter
            password={password.value}
            strength={createPasswordLabel(testedResult)}
            testedResult={testedResult}
          />
          <PasswordForm
            name="confirm_password"
            label="Confirm Password"
            password={confirmPassword}
            handlePassword={onHandleConfirmPassword}
          />
          <div className={classes.buttonRow}>
            <Button
              type="submit"
              onClick={() => submitNewPassword(password.value, confirmPassword.value)}
            >
              Reset Password
            </Button>
          </div>
        </form>
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

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
}));

export default ResetPassword;
