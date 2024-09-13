import crypto from 'crypto';
import { setLatestCsrf } from 'utils/githubCode';

export const handleConnectGithub = () => {
  const csrf = crypto.randomBytes(16).toString('hex');
  setLatestCsrf(csrf);

  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${csrf}`
  );
};
