import { Alert } from './Alert';
import _ from 'lodash';

export const StatusAlert = ({ error }) =>
  !_.isEmpty(error) && (
    <Alert title={`${error.status} ${error.statusText}`}>{error.data.message}</Alert>
  );
