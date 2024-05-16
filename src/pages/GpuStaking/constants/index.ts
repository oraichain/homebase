import { oraichainTokens } from '@oraichain/oraidex-common/build/token';

export const REV_PER_HOUR = 3;

export const MONTHLY_SECOND = 30 * 24 * 60 * 60;

export const YEARLY_SECOND = 365 * 24 * 60 * 60;

export const STAKING_PERIOD = 7;

export const ORAIX_DECIMAL = 6;

export const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export enum STAKE_TAB {
  Stake = 'Stake',
  UnStake = 'Unstake'
}

export const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
// export const SCORAI_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
export const SCORAI_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'scorai');
export const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');
