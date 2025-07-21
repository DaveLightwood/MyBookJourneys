import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/auth-config';

export const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === 'popup') {
      instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });
    }
  };

  return (
    <div className="login-buttons">
      <button onClick={() => handleLogin('popup')} className="btn btn-primary">
        Sign in using Popup
      </button>
      <button onClick={() => handleLogin('redirect')} className="btn btn-secondary">
        Sign in using Redirect
      </button>
    </div>
  );
};