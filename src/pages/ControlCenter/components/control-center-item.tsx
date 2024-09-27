import cn from 'classnames/bind';
import { Link } from 'react-router-dom';

import ArrowRight from 'assets/icons/arrow-right-2.svg';
import styles from '../index.module.scss';

const cx = cn.bind(styles);

export const GeneralInfoItem = ({ item }: { item: any }) => {
  return (
    <div className={cx('general-wrapper')}>
      <span className={cx('g-title')}>{item.label}</span>
      <span className={cx('g-content')}>{item.value}</span>
    </div>
  );
};

export const TokenActionItem = ({ item }: { item: any }) => {
  return (
    <div className={cx('token-action-item-wrapper')}>
      <span className={cx('tac-title')}>{item.title}</span>
      <Link to={item.link} className={cx('tac-link')} target="_blank">
        <span>Learn more</span>
        <img className="direct-icon" src={ArrowRight} alt="" width={20} height={18} />
      </Link>
    </div>
  );
};

export const PriceItem = ({ item, priceData }: { item: any; priceData: any }) => {
  return (
    <div className={cx('tokens-wrapper')}>
      <img className={cx('image')} src={item.icon} alt="token icon" width={24} height={24} />
      <div className={cx('tokens-text')}>
        <span className={cx('tk-title')}>{item.token}</span>
        <span className={cx('tk-price')}>{'$' + Number(priceData?.[item.label].usd.toFixed(4))}</span>
      </div>
    </div>
  );
};

export const ProposalItem = ({ item }: { item: any }) => {
  var optionsDate: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const startDate = new Date(item.voting_start_time);
  const endDate = new Date(item.voting_end_time);

  return (
    <div className={cx('proposal-wrapper')}>
      <span className={cx('p-id')}>#{item.proposal_id}</span>
      <span className={cx('p-title')}>{item.title}</span>
      <span className={cx('p-time')}>
        <span className={cx('p-tag')}>Start time: </span>
        {item.voting_start_time === '0001-01-01T00:00:00Z' ? '-' : startDate.toLocaleDateString('en-US', optionsDate)}
      </span>
      <span className={cx('p-time')}>
        <span className={cx('p-tag')}>End time: </span>
        {item.voting_end_time === '0001-01-01T00:00:00Z' ? '-' : endDate.toLocaleDateString('en-US', optionsDate)}
      </span>
      <span className={cx('p-proposer')}>
        <span className={cx('p-tag')}>Proposer: </span>
        <Link to={`https://scan.orai.io/account/${item.proposer}`} target="blank">
          {item.proposer.slice(0, 6) + ' ... ' + item.proposer.slice(item.proposer.length - 6, item.proposer.length)}
        </Link>
      </span>
      <span className={cx('p-percent')}>
        <span className={cx('p-tag')}>Percentage: </span>
        {item.yes_percentage}%
      </span>
    </div>
  );
};
