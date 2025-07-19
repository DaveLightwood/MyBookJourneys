namespace MyBookJourneys.Server.Services.Interfaces
{
    public interface IBlobStorageService
    {
        Task<string> UploadImageAsync(Stream imageStream, string fileName, string contentType);
        Task<bool> DeleteImageAsync(string imageUrl);
        Task<Stream> DownloadImageAsync(string imageUrl);
        string GetBlobNameFromUrl(string imageUrl);
    }
}