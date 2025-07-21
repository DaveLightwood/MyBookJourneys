import { useIsAuthenticated } from '@azure/msal-react';
import { LoginButton } from '@/features/auth';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="protected-route-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please sign in to access this page.</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return children;
};