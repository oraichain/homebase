import { USDC_CONTRACT, toDisplay } from '@oraichain/oraidex-common';
import { Cw20StakingClient } from '@oraichain/oraidex-contracts-sdk';
import { ReactComponent as KadoIcon } from 'assets/icons/ic_kado.svg';
import { ReactComponent as SwapIcon } from 'assets/icons/swap_ic.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import { formatDisplayUsdt, numberWithCommas } from 'helper/helpers';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import BuyOraiModal from 'layouts/BuyOraiModal';
import Content from 'layouts/Content';
import { getUsd } from 'libs/utils';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configure';
import GpuSummary from './components/GpuSummary';
import StakingForm from './components/StakingForm';
import { SCORAI_TOKEN_INFO, USDC_TOKEN_INFO } from './constants';
import { calcAPY, calcMonthlyReward } from './helpers';
import { useGetLockInfo, useGetMyStakeRewardInfo, useGetRewardPerSecInfo, useGetStakeInfo } from './hooks';
import styles from './index.module.scss';

const GpuStaking: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { data: prices } = useCoinGeckoPrices();
  const loadOraichainToken = useLoadOraichainTokens();
  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [openBuy, setOpenBuy] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const balance = amounts['scorai'];
  const [address] = useConfigReducer('address');

  const { lockInfo, refetchLockInfo } = useGetLockInfo(SCORAI_TOKEN_INFO.contractAddress, address);

  const { myStakeRewardInfo, refetchMyStakeRewardInfo } = useGetMyStakeRewardInfo(
    SCORAI_TOKEN_INFO.contractAddress,
    address
  );
  const lockAmount = lockInfo?.lockAmount || '0';
  const lockUsd = getUsd(lockAmount, SCORAI_TOKEN_INFO, prices);

  const stakedAmount = myStakeRewardInfo?.stakedAmount || '0';
  const stakeAmountUsd = getUsd(stakedAmount, SCORAI_TOKEN_INFO, prices);

  const reward = myStakeRewardInfo?.rewardPending || '0';
  const rewardUsd = getUsd(reward, USDC_TOKEN_INFO, prices);

  const { stakeInfo } = useGetStakeInfo(SCORAI_TOKEN_INFO.contractAddress);
  const { rewardPerSec } = useGetRewardPerSecInfo(SCORAI_TOKEN_INFO.contractAddress);

  const rewardPerSecInfo = rewardPerSec?.[0] || {
    amount: '0',
    info: {
      token: {
        contract_addr: USDC_CONTRACT
      }
    },
    token: USDC_TOKEN_INFO
  };

  const apy = calcAPY(rewardPerSecInfo.amount, stakeInfo?.total_bond_amount || '0', prices);

  const epochRev = calcMonthlyReward(rewardPerSecInfo.amount, prices);

  const handleClaim = async () => {
    setLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const cw20StakingClient = new Cw20StakingClient(window.client, address, network.staking_oraix);

      const result = await cw20StakingClient.withdraw({
        stakingToken: SCORAI_TOKEN_INFO.contractAddress
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        loadOraichainToken(address, [USDC_TOKEN_INFO.contractAddress]);
        refetchMyStakeRewardInfo();
        refetchLockInfo();
      }
    } catch (error) {
      console.log('error in claim: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoading(false);
    }
  };

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
            <span className={styles.value}>
              {numberWithCommas(toDisplay(balance), undefined, { maximumFractionDigits: 6 })} scORAI
            </span>
            <span className={styles.usd}>{formatDisplayUsdt(getUsd(balance, SCORAI_TOKEN_INFO, prices))}</span>

            <div className={styles.btn}>
              <Button type="third-sm" onClick={() => navigate('/?from=usdt&to=scorai')}>
                <SwapIcon />
                Swap
              </Button>
              <Button type="third-sm" onClick={() => setOpenBuy(true)}>
                <KadoIcon />
                Buy
              </Button>
            </div>
          </div>
          <div className={classNames(styles.item, styles.claimable)}>
            <h2>Claimable Reward</h2>
            <span className={styles.value}>+{numberWithCommas(toDisplay(reward))} USDC</span>
            <span className={styles.usd}>{formatDisplayUsdt(rewardUsd)}</span>

            <div className={styles.btn}>
              <Button type="third-sm" onClick={() => handleClaim()} disabled={loading || toDisplay(reward) <= 0}>
                {loading && <Loader width={22} height={22} />}&nbsp;
                <UsdcIcon className={styles.coin} />
                &nbsp;Claim
              </Button>
            </div>
          </div>
          <div className={classNames(styles.item, styles.apy)}>
            <h2>Current APY</h2>
            <span className={styles.value}>{Number(apy).toFixed(2)}%</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.stake}>
            <StakingForm />
          </div>
          {/* <div> */}
          <div className={styles.info}>
            <div className={styles.detail}>
              <h2>Your Stake</h2>
              <span className={styles.value}>{numberWithCommas(toDisplay(stakedAmount))} scORAI</span>
              <span className={styles.usd}>{formatDisplayUsdt(stakeAmountUsd)}</span>
            </div>
            <div className={styles.detail}>
              <h2>Unbonding</h2>
              <span className={styles.value}>
                {numberWithCommas(toDisplay(lockAmount), undefined, { maximumFractionDigits: 6 })} scORAI
              </span>
              <span className={styles.usd}>{formatDisplayUsdt(lockUsd)}</span>
            </div>
          </div>
          {/* </div> */}
        </div>

        <GpuSummary epochRev={epochRev} />
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
