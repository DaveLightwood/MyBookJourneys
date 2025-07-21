import { LogLevel } from '@azure/msal-browser';

// MSAL configuration for Microsoft Entra External ID
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '{your-client-id}',
    authority: `https://${import.meta.env.VITE_AZURE_TENANT_SUBDOMAIN || '{your-tenant-subdomain}'}.ciamlogin.com/${import.meta.env.VITE_AZURE_TENANT_ID || '{your-tenant-id}'}`,
    knownAuthorities: [`${import.meta.env.VITE_AZURE_TENANT_SUBDOMAIN || '{your-tenant-subdomain}'}.ciamlogin.com`],
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Add scopes for API access
export const loginRequest = {
  scopes: ['openid', 'profile'],
};

// API request scopes (for calling your backend API)
export const apiRequest = {
  scopes: [`api://${import.meta.env.VITE_AZURE_CLIENT_ID || '{your-client-id}'}/access_as_user`],
};

// Graph API request scopes (if needed)
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};