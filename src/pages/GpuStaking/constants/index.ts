import { oraichainTokens } from '@oraichain/oraidex-common/build/token';
import { TIMER } from 'helper/timer';

export const REV_PER_HOUR = 3;

export const MONTHLY_SECOND = 30 * 24 * 60 * 60;

export const YEARLY_SECOND = 365 * 24 * 60 * 60;

export const STAKING_PERIOD = 7;

export const ORAIX_DECIMAL = 6;
export const RANDOM_RANGE_PERCENT = 5;
export const INTERVAL_TIME = 1000;
export const INTERVAL_TIME_REFETCH = 3 * 60 * TIMER.MILLISECOND;

export enum STAKE_TAB {
  Stake = 'Stake',
  UnStake = 'Unstake'
}

export const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
// export const SCORAI_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
export const SCORAI_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'scorai');
export const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');
