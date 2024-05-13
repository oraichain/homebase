import { CW20_DECIMALS, TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { ReactComponent as SwapIcon } from 'assets/icons/swap_ic.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import Content from 'layouts/Content';
import isEqual from 'lodash/isEqual';
import React, { useState } from 'react';
import { PoolInfoResponse } from 'types/pool';
import styles from './index.module.scss';
import StakingForm from './components/StakingForm';
import { Button } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import BuyOraiModal from 'layouts/BuyOraiModal';
import { ReactComponent as KadoIcon } from 'assets/icons/ic_kado.svg';
import classNames from 'classnames';
import { USDC_TOKEN_INFO } from 'pages/Staking/constants';

export type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
  claimable: number;
  baseToken: TokenItemType;
  quoteToken: TokenItemType;
};

const GpuStaking: React.FC<{}> = () => {
  console.log('first', USDC_TOKEN_INFO);
  const navigate = useNavigate();
  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [openBuy, setOpenBuy] = useState(false);

  return (
    <Content nonBackground otherBackground>
      <div className={styles.gpu_staking}>
        <div className={styles.header}>
          <h1>GPU Staking</h1>
          <span>Compound staking to earn GPU demand and block rewards</span>
        </div>

        <div className={styles.summary}>
          <div className={styles.item}>
            <h2>Available to Stake</h2>
            <span className={styles.value}>113.42 scORAI</span>
            <span className={styles.usd}>$1,163.32</span>

            <div className={styles.btn}>
              <Button type="third-sm" onClick={() => navigate('/')}>
                <SwapIcon />
                Swap
              </Button>
              <Button type="third-sm" onClick={() => setOpenBuy(true)}>
                <KadoIcon />
                Swap
              </Button>
            </div>
          </div>
          <div className={classNames(styles.item, styles.claimable)}>
            <h2>Claimable Reward</h2>
            <span className={styles.value}>+112.42 USDC</span>
            <span className={styles.usd}>$112.42</span>

            <div className={styles.btn}>
              <Button type="third-sm" onClick={() => navigate('/')}>
                <UsdcIcon className={styles.coin} />
                &nbsp;Claim
              </Button>
            </div>
          </div>
          <div className={classNames(styles.item, styles.apy)}>
            <h2>Current APY</h2>
            <span className={styles.value}>32.47%</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.stake}>
            <StakingForm />
          </div>
          <div className={styles.info}>
            <div className={styles.detail}>
              <h2>Your Stake</h2>
              <span className={styles.value}>113.42 scORAI</span>
              <span className={styles.usd}>$1,163.32</span>
            </div>
            <div className={styles.detail}>
              <h2>Your Stake</h2>
              <span className={styles.value}>113.42 scORAI</span>
              <span className={styles.usd}>$1,163.32</span>
            </div>
          </div>
        </div>
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

export default GpuStaking;
