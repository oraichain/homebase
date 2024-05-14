import { useState } from 'react';
import { STAKE_TAB } from '../../constants';
import StakeTab from '../StakeTab';
import UnStakeTab from '../UnStakeTab';
import styles from './index.module.scss';

const StakingForm = () => {
  const [tab, setTab] = useState<STAKE_TAB>(STAKE_TAB.Stake);

  return (
    <div className={styles.stakingForm}>
      <div className={styles.tabWrapper}>
        <div
          onClick={() => setTab(STAKE_TAB.Stake)}
          className={`${styles.tab} ${tab === STAKE_TAB.Stake ? styles.active : ''}`}
        >
          {STAKE_TAB.Stake}
        </div>
        <div
          onClick={() => setTab(STAKE_TAB.UnStake)}
          className={`${styles.tab} ${tab === STAKE_TAB.UnStake ? styles.active : ''}`}
        >
          {STAKE_TAB.UnStake}
        </div>
      </div>

      <div className={styles.tabContent}>
        {tab === STAKE_TAB.Stake && <StakeTab />}
        {tab === STAKE_TAB.UnStake && <UnStakeTab />}
      </div>
    </div>
  );
};

export default StakingForm;
