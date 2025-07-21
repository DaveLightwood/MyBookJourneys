import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/lib/redux';
import { AuthProvider } from './auth-provider';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
};