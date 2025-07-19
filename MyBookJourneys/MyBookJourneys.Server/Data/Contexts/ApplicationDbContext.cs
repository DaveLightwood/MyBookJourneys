using Microsoft.EntityFrameworkCore;
using MyBookJourneys.Server.Data.Models;

namespace MyBookJourneys.Server.Data.Contexts
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);
                
                entity.Property(e => e.Author)
                    .HasMaxLength(100);
                
                entity.Property(e => e.ISBN)
                    .HasMaxLength(13);
                
                entity.Property(e => e.Publisher)
                    .HasMaxLength(100);
                
                entity.Property(e => e.Genre)
                    .HasMaxLength(50);
                
                entity.Property(e => e.Description)
                    .HasMaxLength(2000);
                
                entity.Property(e => e.CoverImageUrl)
                    .HasMaxLength(500);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasIndex(e => e.ISBN)
                    .IsUnique()
                    .HasFilter("[ISBN] IS NOT NULL");
                
                entity.HasIndex(e => e.Title);
                entity.HasIndex(e => e.Author);
            });
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Book && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var book = (Book)entry.Entity;

                if (entry.State == EntityState.Added)
                {
                    book.CreatedAt = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Modified)
                {
                    book.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}