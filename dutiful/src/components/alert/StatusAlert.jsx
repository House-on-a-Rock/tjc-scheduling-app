import { Alert } from './Alert';
import _ from 'lodash';

export const StatusAlert = ({ error }) => {
  console.log('StatusAlert', error);
  return (
    !_.isEmpty(error) && (
      <Alert title={`${error.status} ${error.statusText}`}>{error.data.message}</Alert>
    )
  );
};
