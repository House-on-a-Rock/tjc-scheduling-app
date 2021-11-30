import { AppRoutes } from 'routes';
import { AppProvider } from 'providers';
import { Helmet } from 'components/helmet';

function App() {
  return (
    <AppProvider>
      <Helmet />
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
