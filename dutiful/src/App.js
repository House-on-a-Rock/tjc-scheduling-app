import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from 'react-query';
import Helmet from 'react-helmet';
import { AppRouter } from 'routes';
// import 'assets/favicon.ico';

function App() {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false,
  //     },
  //     mutations: {},
  //   },
  // });

  //  <QueryClientProvider client={queryClient}>
  // <PrivateRoute redirection="/auth/login" condition="token" path="/">
  //   <Main />
  // </PrivateRoute>
  // </QueryClientProvider>

  return (
    <>
      <Helmet>
        <title>Dutiful</title>
        <meta name-="description" content="Scheduling and Duty Management Application" />
      </Helmet>
      <AppRouter />
    </>
  );
}

export default App;
