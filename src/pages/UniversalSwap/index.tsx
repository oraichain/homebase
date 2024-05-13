import cn from 'classnames/bind';
import Content from 'layouts/Content';
import React, { useState } from 'react';
import { AssetsTab, HeaderTab } from './Component';
import SwapComponent from './Swap';
import { initPairSwap } from './Swap/hooks/useFillToken';
import { NetworkFilter, initNetworkFilter } from './helpers';
import styles from './index.module.scss';
import { formatDisplayUsdt } from 'helper/helpers';
import BuyOraiModal from 'layouts/BuyOraiModal';
import { ReactComponent as OBrigde } from 'assets/icons/OraiBridge_full_dark.svg';
import ConnectBanner from './Component/ConnectBanner';
import Feature from './Component/Feature';
import StakeSummary from './Component/StakeSummary';
const cx = cn.bind(styles);

const Swap: React.FC = () => {
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<[string, string]>(initPairSwap);
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>(initNetworkFilter);

  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [openBuy, setOpenBuy] = useState(false);

  return (
    <Content nonBackground>
      <div className={cx('homebase')}>
        <HeaderTab openBuyModal={() => setOpenBuy(true)} />
        <div className={cx('swap-container')}>
          <div className={cx('swap-col', 'w60')}>
            <ConnectBanner />
            <AssetsTab networkFilter={networkFilter.value} openBuyModal={() => setOpenBuy(true)} />
          </div>
          <div className={cx('swap-col', 'w40')}>
            <SwapComponent fromTokenDenom={fromTokenDenom} toTokenDenom={toTokenDenom} setSwapTokens={setSwapTokens} />
            <div className={styles.powerBy}>
              Powered by <OBrigde />
            </div>
          </div>
        </div>
        <div className={styles.looking}>You are looking for...</div>
        <StakeSummary />
        <Feature />
      </div>

      {openBuy && (
        <BuyOraiModal
          open={openBuy}
          close={() => {
            setOpenBuy(false);
            setIsLoadedIframe(false);
          }}
          onAfterLoad={() => setIsLoadedIframe(true)}
          isLoadedIframe={isLoadedIframe}
        />
      )}
    </Content>
  );
};

export default Swap;
