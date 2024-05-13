import { CW20_DECIMALS, TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import Content from 'layouts/Content';
import isEqual from 'lodash/isEqual';
import React, { useState } from 'react';
import { PoolInfoResponse } from 'types/pool';

import styles from './index.module.scss';
import StakingForm from './components/StakingForm';

export type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
  claimable: number;
  baseToken: TokenItemType;
  quoteToken: TokenItemType;
};

const GpuStaking: React.FC<{}> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);
  const [filteredPools, setFilteredPools] = useState<PoolInfoResponse[]>([]);

  const [address] = useConfigReducer('address');
  const theme = useTheme();
  const mobileMode = isMobile();

  return (
    <Content nonBackground otherBackground>
      <div className={styles.gpu_staking}>
        <div>
          <div>GPU Staking</div>
          <div>Compound staking to earn GPU demand and block rewards</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            width: '100%'
          }}
        >
          <div
            style={{
              height: 216,
              width: 'calc(100% / 3)',
              backgroundColor: 'red'
            }}
          ></div>
          <div
            style={{
              height: 216,
              width: 'calc(100% / 3)',
              backgroundColor: 'red'
            }}
          ></div>
          <div
            style={{
              height: 216,
              width: 'calc(100% / 3)',
              backgroundColor: 'red'
            }}
          ></div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            paddingTop: 10
          }}
        >
          <div
            style={{
              width: 'calc(200% / 3)'
            }}
          >
            <StakingForm />
          </div>
          <div
            style={{
              width: 'calc(100% / 3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}
          >
            <div
              style={{
                height: 124,
                width: 'calc(100% / 3) - 8px',
                background: 'red'
              }}
            ></div>
            <div
              style={{
                height: 124,
                width: 'calc(100% / 3) - 8px',
                background: 'red'
              }}
            ></div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default GpuStaking;
