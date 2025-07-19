import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  useGetBookQuery, 
  useCreateBookMutation, 
  useUpdateBookMutation,
  useUploadBookImageMutation 
} from '../api/books-api';
import { BookGenre, ReadingStatus } from '../types';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').max(200),
  author: Yup.string().required('Author is required').max(100),
  isbn: Yup.string().max(13),
  genre: Yup.string().oneOf(Object.values(BookGenre)).required('Genre is required'),
  publicationYear: Yup.number()
    .min(1000, 'Year must be after 1000')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  pageCount: Yup.number().min(1, 'Page count must be at least 1'),
  readingStatus: Yup.string().oneOf(Object.values(ReadingStatus)).required('Status is required'),
  rating: Yup.number().min(1).max(5),
  notes: Yup.string().max(1000),
});

export const BookForm = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const isEdit = !!bookId;
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: book, isLoading } = useGetBookQuery(bookId, {
    skip: !isEdit,
  });

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [uploadImage] = useUploadBookImageMutation();

  useEffect(() => {
    if (book?.imageUrl) {
      setImagePreview(book.imageUrl);
    }
  }, [book]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      let result;
      
      if (isEdit) {
        result = await updateBook({ id: bookId, ...values }).unwrap();
      } else {
        result = await createBook(values).unwrap();
      }

      if (imageFile && result.id) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await uploadImage({ id: result.id, formData }).unwrap();
      }

      navigate('/books');
    } catch (error) {
      console.error('Failed to save book:', error);
      alert('Failed to save book. Please try again.');
    }
  };

  if (isEdit && isLoading) {
    return <div className="loading">Loading book...</div>;
  }

  const initialValues = book || {
    title: '',
    author: '',
    isbn: '',
    genre: BookGenre.OTHER,
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    readingStatus: ReadingStatus.WANT_TO_READ,
    rating: null,
    notes: '',
  };

  return (
    <div className="book-form-container">
      <h2>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="book-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <Field name="title" type="text" className="form-control" />
              {errors.title && touched.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <Field name="author" type="text" className="form-control" />
              {errors.author && touched.author && (
                <div className="error-message">{errors.author}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <Field name="isbn" type="text" className="form-control" />
              {errors.isbn && touched.isbn && (
                <div className="error-message">{errors.isbn}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="genre">Genre *</label>
                <Field name="genre" as="select" className="form-control">
                  {Object.entries(BookGenre).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
                {errors.genre && touched.genre && (
                  <div className="error-message">{errors.genre}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="readingStatus">Reading Status *</label>
                <Field name="readingStatus" as="select" className="form-control">
                  {Object.entries(ReadingStatus).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
                </Field>
                {errors.readingStatus && touched.readingStatus && (
                  <div className="error-message">{errors.readingStatus}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publicationYear">Publication Year</label>
                <Field name="publicationYear" type="number" className="form-control" />
                {errors.publicationYear && touched.publicationYear && (
                  <div className="error-message">{errors.publicationYear}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="pageCount">Page Count</label>
                <Field name="pageCount" type="number" className="form-control" />
                {errors.pageCount && touched.pageCount && (
                  <div className="error-message">{errors.pageCount}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-5)</label>
                <Field name="rating" type="number" min="1" max="5" className="form-control" />
                {errors.rating && touched.rating && (
                  <div className="error-message">{errors.rating}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <Field name="notes" as="textarea" rows="4" className="form-control" />
              {errors.notes && touched.notes && (
                <div className="error-message">{errors.notes}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="image">Book Cover</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Book cover preview" 
                  className="image-preview"
                />
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/books')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || isCreating || isUpdating}
                className="btn-primary"
              >
                {isSubmitting || isCreating || isUpdating 
                  ? 'Saving...' 
                  : isEdit ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};