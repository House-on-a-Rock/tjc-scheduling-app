import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from 'lib/auth';
import { queryClient } from 'lib/react-query';
import { Spinner } from 'components/loading';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from 'themes';

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">{'Ooops, something went wrong :( '}</h2>
    </div>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <Suspense fallback={<Spinner size="xl" />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
            <AuthProvider>
              <ThemeProvider theme={theme}>
                <Router>{children}</Router>
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
