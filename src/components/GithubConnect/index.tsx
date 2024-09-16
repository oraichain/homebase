import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Button } from 'components/Button';
import { RootState } from 'store/configure';
import { setCredit, reset } from 'reducer/auth';
import { axiosAuth as axios } from 'rest/request';
import { ReactComponent as GitHubIcon } from 'assets/icons/github.svg';
import ConnectedImg from 'assets/images/connected-img.png';
import DropdownIcon from 'assets/icons/nav-arrow-down.svg';
import LogoutIcon from 'assets/icons/logout-git.svg';
import { handleConnectGithub } from './helper';
import styles from './index.module.scss';
import 'tippy.js/dist/tippy.css'; // optional for styling

const cx = classNames.bind(styles);

const baseApiUrl = process.env.REACT_APP_BASE_GPU_API_URL;
export const GithubConnect: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountName = useSelector((state: RootState) => state.auth.accountName);
  const credit = useSelector((state: RootState) => state.auth.credit);
  const { access: accessToken } = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const getCreditData = async () => {
      let resp;
      try {
        resp = await axios.get(`${baseApiUrl}/credit-remain`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } catch (e) {
        console.error('Credit remain:', e);

        toast.error('Failed to query credit balance');
      }
      resp && dispatch(setCredit(resp.data.creditRemain));
    };
    accessToken && getCreditData();
  }, [accessToken]);

  return (
    <div className={cx('wrapper')}>
      <div>
        <Button type="fourth" onClick={() => {}}>
          Get the latest alpha and more
        </Button>
      </div>

      {accountName ? (
        <HeadlessTippy
          interactive
          trigger="click"
          render={(attrs) => {
            const options: { name: string; icon?: string; onClick?: React.MouseEventHandler<HTMLDivElement> }[] = [
              {
                name: 'Manage your credits',
                onClick: () => {
                  navigate('/gpu-credit');
                }
              },
              {
                name: 'Log out',
                icon: LogoutIcon,
                onClick: () => {
                  // remove token
                  dispatch(reset());
                }
              }
            ];
            return (
              <div className={cx('connected-modal')}>
                {options.map((option, index) => (
                  <div key={index} className={cx('connected-modal-option')} onClick={option.onClick}>
                    <h1 className={cx('modal-option-name')}>{option.name}</h1>
                    {option.icon && <img src={option.icon} alt={`${option.name} icon`} />}
                  </div>
                ))}
              </div>
            );
          }}
        >
          <div className={cx('connected-area')}>
            <div className={cx('connected-img')}>
              <img src={ConnectedImg} alt="Connected Img" />
            </div>

            <div className={cx('connected-content')}>
              <div className={cx('connected-info')}>
                <h1 className={cx('connected-info--name')}>{accountName}</h1>
                <h1 className={cx('connected-info--credit')}>{credit} credits</h1>
              </div>

              <img src={DropdownIcon} alt="dropdown icon" />
            </div>
          </div>
        </HeadlessTippy>
      ) : (
        <div className={cx('connected-btn')}>
          <Button
            type="third"
            onClick={handleConnectGithub}
            icon={<GitHubIcon />}
            style={{ paddingLeft: 14, paddingRight: 14 }}
          >
            Connect Github
          </Button>
        </div>
      )}
    </div>
  );
};
