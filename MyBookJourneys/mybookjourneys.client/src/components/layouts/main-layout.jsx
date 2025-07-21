import { Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { ProfileData, LogoutButton } from '@/features/auth';

export const MainLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="main-layout">
      <header className="header">
        <nav className="nav">
          <h1>My Book Journeys</h1>
          {isAuthenticated && (
            <div className="nav-auth">
              <ProfileData />
              <LogoutButton />
            </div>
          )}
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};