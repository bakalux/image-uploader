import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/auth-page';
import { HomePage } from './pages/home-page';
import { ProtectedRoute } from './components/protected-route';
import { Layout } from './components/layout';

function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
