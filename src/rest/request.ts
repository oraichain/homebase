import Axios from 'axios';
import { store } from 'store/configure';
import { setTokens, reset } from 'reducer/auth';
import { throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import { AXIOS_TIMEOUT, AXIOS_THROTTLE_THRESHOLD } from '@oraichain/oraidex-common';

export default Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: process.env.REACT_APP_BASE_API_URL
});

export const axiosAuth = Axios.create({
  timeout: AXIOS_TIMEOUT,
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: process.env.REACT_APP_BASE_GPU_API_URL
});

let refreshTokenPromise;

const getRefreshToken = () => {
  return Axios.post(`${process.env.REACT_APP_BASE_GPU_API_URL}/refresh-token`, {
    refreshToken: store.getState().auth.token.refresh
  });
};

axiosAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (!refreshTokenPromise) {
        // check for an existing in-progress request
        // if nothing is in-progress, start a new refresh token request
        refreshTokenPromise = getRefreshToken().then((resp) => {
          refreshTokenPromise = null; // clear state
          return resp.data; // resolve with the new token
        });
      }
      return refreshTokenPromise
        .then((tokens) => {
          const newTokens = {
            access: tokens.accessToken,
            refresh: tokens.refreshToken
          };
          store.dispatch(setTokens(newTokens));
        })
        .catch(() => {
          store.dispatch(reset());
        });
    }
    return Promise.reject(error);
  }
);
