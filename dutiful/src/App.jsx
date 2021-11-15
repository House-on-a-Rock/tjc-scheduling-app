import { AppRoutes } from 'routes';
import { AppProvider } from 'providers';
import { ReactHelmet } from 'components/helmet';

function App() {
  return (
    <>
      <AppProvider>
        <ReactHelmet />
        <AppRoutes />
      </AppProvider>
    </>
  );
}

export default App;
