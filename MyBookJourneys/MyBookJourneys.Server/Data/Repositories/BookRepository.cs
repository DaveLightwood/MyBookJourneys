using Microsoft.EntityFrameworkCore;
using MyBookJourneys.Server.Data.Contexts;
using MyBookJourneys.Server.Data.Interfaces;
using MyBookJourneys.Server.Data.Models;

namespace MyBookJourneys.Server.Data.Repositories
{
    public class BookRepository : Repository<Book>, IBookRepository
    {
        public BookRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Book>> GetBooksByAuthorAsync(string author)
        {
            return await _dbSet
                .Where(b => b.Author != null && b.Author.Contains(author))
                .OrderBy(b => b.Title)
                .ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre)
        {
            return await _dbSet
                .Where(b => b.Genre != null && b.Genre.Equals(genre, StringComparison.OrdinalIgnoreCase))
                .OrderBy(b => b.Title)
                .ToListAsync();
        }

        public async Task<Book?> GetBookByISBNAsync(string isbn)
        {
            return await _dbSet
                .FirstOrDefaultAsync(b => b.ISBN == isbn);
        }

        public async Task<IEnumerable<Book>> GetRecentBooksAsync(int count)
        {
            return await _dbSet
                .OrderByDescending(b => b.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetTopRatedBooksAsync(int count)
        {
            return await _dbSet
                .Where(b => b.Rating.HasValue)
                .OrderByDescending(b => b.Rating)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllAsync();
            }

            searchTerm = searchTerm.ToLower();

            return await _dbSet
                .Where(b => 
                    (b.Title != null && b.Title.ToLower().Contains(searchTerm)) ||
                    (b.Author != null && b.Author.ToLower().Contains(searchTerm)) ||
                    (b.ISBN != null && b.ISBN.Contains(searchTerm)) ||
                    (b.Description != null && b.Description.ToLower().Contains(searchTerm)))
                .OrderBy(b => b.Title)
                .ToListAsync();
        }
    }
}