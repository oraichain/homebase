import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'rest/request';
import { setAccountName, setCredit, setTokens } from 'reducer/auth';
import { getPageBeforeGithubLogin } from 'components/GithubConnect/helper';
import { getLatestCsrf } from 'utils/githubCode';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const GithubLogin: React.FC = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const latestCsrf = urlParams.get('state');

  useEffect(() => {
    const login = async () => {
      const resp = await axios.post(`${process.env.REACT_APP_BASE_GPU_API_URL}/github-auth`, { code });

      const { accessToken, refreshToken, creditRemain, username } = resp.data;

      dispatch(setTokens({ access: accessToken, refresh: refreshToken }));
      dispatch(setCredit(creditRemain));
      dispatch(setAccountName(username));
    };

    if (code && latestCsrf && latestCsrf === getLatestCsrf()) {
      // TODO: refactor this for better UX
      login()
        .then(() => {
          toast.success('Login success');
          setTimeout(() => {
            navigate(getPageBeforeGithubLogin() || '/');
          }, 3e3);
        })
        .catch(() => {
          toast.error('Login failed');
          setTimeout(() => {
            navigate(getPageBeforeGithubLogin() || '/');
          }, 3e3);
        });
    } else {
      console.error('not login');
      toast.error('Login failed. CSRF code is not match.');
      setTimeout(() => {
        navigate(getPageBeforeGithubLogin() || '/');
      }, 3e3);
    }
  }, [code, latestCsrf]);

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
