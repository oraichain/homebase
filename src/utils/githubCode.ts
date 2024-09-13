const LATEST_CSRF_TOKEN = 'latest_csrf_token';

export const setLatestCsrf = (csrf: string) => {
  // if (localStorage.getItem(LATEST_CSRF_TOKEN)) {
  //   return;
  // }
  // console.log('SET NEW CSRF', csrf);
  localStorage.setItem(LATEST_CSRF_TOKEN, csrf);
};

export const getLatestCsrf = () => {
  return localStorage.getItem(LATEST_CSRF_TOKEN);
};
