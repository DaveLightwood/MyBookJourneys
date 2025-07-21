import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, apiRequest } from '../config/auth-config';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Custom base query that adds authentication headers
export const authBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7196',
  prepareHeaders: async (headers) => {
    try {
      // Get all accounts
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        // Try to acquire token silently
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...apiRequest,
          account: accounts[0],
        });
        
        if (tokenResponse.accessToken) {
          headers.set('Authorization', `Bearer ${tokenResponse.accessToken}`);
        }
      }
    } catch (error) {
      console.error('Failed to acquire token:', error);
      // Token acquisition failed, user might need to re-authenticate
      // The API will return 401 and the app should handle re-authentication
    }
    
    return headers;
  },
});

// Export the MSAL instance for use in other parts of the app
export { msalInstance };