import { Cw20Coin } from '@oraichain/common-contracts-sdk';
import { InstantiateMarketingInfo } from '@oraichain/common-contracts-sdk/build/Cw20Base.types';
import {
  validateNumber,
  INJECTIVE_CONTRACT,
  ORAI,
  USDC_CONTRACT,
  ORAIX_CONTRACT,
  BigDecimal,
  GAS_ESTIMATION_BRIDGE_DEFAULT,
  TokenItemType
} from '@oraichain/oraidex-common';
import { Asset, AssetInfo } from '@oraichain/oraidex-contracts-sdk';
import { MinterResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';
import { formatDate } from './timer';
import { TIMER } from './timer';
import { FILTER_DAY } from 'reducer/type';
import axios from 'rest/request';
import { feeEstimate } from 'helper';

// TODO: hardcode reverse symbol for ORAI/INJ,USDC/ORAIX, need to update later
export const reverseSymbolArr = [
  [
    {
      denom: INJECTIVE_CONTRACT,
      coinGeckoId: 'injective-protocol'
    },
    {
      denom: ORAI,
      coinGeckoId: 'orai'
    }
  ],
  [
    {
      denom: USDC_CONTRACT,
      coinGeckoId: 'usd-coin'
    },
    {
      denom: ORAIX_CONTRACT,
      coinGeckoId: 'oraidex'
    }
  ]
];

export type ListTokenJsMsg = {
  initialBalances?: Cw20Coin[];
  mint?: MinterResponse;
  marketing?: InstantiateMarketingInfo;
  label?: string;
  name?: string;
  symbol: string;
  liquidityPoolRewardAssets: Asset[];
  pairAssetInfo: AssetInfo;
  targetedAssetInfo?: AssetInfo;
};

const generateMsgFrontierAddToken = (tokenMsg: ListTokenJsMsg) => {
  const {
    symbol,
    liquidityPoolRewardAssets,
    label,
    pairAssetInfo,
    marketing,
    mint,
    initialBalances,
    name,
    targetedAssetInfo
  } = tokenMsg;
  const msgAddTokenFrontier: ListTokenJsMsg = {
    symbol,
    liquidityPoolRewardAssets,
    pairAssetInfo,
    targetedAssetInfo
  };
  if (mint) msgAddTokenFrontier.mint = mint;
  if (initialBalances) msgAddTokenFrontier.initialBalances = initialBalances;

  if (marketing) msgAddTokenFrontier.marketing = marketing;
  if (name) msgAddTokenFrontier.name = name;
  if (label) msgAddTokenFrontier.label = label;
  msgAddTokenFrontier.pairAssetInfo = pairAssetInfo;
  return msgAddTokenFrontier;
};

const getInfoLiquidityPool = ({ denom, contract_addr }) => {
  if (contract_addr)
    return {
      token: {
        contract_addr
      }
    };
  return { native_token: { denom } };
};

const getSymbolPools = (baseDenom: string, quoteDenom: string, originalSymbols: string) => {
  let symbols = originalSymbols;
  if (reverseSymbolArr.some((item) => item[0].denom === baseDenom && item[1].denom === quoteDenom)) {
    symbols = originalSymbols.split('/').reverse().join('/');
  }
  return symbols;
};

const isBigIntZero = (value: BigInt): boolean => {
  return value === BigInt(0);
};

export const parseAssetOnlyDenom = (assetInfo: AssetInfo) => {
  if ('native_token' in assetInfo) return assetInfo.native_token.denom;
  return assetInfo.token.contract_addr;
};

// TODO: need to seperate format funcs to format module later.
export const formatDisplayUsdt = (amount: number | string, dp = 2): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) return `$${toFixedIfNecessary(amount.toString(), 4).toString()}`;

  return `$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp), undefined, { maximumFractionDigits: 6 })}`;
  // return `$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp))}`;
};

export const formatDisplayClaimable = (amount: number | string, dp = 2): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) {
    const displayValue = toFixedIfNecessary(amount.toString(), 4);
    return !displayValue ? '0' : `+$${toFixedIfNecessary(amount.toString(), 4).toString()}`;
  }

  return `$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp), undefined, { maximumFractionDigits: 6 })}`;
  // return `+$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp))}`;
};

export const toFixedIfNecessary = (value: string, dp: number): number => {
  return +parseFloat(value).toFixed(dp);
};

// add `,` when split thounsand value.
export const numberWithCommas = (
  x: number,
  locales: Intl.LocalesArgument = undefined,
  options: Intl.NumberFormatOptions = {}
) => {
  if (isNegative(x)) return '0';
  return x.toLocaleString(locales, options);
};

export const isNegative = (number) => number <= 0;
/**
 * Estmate LP share when provide liquidity pool
 * @param baseAmount input base amount
 * @param quoteAmount input quote amount
 * @param totalShare total LP share of pool
 * @param totalBaseAmount total base amount in pool
 * @param totalQuoteAmount total quote amount in pool
 * @returns // min(1, 2)
  // 1. sqrt(deposit_0 * exchange_rate_0_to_1 * deposit_0) * (total_share / sqrt(pool_0 * pool_1))
  // == deposit_0 * total_share / pool_0
  // 2. sqrt(deposit_1 * exchange_rate_1_to_0 * deposit_1) * (total_share / sqrt(pool_1 * pool_1))
  // == deposit_1 * total_share / pool_1
 */
export const estimateShare = ({
  baseAmount,
  quoteAmount,
  totalShare,
  totalBaseAmount,
  totalQuoteAmount
}: {
  baseAmount: number;
  quoteAmount: number;
  totalShare: number;
  totalBaseAmount: number;
  totalQuoteAmount: number;
}): number => {
  if (totalBaseAmount === 0 || totalQuoteAmount === 0 || !totalShare) return 0;

  const share = Math.min(
    Number((baseAmount * totalShare) / totalBaseAmount),
    Number((quoteAmount * totalShare) / totalQuoteAmount)
  );
  return share;
};

export { generateMsgFrontierAddToken, getInfoLiquidityPool, isBigIntZero, getSymbolPools };

export const getInclude = (list, condition) => {
  let i = 0;
  while (i < list.length) {
    if (condition(list[i])) return i;
    i++;
  }
  return -1;
};

export const endOfWeek = (date: Date) => {
  const lastDayOfWeek = date.getDate() - (date.getDay() - 1) + 6;
  const endDateOfWeek = new Date(date.setDate(lastDayOfWeek));
  const now = new Date();

  return endDateOfWeek >= now ? now : endDateOfWeek;
};

export const endOfMonth = (date: Date) => {
  const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const now = new Date();
  return lastDateOfMonth >= now ? now : lastDateOfMonth;
};

export const formatTimeDataChart = (
  time: number | string,
  type: FILTER_DAY,
  lastDate: number,
  currentText: string = 'Now'
) => {
  if (!time) {
    return currentText;
  }

  const fmtTime = typeof time === 'string' ? new Date(time).getTime() : time * TIMER.MILLISECOND;
  const date = new Date(fmtTime);

  switch (type) {
    case FILTER_DAY.DAY:
      return time === lastDate ? currentText : formatDate(fmtTime);

    case FILTER_DAY.WEEK:
      return formatDate(fmtTime) + ' - ' + formatDate(endOfWeek(date));

    case FILTER_DAY.MONTH:
      return formatDate(fmtTime) + ' - ' + formatDate(endOfMonth(date));
  }
};

export const formatNumberKMB = (num: number) => {
  if (num >= 1e9) {
    return '$' + (num / 1e9).toFixed(2) + 'B';
  }

  if (num >= 1e6) {
    return '$' + (num / 1e6).toFixed(2) + 'M';
  }

  if (num >= 1e3) {
    return '$' + (num / 1e3).toFixed(2) + 'K';
  }
  return formatDisplayUsdt(num, 2);
};

export const getUtxos = async (address: string, baseUrl: string) => {
  if (!address) throw Error('Address is not empty');
  if (!baseUrl) throw Error('BaseUrl is not empty');
  const { data } = await axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/address/${address}/utxo`
  });
  return data;
};

export const calcMaxAmount = ({
  maxAmount,
  token,
  coeff,
  gas = GAS_ESTIMATION_BRIDGE_DEFAULT
}: {
  maxAmount: number;
  token: TokenItemType;
  coeff: number;
  gas?: number;
}) => {
  if (!token) return maxAmount;

  let finalAmount = maxAmount;

  const feeCurrencyOfToken = token.feeCurrencies?.find((e) => e.coinMinimalDenom === token.denom);

  if (feeCurrencyOfToken) {
    const useFeeEstimate = feeEstimate(token, gas);

    if (coeff === 1) {
      finalAmount = useFeeEstimate > finalAmount ? 0 : new BigDecimal(finalAmount).sub(useFeeEstimate).toNumber();
    } else {
      finalAmount =
        useFeeEstimate > new BigDecimal(maxAmount).sub(new BigDecimal(finalAmount).mul(coeff)).toNumber()
          ? 0
          : finalAmount;
    }
  }

  return finalAmount;
};
