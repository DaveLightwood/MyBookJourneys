import { useMsal } from '@azure/msal-react';

export const LogoutButton = () => {
  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    if (logoutType === 'popup') {
      instance.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/'
      });
    } else if (logoutType === 'redirect') {
      instance.logoutRedirect({
        postLogoutRedirectUri: '/',
      });
    }
  };

  return (
    <div className="logout-buttons">
      <button onClick={() => handleLogout('popup')} className="btn btn-outline">
        Sign out using Popup
      </button>
      <button onClick={() => handleLogout('redirect')} className="btn btn-outline">
        Sign out using Redirect
      </button>
    </div>
  );
};