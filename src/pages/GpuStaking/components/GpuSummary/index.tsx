import { toDisplay } from '@oraichain/oraidex-common';
import { formatDisplayUsdt, numberWithCommas } from 'helper/helpers';
import { REV_PER_HOUR, SCORAI_TOKEN_INFO } from 'pages/GpuStaking/constants';
import { useGetStakeInfo } from 'pages/GpuStaking/hooks';
import styles from './index.module.scss';
import { TIMER } from 'helper/timer';

const GpuSummary = () => {
  const { stakeInfo } = useGetStakeInfo(SCORAI_TOKEN_INFO.contractAddress);
  const allGpuRev = listDetail.reduce(
    (acc, cur) => {
      acc.max = acc.max + calcGpuRev(cur.valueMax);
      acc.min = acc.min + calcGpuRev(cur.valueMin);
      return acc;
    },
    {
      max: 0,
      min: 0
    }
  );

  return (
    <div className={styles.gpuSummary}>
      <h1>Summary</h1>

      <div className={styles.content}>
        <div className={styles.infoWrapper}>
          <div className={styles.info}>
            <h2>Total Staked</h2>
            <span className={styles.value}>
              {numberWithCommas(toDisplay(stakeInfo?.total_bond_amount || '0'))} scORAI
            </span>
          </div>
          <div className={styles.info}>
            <h2>Est. GPU-Usage Revenue (30 days)</h2>
            <span className={styles.value}>
              {formatDisplayUsdt(allGpuRev.min)} - {formatDisplayUsdt(allGpuRev.max)}
            </span>
          </div>
        </div>
        <div className={styles.divider}></div>

        <h1>Last Hour Usage</h1>
        <div className={styles.details}>
          {listDetail.map((e, key) => {
            const progress = (e.valueMax + e.valueMin) / 2;
            const value = calcGpuRevByHour(progress);

            return (
              <div className={styles.item} key={`${key}-${e.label}`}>
                <div className={styles.header}>
                  <h3 title={`${e.label}`}>{e.label}</h3>
                  <span>{formatDisplayUsdt(value)}</span>
                </div>
                <div className={styles.progress} title={`${progress}%`}>
                  <div className={styles.percent} style={{ width: `${progress}%` }}>
                    {progress >= 9 ? `${progress.toFixed(2)}%` : null}
                    {/* {`${e.progress}%`} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GpuSummary;

const calcGpuRev = (gpu: number) => {
  return ((REV_PER_HOUR * gpu) / 100) * TIMER.HOUR_OF_MONTH;
};

const calcGpuRevByHour = (gpu: number, hour = 1) => {
  return ((REV_PER_HOUR * gpu) / 100) * hour;
};

// TODO: query api and refetch interval 5 mins
const listDetail = [
  {
    label: 'aiRight Rev.',
    valueMax: 43.79,
    valueMin: 19.79
  },
  {
    label: 'DeFi Lens Rev.',
    valueMax: 32.25,
    valueMin: 17.16
  },
  {
    label: 'LLM Layer Rev.',
    valueMax: 16.13,
    valueMin: 10.89
  },
  {
    label: 'KawaiiQ Rev.',
    valueMax: 0,
    valueMin: 0
  },
  {
    label: 'Cupiee Rev.',
    valueMax: 7.72,
    valueMin: 3.49
  },
  {
    label: 'Trading Strategies and AI Agents Revenue',
    valueMax: 0,
    valueMin: 0
  }
];
