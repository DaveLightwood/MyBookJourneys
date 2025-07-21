import { useIsAuthenticated } from '@azure/msal-react';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';
import { ProfileData } from './profile-data';

export const AuthWrapper = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <h2>Please sign in to access MyBookJourneys</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="authenticated-app">
      <div className="auth-header">
        <ProfileData />
        <LogoutButton />
      </div>
      {children}
    </div>
  );
};