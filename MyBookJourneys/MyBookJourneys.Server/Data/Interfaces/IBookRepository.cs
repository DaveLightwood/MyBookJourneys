using MyBookJourneys.Server.Data.Models;

namespace MyBookJourneys.Server.Data.Interfaces
{
    public interface IBookRepository : IRepository<Book>
    {
        Task<IEnumerable<Book>> GetBooksByAuthorAsync(string author);
        Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre);
        Task<Book?> GetBookByISBNAsync(string isbn);
        Task<IEnumerable<Book>> GetRecentBooksAsync(int count);
        Task<IEnumerable<Book>> GetTopRatedBooksAsync(int count);
        Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm);
    }
}