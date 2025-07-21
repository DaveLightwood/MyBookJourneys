import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/main-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AuthWrapper } from '@/features/auth';

const BooksList = lazy(() => import('@/features/books').then(module => ({ default: module.BooksList })));
const BookForm = lazy(() => import('@/features/books').then(module => ({ default: module.BookForm })));

export const AppRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route 
            path="books/*" 
            element={
                <BooksRoutes />
            } 
        />
    </Route>
    </Routes>
  );
};

const BooksRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<BooksList />} />
        <Route
            path="new"
            element={
                <ProtectedRoute>
                    <BookForm />
                </ProtectedRoute>
            }
        />
        <Route
            path=":bookId/edit"
            element={
                <ProtectedRoute>
                    <BookForm />
                </ProtectedRoute>
            }
        />
      </Routes>
    </Suspense>
  );
};