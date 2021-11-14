import { useQuery } from '../../shared/utilities';

const ErrorPage = () => {
  const query = useQuery();
  return (
    <>
      You on a wrong page son {query.get('status')}: {query.get('message')}
    </>
  );
};

export default ErrorPage;
