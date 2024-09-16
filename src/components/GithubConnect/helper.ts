import crypto from 'crypto';
import { setLatestCsrf } from 'utils/githubCode';

const savePageBeforeGithubLogin = (): void => {
  const pathWithQuery = window.location.href.replace(/^https?:\/\/[^/]+/, '');
  localStorage.setItem('pageBeforeGithubLogin', pathWithQuery);
};

export const getPageBeforeGithubLogin = (): string => {
  return localStorage.getItem('pageBeforeGithubLogin');
};

export const handleConnectGithub = () => {
  const csrf = crypto.randomBytes(16).toString('hex');
  setLatestCsrf(csrf);

  savePageBeforeGithubLogin();

  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${csrf}`
  );
};
