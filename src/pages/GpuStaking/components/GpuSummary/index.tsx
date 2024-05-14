import { toDisplay } from '@oraichain/oraidex-common';
import { formatDisplayUsdt, numberWithCommas } from 'helper/helpers';
import { REV_PER_SECOND, SCORAI_TOKEN_INFO, TIMER } from 'pages/GpuStaking/constants';
import { useGetStakeInfo } from 'pages/GpuStaking/hooks';
import styles from './index.module.scss';

// Team	GPU Memory Usage
// 	          Min	    Med	    Max
// aiRight	  19,79%	-	      43,79%
// DeFi Lens	17,16%	-	      32,25%
// LLM	      10,89%	-	      16,13%
// KawaiiQ	  0	      0	      0	        Chưa dùng gpu
// Cupiee	    3,49%	  -	      7,72%
// AI-based Trading Strategies and AI Agents	0	0	0	Dùng cpu

const GpuSummary = () => {
  const { stakeInfo } = useGetStakeInfo(SCORAI_TOKEN_INFO.contractAddress);
  const allGpuRev = listDetail.reduce((acc, cur) => {
    acc = acc + cur.value;
    return acc;
  }, 0);

  return (
    <div className={styles.gpuSummary}>
      <h1>Summary</h1>

      <div className={styles.content}>
        <div className={styles.infoWrapper}>
          <div className={styles.info}>
            <h2>Total staked</h2>
            <span className={styles.value}>
              {numberWithCommas(toDisplay(stakeInfo?.total_bond_amount || '0'))} scORAI
            </span>
          </div>
          <div className={styles.info}>
            <h2>GPU-Usage Revenue</h2>
            <span className={styles.value}>{formatDisplayUsdt(allGpuRev)}</span>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.details}>
          {listDetail.map((e, key) => {
            return (
              <div className={styles.item} key={`${key}-${e.label}`}>
                <div className={styles.header}>
                  <h3 title={`${e.label}`}>{e.label}</h3>
                  <span>{formatDisplayUsdt(e.value)}</span>
                </div>
                <div className={styles.progress} title={`${e.progress}%`}>
                  <div className={styles.percent} style={{ width: `${e.progress}%` }}>
                    {e.progress >= 9 ? `${e.progress}%` : null}
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

const calcGpuRev = (gpu) => {
  return ((REV_PER_SECOND * gpu) / 100) * TIMER.SECOND_OF_WEEK;
};

const listDetail = [
  {
    label: 'aiRight Rev.',
    progress: 31.79,
    value: calcGpuRev(31.79)
  },
  {
    label: 'DeFi Lens Rev.',
    progress: 24.71,
    value: calcGpuRev(24.71)
  },
  {
    label: 'LLM Layer Rev.',
    progress: 13.51,
    value: calcGpuRev(13.51)
  },
  {
    label: 'KawaiiQ Rev.',
    progress: 0,
    value: calcGpuRev(0)
  },
  {
    label: 'Cupiee Rev.',
    progress: 5.61,
    value: calcGpuRev(5.61)
  },
  {
    label: 'Trading Strategies and AI Agents Revenue',
    progress: 0,
    value: calcGpuRev(0)
  }
];
