import React from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import axios from 'rest/request';
import { setAccountName, setCredit, setTokens } from 'reducer/auth';
import { getLatestCsrf } from 'utils/githubCode';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const GithubLogin: React.FC = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const latestCsrf = urlParams.get('state');

  const login = async () => {
    let resp;
    try {
      resp = await axios.post(`${process.env.REACT_APP_BASE_GPU_API_URL}/github-auth`, { code });
    } catch (error) {
      // TODO: handle error case
      console.log('login failed');
    }

    const { accessToken, refreshToken, creditRemain, username } = resp.data;

    dispatch(setTokens({ access: accessToken, refresh: refreshToken }));
    dispatch(setCredit(creditRemain));
    dispatch(setAccountName(username));
  };

  if (code && latestCsrf && getLatestCsrf() && latestCsrf === getLatestCsrf()) {
    login().then(() => {
      // TODO: show message login success
      window.history.back();
    });
  } else {
    // TODO: print error message
    console.log('not login');
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('redirect')}>
        <div className={cx('desc')}>Logging in by Github</div>
        <div className={cx('loader-wrap')}>
          <div className={cx('loader')}></div>
        </div>
      </div>
    </div>
  );
};

export default GithubLogin;
