import { Helmet } from 'react-helmet-async';

export const ReactHelmet = ({ title = '' }) => {
  return (
    <Helmet>
      <title>{`Dutiful${title ? `- ${title}` : ''}`}</title>
      <meta name-="description" content="Scheduling and Duty Management Application" />
    </Helmet>
  );
};
