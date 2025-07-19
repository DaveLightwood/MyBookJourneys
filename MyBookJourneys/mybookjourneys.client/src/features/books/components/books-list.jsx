import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBooksQuery, useSearchBooksQuery } from '../api/books-api';
import { BookCard } from './book-card';

export const BooksList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [useSearch, setUseSearch] = useState(false);

  const { 
    data: allBooks, 
    isLoading: isLoadingAll, 
    error: allError 
  } = useGetBooksQuery(undefined, {
    skip: useSearch,
  });

  const { 
    data: searchResults, 
    isLoading: isSearching, 
    error: searchError 
  } = useSearchBooksQuery(searchTerm, {
    skip: !useSearch || !searchTerm,
  });

  const books = useSearch ? searchResults : allBooks;
  const isLoading = useSearch ? isSearching : isLoadingAll;
  const error = useSearch ? searchError : allError;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setUseSearch(true);
    } else {
      setUseSearch(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setUseSearch(false);
  };

  const handleAddBook = () => {
    navigate('/books/new');
  };

  if (isLoading) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return <div className="error">Error loading books: {error.message}</div>;
  }

  return (
    <div className="books-list-container">
      <div className="books-header">
        <h2>My Books</h2>
        <button onClick={handleAddBook} className="btn-primary">
          Add New Book
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn-search">
          Search
        </button>
        {useSearch && (
          <button 
            type="button" 
            onClick={handleClearSearch} 
            className="btn-clear"
          >
            Clear
          </button>
        )}
      </form>

      {books && books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="no-books">
          {useSearch 
            ? 'No books found matching your search.'
            : 'No books in your collection yet. Click "Add New Book" to get started!'}
        </div>
      )}
    </div>
  );
};