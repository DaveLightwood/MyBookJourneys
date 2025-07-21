import { createApi } from '@reduxjs/toolkit/query/react';
import { authBaseQuery } from '../../../lib/auth-base-query';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: async (args, api, extraOptions) => {
    // Adjust the URL to include the /api/v1.0/books prefix
    if (typeof args === 'string') {
      args = `/api/v1.0/books${args}`;
    } else {
      args.url = `/api/v1.0/books${args.url}`;
    }
    return authBaseQuery(args, api, extraOptions);
  },
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (params = {}) => ({
        url: '',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Book', id })),
              { type: 'Book', id: 'LIST' },
            ]
          : [{ type: 'Book', id: 'LIST' }],
    }),
    getBook: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
    createBook: builder.mutation({
      query: (book) => ({
        url: '',
        method: 'POST',
        body: book,
      }),
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...book }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: book,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
      ],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
      ],
    }),
    uploadBookImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}/image`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Book', id }],
    }),
    searchBooks: builder.query({
      query: (searchTerm) => `/search?searchTerm=${encodeURIComponent(searchTerm)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Book', id })),
              { type: 'Book', id: 'SEARCH' },
            ]
          : [{ type: 'Book', id: 'SEARCH' }],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useUploadBookImageMutation,
  useSearchBooksQuery,
} = booksApi;