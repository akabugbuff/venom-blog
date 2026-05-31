import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </HashRouter>
  );
}
