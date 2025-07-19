using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MyBookJourneys.Server.Services.Interfaces;

namespace MyBookJourneys.Server.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private readonly IConfiguration _configuration;

        public BlobStorageService(IConfiguration configuration)
        {
            _configuration = configuration;
            _blobServiceClient = new BlobServiceClient(configuration["AzureStorage:ConnectionString"]);
            _containerName = configuration["AzureStorage:ContainerName"] ?? "book-images";
            InitializeContainer().GetAwaiter().GetResult();
        }

        private async Task InitializeContainer()
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);
        }

        public async Task<string> UploadImageAsync(Stream imageStream, string fileName, string contentType)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var blobClient = containerClient.GetBlobClient(uniqueFileName);

            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = contentType
            };

            await blobClient.UploadAsync(imageStream, new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeaders
            });

            return blobClient.Uri.ToString();
        }

        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                var blobName = GetBlobNameFromUrl(imageUrl);
                if (string.IsNullOrEmpty(blobName))
                    return false;

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(blobName);
                
                var response = await blobClient.DeleteIfExistsAsync();
                return response.Value;
            }
            catch
            {
                return false;
            }
        }

        public async Task<Stream> DownloadImageAsync(string imageUrl)
        {
            var blobName = GetBlobNameFromUrl(imageUrl);
            if (string.IsNullOrEmpty(blobName))
                throw new ArgumentException("Invalid image URL");

            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            var blobClient = containerClient.GetBlobClient(blobName);
            
            var response = await blobClient.DownloadStreamingAsync();
            return response.Value.Content;
        }

        public string GetBlobNameFromUrl(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return string.Empty;

            try
            {
                var uri = new Uri(imageUrl);
                var segments = uri.Segments;
                
                if (segments.Length < 3)
                    return string.Empty;

                return segments[segments.Length - 1];
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}