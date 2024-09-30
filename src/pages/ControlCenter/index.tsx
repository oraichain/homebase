import cn from 'classnames/bind';
import { useState, useEffect } from 'react';

import Background from 'assets/images/bg-control-center.jpg';
import { ReactComponent as ArrowRight } from 'assets/icons/arrow-right-2.svg';
import { Button } from 'components/Button';
import ControlCenterArticles from './components/control-center-articles';
import { GeneralInfoItem, PriceItem, ProposalItem, TokenActionItem } from './components/control-center-item';
import { prices, tokenAction } from './constant';
import { mapMainnetDataLabel } from './utils';
import styles from './index.module.scss';

const cx = cn.bind(styles);
const API_URL = 'https://control-center-api.orai.io/';

const ControlCenter = () => {
  const [data, setData] = useState<any>([]);
  const [mainnetData, setMainnetData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        const mainnetKeys = Object.keys(res).filter((key) => key !== 'price' && key !== 'proposal');
        const mainnet = mainnetKeys.map((key) => mapMainnetDataLabel(key, Number(res[key]).toLocaleString('en-US')));
        setMainnetData(mainnet);
        setLoading(false);
      })
      .catch((error) => console.log({ error }));
  }, []);

  return (
    <div className={cx('control-center')}>
      <div className={cx('hero')}>
        <div className={cx('content')}>
          <h3 className={cx('big-title')}>Oraichain Control Center</h3>
          <div className={cx('hero-grid')}>
            {loading ? (
              <div className={cx('lds-dual-ring')} />
            ) : (
              <div className={cx('hero-grid-content', 'grid')}>
                {mainnetData.length > 0 &&
                  mainnetData.map((item: any, index: any) => <GeneralInfoItem item={item} key={index} />)}
              </div>
            )}
          </div>
          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://orai.io/ecosystem';
              }}
              style={{ paddingRight: 20, paddingLeft: 20 }}
            >
              Download OWallet <ArrowRight style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>
        <img className={cx('hero-bg')} src={Background} alt="control center background" height={600} />
      </div>
      <div className={cx('token-action-section')}>
        <div className={cx('token-action-wrapper', 'grid')}>
          {tokenAction.map((item: any, index: any) => (
            <TokenActionItem item={item} key={index} />
          ))}
        </div>
      </div>
      <div className={cx('container-info')}>
        <div className={cx('proposal-section')}>
          <span className={cx('sec-title')}>Governance proposals</span>
          <div className={cx('proposals-list', 'grid')}>
            {data?.proposal?.map((item: any, index: any) => (
              <ProposalItem item={item} key={index} />
            ))}
          </div>
        </div>
        <div className={cx('price-section')}>
          <span className={cx('sec-title')}>Token Price</span>
          <div className={cx('tokens-list', 'grid')}>
            {prices.map((item: any, index: any) => (
              <PriceItem item={item} key={index} priceData={data?.price} />
            ))}
            <div className={cx('tokens-wrapper')}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <a href="https://app.oraidex.io/universalswap" target="blank" style={{ color: '#B798EA' }}>
                  Swap
                </a>
              </div>
            </div>
          </div>
        </div>
        <ControlCenterArticles />
      </div>
    </div>
  );
};

export default ControlCenter;
