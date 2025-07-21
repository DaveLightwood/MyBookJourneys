import { useAccount, useMsal } from '@azure/msal-react';

export const ProfileData = () => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  if (!account) {
    return <div>No user data available</div>;
  }

  return (
    <div className="profile-data">
      <h3>Welcome, {account.name || account.username}!</h3>
      <div className="profile-info">
        <p><strong>Username:</strong> {account.username}</p>
        <p><strong>Name:</strong> {account.name}</p>
        {account.idTokenClaims?.emails && (
          <p><strong>Email:</strong> {account.idTokenClaims.emails[0]}</p>
        )}
        <p><strong>Account ID:</strong> {account.homeAccountId}</p>
      </div>
    </div>
  );
};