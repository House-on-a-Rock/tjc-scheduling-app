import MuiAlert from '@material-ui/lab/Alert';
import MuiAlertTitle from '@material-ui/lab/AlertTitle';

export const Alert = ({ severity = 'error', title, children }) => {
  return (
    <MuiAlert severity={severity}>
      <MuiAlertTitle>
        <strong>{title}</strong>
      </MuiAlertTitle>
      {children}
    </MuiAlert>
  );
};
