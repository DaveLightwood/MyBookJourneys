using Microsoft.AspNetCore.Mvc;
using MyBookJourneys.Server.Data.Interfaces;
using MyBookJourneys.Server.Data.Models;
using MyBookJourneys.Server.Services.Interfaces;

namespace MyBookJourneys.Server.Controllers
{
    [ApiController]
    [Route("api/v1.0/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;
        private readonly ILogger<BooksController> _logger;
        private readonly IBlobStorageService _blobStorageService;

        public BooksController(IBookRepository bookRepository, ILogger<BooksController> logger, IBlobStorageService blobStorageService)
        {
            _bookRepository = bookRepository;
            _logger = logger;
            _blobStorageService = blobStorageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAll()
        {
            try
            {
                var books = await _bookRepository.GetAllAsync();
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all books");
                return StatusCode(500, "An error occurred while retrieving books");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetById(int id)
        {
            try
            {
                var book = await _bookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }
                return Ok(book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book {BookId}", id);
                return StatusCode(500, "An error occurred while retrieving the book");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Book>> Create([FromBody] Book book)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!string.IsNullOrEmpty(book.ISBN))
                {
                    var existingBook = await _bookRepository.GetBookByISBNAsync(book.ISBN);
                    if (existingBook != null)
                    {
                        return Conflict($"A book with ISBN {book.ISBN} already exists");
                    }
                }

                var createdBook = await _bookRepository.AddAsync(book);
                return CreatedAtAction(nameof(GetById), new { id = createdBook.Id }, createdBook);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(500, "An error occurred while creating the book");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Book book)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != book.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingBook = await _bookRepository.GetByIdAsync(id);
                if (existingBook == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                if (!string.IsNullOrEmpty(book.ISBN) && book.ISBN != existingBook.ISBN)
                {
                    var bookWithISBN = await _bookRepository.GetBookByISBNAsync(book.ISBN);
                    if (bookWithISBN != null && bookWithISBN.Id != id)
                    {
                        return Conflict($"Another book with ISBN {book.ISBN} already exists");
                    }
                }

                await _bookRepository.UpdateAsync(book);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book {BookId}", id);
                return StatusCode(500, "An error occurred while updating the book");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var book = await _bookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                await _bookRepository.DeleteAsync(book);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book {BookId}", id);
                return StatusCode(500, "An error occurred while deleting the book");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Book>>> Search([FromQuery] string searchTerm)
        {
            try
            {
                var books = await _bookRepository.SearchBooksAsync(searchTerm);
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching books with term: {SearchTerm}", searchTerm);
                return StatusCode(500, "An error occurred while searching books");
            }
        }

        [HttpGet("author/{author}")]
        public async Task<ActionResult<IEnumerable<Book>>> GetByAuthor(string author)
        {
            try
            {
                var books = await _bookRepository.GetBooksByAuthorAsync(author);
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books by author: {Author}", author);
                return StatusCode(500, "An error occurred while retrieving books by author");
            }
        }

        [HttpGet("genre/{genre}")]
        public async Task<ActionResult<IEnumerable<Book>>> GetByGenre(string genre)
        {
            try
            {
                var books = await _bookRepository.GetBooksByGenreAsync(genre);
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books by genre: {Genre}", genre);
                return StatusCode(500, "An error occurred while retrieving books by genre");
            }
        }

        [HttpGet("isbn/{isbn}")]
        public async Task<ActionResult<Book>> GetByISBN(string isbn)
        {
            try
            {
                var book = await _bookRepository.GetBookByISBNAsync(isbn);
                if (book == null)
                {
                    return NotFound($"Book with ISBN {isbn} not found");
                }
                return Ok(book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book by ISBN: {ISBN}", isbn);
                return StatusCode(500, "An error occurred while retrieving the book");
            }
        }

        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<Book>>> GetRecent([FromQuery] int count = 10)
        {
            try
            {
                if (count <= 0 || count > 100)
                {
                    return BadRequest("Count must be between 1 and 100");
                }

                var books = await _bookRepository.GetRecentBooksAsync(count);
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent books");
                return StatusCode(500, "An error occurred while retrieving recent books");
            }
        }

        [HttpGet("top-rated")]
        public async Task<ActionResult<IEnumerable<Book>>> GetTopRated([FromQuery] int count = 10)
        {
            try
            {
                if (count <= 0 || count > 100)
                {
                    return BadRequest("Count must be between 1 and 100");
                }

                var books = await _bookRepository.GetTopRatedBooksAsync(count);
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving top rated books");
                return StatusCode(500, "An error occurred while retrieving top rated books");
            }
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount()
        {
            try
            {
                var count = await _bookRepository.CountAsync();
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting book count");
                return StatusCode(500, "An error occurred while counting books");
            }
        }

        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadBookImage(int id, IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest("No image file provided");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Allowed types: jpg, jpeg, png, gif, webp");
                }

                if (image.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("File size exceeds 10MB limit");
                }

                var book = await _bookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                if (!string.IsNullOrEmpty(book.CoverImageUrl))
                {
                    await _blobStorageService.DeleteImageAsync(book.CoverImageUrl);
                }

                using var stream = image.OpenReadStream();
                var imageUrl = await _blobStorageService.UploadImageAsync(
                    stream, 
                    $"book-{id}-{image.FileName}", 
                    image.ContentType
                );

                book.CoverImageUrl = imageUrl;
                book.UpdatedAt = DateTime.UtcNow;
                await _bookRepository.UpdateAsync(book);

                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image for book {BookId}", id);
                return StatusCode(500, "An error occurred while uploading the image");
            }
        }

        [HttpDelete("{id}/image")]
        public async Task<IActionResult> DeleteBookImage(int id)
        {
            try
            {
                var book = await _bookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                if (string.IsNullOrEmpty(book.CoverImageUrl))
                {
                    return BadRequest("Book has no image to delete");
                }

                var deleted = await _blobStorageService.DeleteImageAsync(book.CoverImageUrl);
                if (!deleted)
                {
                    _logger.LogWarning("Failed to delete image from blob storage for book {BookId}", id);
                }

                book.CoverImageUrl = null;
                book.UpdatedAt = DateTime.UtcNow;
                await _bookRepository.UpdateAsync(book);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image for book {BookId}", id);
                return StatusCode(500, "An error occurred while deleting the image");
            }
        }
    }
}