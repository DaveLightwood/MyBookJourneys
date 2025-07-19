import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="header">
        <nav className="nav">
          <h1>My Book Journeys</h1>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};