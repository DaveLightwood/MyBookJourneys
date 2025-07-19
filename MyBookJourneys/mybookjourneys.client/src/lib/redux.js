import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { booksApi } from '@/features/books/api/books-api';

export const createStore = (options = {}) => {
  const store = configureStore({
    reducer: {
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
    ...options,
  });

  setupListeners(store.dispatch);

  return store;
};

export const store = createStore();