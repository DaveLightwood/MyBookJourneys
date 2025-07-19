using System.ComponentModel.DataAnnotations;

namespace MyBookJourneys.Server.Data.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Author { get; set; }

        [StringLength(13)]
        public string? ISBN { get; set; }

        public DateTime? PublicationDate { get; set; }

        [StringLength(100)]
        public string? Publisher { get; set; }

        public int? PageCount { get; set; }

        [StringLength(50)]
        public string? Genre { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        public decimal? Rating { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}