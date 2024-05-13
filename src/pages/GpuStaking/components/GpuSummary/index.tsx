import { formatDisplayUsdt, numberWithCommas } from 'helper/helpers';
import styles from './index.module.scss';

const GpuSummary = () => {
  return (
    <div className={styles.gpuSummary}>
      <h1>Summary</h1>

      <div className={styles.content}>
        <div className={styles.infoWrapper}>
          <div className={styles.info}>
            <h2>Total staked</h2>
            <span className={styles.value}>{numberWithCommas(51409892)} scORAI</span>
          </div>
          <div className={styles.info}>
            <h2>GPU-Usage Revenue</h2>
            <span className={styles.value}>{formatDisplayUsdt(51409892)}</span>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.details}>
          {listDetail.map((e, key) => {
            return (
              <div className={styles.item} key={`${key}-${e.label}`}>
                <div className={styles.header}>
                  <h3>{e.label}</h3>
                  <span>{formatDisplayUsdt(e.value)}</span>
                </div>
                <div className={styles.progress}>
                  <div className={styles.percent} style={{ width: `${e.progress}%` }}>
                    {e.progress >= 9 ? `${e.progress}%` : null}
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

const listDetail = [
  {
    label: 'aiRight Rev.',
    progress: 28,
    value: 44319.04
  },
  {
    label: 'DeFi Lens Rev.',
    progress: 18,
    value: 44319.04
  },
  {
    label: 'LLM Layer Rev.',
    progress: 12,
    value: 44319.04
  },
  {
    label: 'KawaiiQ Rev.',
    progress: 9,
    value: 44319.04
  },
  {
    label: 'Cupiee Rev.',
    progress: 7,
    value: 44319.04
  },
  {
    label: 'Trading Strategies and AI Agents Revenue',
    progress: 1,
    value: 943.04
  }
];
