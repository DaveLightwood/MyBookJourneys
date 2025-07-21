using System.Security.Claims;

namespace MyBookJourneys.Server.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            // Try multiple claim types that might contain the user ID
            return principal.FindFirstValue(ClaimTypes.NameIdentifier) 
                ?? principal.FindFirstValue("sub") 
                ?? principal.FindFirstValue("oid")
                ?? string.Empty;
        }

        public static string GetUserEmail(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Email) 
                ?? principal.FindFirstValue("email") 
                ?? principal.FindFirstValue("preferred_username")
                ?? string.Empty;
        }

        public static string GetUserName(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Name) 
                ?? principal.FindFirstValue("name") 
                ?? principal.FindFirstValue(ClaimTypes.GivenName)
                ?? string.Empty;
        }

        public static bool IsAuthenticated(this ClaimsPrincipal principal)
        {
            return principal?.Identity?.IsAuthenticated ?? false;
        }
    }
}