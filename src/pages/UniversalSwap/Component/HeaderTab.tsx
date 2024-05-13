import { ReactComponent as KadoIcon } from 'assets/icons/ic_kado.svg';
import lightBlock from 'assets/icons/lightBlock.svg';
import cn from 'classnames/bind';
import { formatDisplayUsdt, formatNumberKMB } from 'helper/helpers';
import styles from './HeaderTab.module.scss';

const cx = cn.bind(styles);

export const HeaderTab: React.FC<{
  openBuyModal: () => void;
  price?: number;
  marketCap?: number;
  volume?: number;
  blockTime?: number;
}> = ({ openBuyModal, price = 0, marketCap = 0, volume = 0, blockTime = 0 }) => {
  return (
    <div className={cx('header')}>
      <span className={cx('headerTitle')}>Oraichain Homebase</span>
      <div className={cx('info')}>
        <div className={cx('contentWrapper')}>
          <span className={cx('title')}>
            <p>ORAI Price:</p>
            <p className={cx('value')}>{formatDisplayUsdt(price)}</p>
          </span>
          <button
            className={cx('btn')}
            onClick={() => {
              openBuyModal();
            }}
          >
            <KadoIcon />
            Buy Tokens
          </button>
        </div>

        <div className={cx('contentWrapper')}>
          <span className={cx('title')}>
            <p>Market Cap:</p>
            <p className={cx('value')}>{formatNumberKMB(marketCap)}</p>
          </span>
        </div>
        <div className={cx('contentWrapper')}>
          <span className={cx('title')}>
            <p>Volume (24H):</p>
            <p className={cx('value')}>{formatDisplayUsdt(volume)}</p>
          </span>
        </div>
        <div className={cx('contentWrapper')}>
          <span className={cx('title')}>
            <img src={lightBlock} alt="block_times" />
            <p>Block time:</p>
            <p className={cx('value')}>{blockTime.toFixed(2)}s</p>
          </span>
        </div>
      </div>
    </div>
  );
};
