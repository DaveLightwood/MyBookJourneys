using System.ComponentModel.DataAnnotations;

namespace MyBookJourneys.Server.DTOs
{
    public class UpdateBookDto
    {
        [Required]
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

        [Range(1, int.MaxValue)]
        public int? PageCount { get; set; }

        [StringLength(50)]
        public string? Genre { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(500)]
        [Url]
        public string? CoverImageUrl { get; set; }

        [Range(0, 5)]
        public decimal? Rating { get; set; }
    }
}