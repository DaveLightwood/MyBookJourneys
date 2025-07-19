import { AppProvider } from './providers/app-provider';
import { AppRoutes } from './routes';
import { Suspense } from 'react';

export const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
};