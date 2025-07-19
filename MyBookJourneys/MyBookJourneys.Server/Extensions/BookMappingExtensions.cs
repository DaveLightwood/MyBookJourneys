using MyBookJourneys.Server.Data.Models;
using MyBookJourneys.Server.DTOs;

namespace MyBookJourneys.Server.Extensions
{
    public static class BookMappingExtensions
    {
        public static BookResponseDto ToResponseDto(this Book book)
        {
            return new BookResponseDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                PublicationDate = book.PublicationDate,
                Publisher = book.Publisher,
                PageCount = book.PageCount,
                Genre = book.Genre,
                Description = book.Description,
                CoverImageUrl = book.CoverImageUrl,
                Rating = book.Rating,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt
            };
        }

        public static Book ToEntity(this CreateBookDto dto)
        {
            return new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                ISBN = dto.ISBN,
                PublicationDate = dto.PublicationDate,
                Publisher = dto.Publisher,
                PageCount = dto.PageCount,
                Genre = dto.Genre,
                Description = dto.Description,
                CoverImageUrl = dto.CoverImageUrl,
                Rating = dto.Rating
            };
        }

        public static void UpdateEntity(this Book book, UpdateBookDto dto)
        {
            book.Title = dto.Title;
            book.Author = dto.Author;
            book.ISBN = dto.ISBN;
            book.PublicationDate = dto.PublicationDate;
            book.Publisher = dto.Publisher;
            book.PageCount = dto.PageCount;
            book.Genre = dto.Genre;
            book.Description = dto.Description;
            book.CoverImageUrl = dto.CoverImageUrl;
            book.Rating = dto.Rating;
        }
    }
}