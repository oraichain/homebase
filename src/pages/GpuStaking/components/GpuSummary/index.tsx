import { toDisplay } from '@oraichain/oraidex-common';
import { formatDisplayUsdt, numberWithCommas } from 'helper/helpers';
import { INTERVAL_TIME, RANDOM_RANGE_PERCENT, REV_PER_HOUR, SCORAI_TOKEN_INFO } from 'pages/GpuStaking/constants';
import { useGetStakeInfo } from 'pages/GpuStaking/hooks';
import styles from './index.module.scss';
import { TIMER } from 'helper/timer';
import useGetGpuInfo from 'pages/GpuStaking/hooks/useGetGpuInfo';
import { useEffect, useState } from 'react';

const GpuSummary = () => {
  const [list, setList] = useState(listDetail);
  const [allGpuRev, setAllGpuRev] = useState({
    mid: 0,
    max: 0,
    min: 0
  });
  const { stakeInfo } = useGetStakeInfo(SCORAI_TOKEN_INFO.contractAddress);

  const { data } = useGetGpuInfo();

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const processData = () => {
      const listFormat = listDetail.map((e) => {
        const dataGpu = data.find((d) => d.id === e.id);
        const posOrNeg = Math.random() < 0.5 ? -1 : 1;
        const plusNumber = posOrNeg * (RANDOM_RANGE_PERCENT * Math.random());

        const percentage = dataGpu?.memory_usage_percentage || 0;
        const updatePercentage = percentage + plusNumber;
        const fmtValue = updatePercentage < 0 ? 0 : updatePercentage;

        return {
          ...e,
          value: fmtValue,
          originValue: percentage
        };
      });

      const allGpuRev = listFormat.reduce(
        (acc, cur) => {
          // acc.max = acc.max + calcGpuRev(cur.valueMax);
          // acc.min = acc.min + calcGpuRev(cur.valueMin);
          acc.mid = acc.mid + cur.originValue;
          return acc;
        },
        {
          max: 0,
          min: 0,
          mid: 0
        }
      );

      setList(listFormat);
      setAllGpuRev(allGpuRev);
    };

    const interval = setInterval(processData, INTERVAL_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

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
              {/* {formatDisplayUsdt(allGpuRev.min)} - {formatDisplayUsdt(allGpuRev.max)} */}
              {formatDisplayUsdt(calcGpuRev(allGpuRev.mid))}
            </span>
          </div>
        </div>
        <div className={styles.divider}></div>

        <h1>Last Hour Usage</h1>
        <div className={styles.details}>
          {list.map((e, key) => {
            const progress = e.value;
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
                    {/* RANDOM_RANGE_PERCENT */}
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
    id: 'AIR',
    label: 'aiRight Rev.',
    valueMax: 43.79,
    valueMin: 19.79,
    value: 0,
    originValue: 0
  },
  {
    id: '',
    label: 'DeFi Lens Rev.',
    valueMax: 32.25,
    valueMin: 17.16,
    value: 0,
    originValue: 0
  },
  {
    id: 'LLM',
    label: 'LLM Layer Rev.',
    valueMax: 16.13,
    valueMin: 10.89,
    value: 0,
    originValue: 0
  },
  {
    id: '',
    label: 'KawaiiQ Rev.',
    valueMax: 0,
    valueMin: 0,
    value: 0,
    originValue: 0
  },
  {
    id: '',
    label: 'Cupiee Rev.',
    valueMax: 7.72,
    valueMin: 3.49,
    value: 0,
    originValue: 0
  },
  {
    id: '',
    label: 'Trading Strategies and AI Agents Revenue',
    valueMax: 0,
    valueMin: 0,
    value: 0,
    originValue: 0
  }
];
