import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as Arrow } from 'assets/icons/arrow_right.svg';
import { ReactComponent as OpenNewTabIcon } from 'assets/icons/jump.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as ScOraiIcon } from 'assets/icons/orchai.svg';
import { Button } from 'components/Button';
import { Table, TableHeaderProps } from 'components/Table';
import { numberWithCommas, toFixedIfNecessary } from 'helper/helpers';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configure';
import styles from './StakeSummary.module.scss';
import { useGetRewardPerSecInfo, useGetStakeInfo } from 'pages/GpuStaking/hooks';
import { SCORAI_TOKEN_INFO, USDC_TOKEN_INFO } from 'pages/GpuStaking/constants';
import { USDC_CONTRACT, toDisplay } from '@oraichain/oraidex-common';
import { calcAPY } from 'pages/GpuStaking/helpers';

export const StakeSummary: FC<{ data: any }> = ({ data: dataSummary }) => {
  const { data: prices } = useCoinGeckoPrices();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [address] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');

  const navigate = useNavigate();

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

  const sizePadding = isMobile() ? '12px' : '24px';

  const headersGPU: TableHeaderProps<any> = {
    asset: {
      name: 'ASSET',
      accessor: (data) => (
        <div className={styles.assets}>
          <div className={styles.left}>
            {theme === 'light' ? (
              <data.iconLight className={styles.tokenIcon} />
            ) : (
              <data.icon className={styles.tokenIcon} />
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.assetName}>{data.asset}</div>
            <div className={styles.assetChain}>{data.chain}</div>
          </div>
        </div>
      ),
      width: '40%',
      align: 'left',
      padding: `0px 0px 0px ${sizePadding}`
    },
    apy: {
      name: 'CURRENT APY',
      width: '30%',
      accessor: (data) => <div className={styles.apy}>{Number(data.apy.toFixed(2))}%</div>,
      align: 'left'
    },
    total: {
      name: 'TOTAL STAKED',
      width: '30%',
      align: 'left',
      accessor: (data) => (
        <div className={styles.total}>
          {numberWithCommas(toFixedIfNecessary(data.total.toString(), isMobile() ? 3 : 6))}
          <span className={styles.asset}>&nbsp;{data.asset}</span>
        </div>
      )
    }
  };

  const headersOrai: TableHeaderProps<any> = {
    asset: {
      name: 'ASSET',
      accessor: (data) => (
        <div className={styles.assets}>
          <div className={styles.left}>
            {theme === 'light' ? (
              <data.iconLight className={styles.tokenIcon} />
            ) : (
              <data.icon className={styles.tokenIcon} />
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.assetName}>{data.asset}</div>
          </div>
        </div>
      ),
      width: '40%',
      align: 'left',
      padding: `0px 0px 0px ${sizePadding}`
    },
    apy: {
      name: 'CURRENT APR',
      width: '30%',
      accessor: (data) => <div className={styles.apy}>{Number(data.apr.toFixed(2))}%</div>,
      align: 'left'
    },
    total: {
      name: 'TOTAL STAKED',
      width: '30%',
      align: 'left',
      accessor: (data) => (
        <div className={styles.total}>
          {numberWithCommas(toFixedIfNecessary(data.total.toString(), isMobile() ? 3 : 6))}
          <span className={styles.asset}>&nbsp;{data.asset}</span>
        </div>
      )
    }
  };

  const dataGPU = [
    {
      iconLight: ScOraiIcon,
      icon: ScOraiIcon,
      apy: apy,
      total: toDisplay(stakeInfo?.total_bond_amount || '0'),
      asset: 'scORAI'
    }
  ];

  const dataOrai = [
    {
      iconLight: OraiLightIcon,
      icon: OraiIcon,
      apr: Number(dataSummary?.ratio_bonded) || 0,
      total: dataSummary?.total_delegated || 0,
      asset: 'ORAI'
    }
  ];

  return (
    <div className={styles.staking}>
      <div className={styles.detail}>
        <div className={styles.header}>
          <h1>GPU Staking</h1>
          <span className={styles.desc}>
            Compound staking to earn GPU demand and block rewards
            <a href="/" target="_blank" rel="noopener noreferrer">
              Learn more <OpenNewTabIcon />
            </a>
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.table}>
            <Table
              headers={headersGPU}
              data={dataGPU}
              stylesColumn={{
                padding: '16px 0'
              }}
            />
          </div>

          <Button type="primary" onClick={() => navigate('/gpu-staking')}>
            Stake&nbsp;
            <Arrow />
          </Button>
        </div>
      </div>

      <div className={styles.detail}>
        <div className={styles.header}>
          <h1>ORAI Staking</h1>
          <span className={styles.desc}>Delegate your ORAI to earn rewards</span>
        </div>

        <div className={styles.content}>
          <div className={styles.table}>
            <Table
              headers={headersOrai}
              data={dataOrai}
              stylesColumn={{
                padding: '16px 0'
              }}
            />
          </div>
          <Button type="third" onClick={() => window.open('https://scan.orai.io/validators', '_blank').focus()}>
            Stake on OraiScan&nbsp;
            <OpenNewTabIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StakeSummary;
