import { useNavigate } from 'react-router-dom';
import { useDeleteBookMutation } from '../api/books-api';

export const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleEdit = () => {
    navigate(`/books/${book.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await deleteBook(book.id).unwrap();
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  return (
    <div className="book-card">
      {book.imageUrl && (
        <img 
          src={book.imageUrl} 
          alt={book.title} 
          className="book-cover"
        />
      )}
      <div className="book-details">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p className="isbn">ISBN: {book.isbn}</p>
        <div className="book-meta">
          <span className="genre">{book.genre}</span>
          <span className="status">{book.readingStatus}</span>
          {book.rating && <span className="rating">★ {book.rating}/5</span>}
        </div>
        {book.notes && <p className="notes">{book.notes}</p>}
        <div className="book-actions">
          <button onClick={handleEdit} className="btn-edit">
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="btn-delete"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};