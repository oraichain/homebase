import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './GithubLogin.module.scss';
import { Button } from 'components/Button';
import { getGithubCode } from 'utils/githubCode';

const cx = classNames.bind(styles);

const GithubLogin: React.FC = () => {
  const isConnected = getGithubCode() ? true : false;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.history.back();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('description')}>
        {isConnected ? 'Login by Github successfully!' : "You're not login by Github yet!"}
      </div>
      <div className={cx('redirect')}>
        <div className={cx('desc')}>Redirecting</div>
        <div className={cx('loader-wrap')}>
          <div className={cx('loader')}></div>
        </div>
      </div>
    </div>
  );
};

export default GithubLogin;
