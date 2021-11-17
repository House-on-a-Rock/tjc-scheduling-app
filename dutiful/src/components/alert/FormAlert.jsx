import { Typography } from '@material-ui/core';
import { Alert } from './Alert';

export const FormAlert = ({ errors, title }) => {
  const formErrors = Object.keys(errors).map((key) => errors[key]);
  return (
    !!formErrors.length && (
      <Alert title={title}>
        {formErrors.map((error, idx) => {
          return <ErrorField key={idx} error={error} idx={idx} />;
        })}
      </Alert>
    )
  );
};

const ErrorField = ({ error, idx }) => {
  const { message } = error;
  return (
    <Typography key={`error-${idx} `}>
      {idx + 1}: {message}
    </Typography>
  );
};
