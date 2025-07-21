import { useMsal } from '@azure/msal-react';
import { apiRequest } from '@/config/auth-config';

export const useAuthApi = () => {
  const { instance, accounts } = useMsal();

  const getAccessToken = async () => {
    if (accounts.length === 0) {
      throw new Error('No active account found');
    }

    const request = {
      ...apiRequest,
      account: accounts[0],
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      console.warn('Silent token acquisition failed. Acquiring token using popup', error);
      try {
        const response = await instance.acquireTokenPopup(request);
        return response.accessToken;
      } catch (popupError) {
        console.error('Token acquisition failed', popupError);
        throw popupError;
      }
    }
  };

  const callApiWithToken = async (apiEndpoint, options = {}) => {
    try {
      const accessToken = await getAccessToken();
      
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      };

      return fetch(apiEndpoint, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error('API call failed', error);
      throw error;
    }
  };

  return {
    getAccessToken,
    callApiWithToken,
  };
};