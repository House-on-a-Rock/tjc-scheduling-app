import { Helmet as Helm } from 'react-helmet-async';

export const Helmet = ({ title = '' }) => {
  return (
    <Helm>
      <title>{`Dutiful${title ? ` - ${title}` : ''}`}</title>
      <meta name-="description" content="Scheduling and Duty Management Application" />
    </Helm>
  );
};
