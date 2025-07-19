import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/lib/redux';

export const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};