import { CwIcs20LatestQueryClient, Uint128 } from '@oraichain/common-contracts-sdk';
import { AssetInfo, Ratio } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';
import {
  CoinGeckoId,
  CoinIcon,
  IBC_WASM_CONTRACT,
  NetworkChainId,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  TokenItemType,
  getTokenOnOraichain,
  getTokenOnSpecificChainId,
  NetworkName,
  BigDecimal,
  toAmount,
  COSMOS_CHAIN_ID_COMMON
} from '@oraichain/oraidex-common';
import {
  UniversalSwapHelper
  // swapFromTokens,
  // swapToTokens
} from '@oraichain/oraidex-universal-swap';
import { isMobile } from '@walletconnect/browser-utils';
import { swapFromTokens, swapToTokens, tokenMap } from 'config/bridgeTokens';
import { flattenTokensWithIcon, oraichainTokensWithIcon } from 'config/chainInfos';
import { PAIRS_CHART } from 'config/pools';
import { networks } from 'helper';
import { generateError } from 'libs/utils';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { FILTER_TIME_CHART, PairToken } from 'reducer/type';
import { TIMER, formatDate, formatTimeWithPeriod } from 'helper/timer';

export enum SwapDirection {
  From,
  To
}

export interface SimulateResponse {
  amount: Uint128;
  displayAmount: number;
}

export interface SwapData {
  metamaskAddress?: string;
  tronAddress?: string;
}

export const TYPE_TAB_HISTORY = {
  ASSETS: 'assets',
  HISTORY: 'history'
};

export interface NetworkFilter {
  label?: string;
  value?: string;
  Icon?: CoinIcon;
  IconLight?: CoinIcon;
}

export const initNetworkFilter = { label: 'All networks', value: '', Icon: undefined, IconLight: undefined };

/**
 * Get transfer token fee when universal swap
 * @param param0
 * @returns
 */
export const getTransferTokenFee = async ({ remoteTokenDenom }): Promise<Ratio | undefined> => {
  try {
    const ibcWasmContractAddress = IBC_WASM_CONTRACT;
    const ibcWasmContract = new CwIcs20LatestQueryClient(window.client, ibcWasmContractAddress);
    const ratio = await ibcWasmContract.getTransferTokenFee({ remoteTokenDenom });
    return ratio;
  } catch (error) {
    console.log({ error });
  }
};

export function filterNonPoolEvmTokens(
  chainId: string,
  coingeckoId: CoinGeckoId,
  denom: string,
  searchTokenName: string,
  direction: SwapDirection // direction = to means we are filtering to tokens
) {
  // basic filter. Dont include itself & only collect tokens with searched letters
  let listTokens = direction === SwapDirection.From ? swapFromTokens : swapToTokens;
  let filteredToTokens = listTokens.filter((token) => token.name.toLowerCase().includes(searchTokenName.toLowerCase()));

  // special case for tokens not having a pool on Oraichain
  if (UniversalSwapHelper.isSupportedNoPoolSwapEvm(coingeckoId)) {
    const swappableTokens = Object.keys(UniversalSwapHelper.swapEvmRoutes[chainId]).map((key) => key.split('-')[1]);
    const filteredTokens = filteredToTokens.filter((token) => swappableTokens.includes(token.contractAddress));

    // tokens that dont have a pool on Oraichain like WETH or WBNB cannot be swapped from a token on Oraichain
    if (direction === SwapDirection.To)
      return [...new Set(filteredTokens.concat(filteredTokens.map((token) => getTokenOnOraichain(token.coinGeckoId))))];
    filteredToTokens = filteredTokens;
  }
  // special case filter. Tokens on networks other than supported evm cannot swap to tokens, so we need to remove them
  if (!UniversalSwapHelper.isEvmNetworkNativeSwapSupported(chainId as NetworkChainId)) {
    return filteredToTokens.filter((t) => {
      // one-directional swap. non-pool tokens of evm network can swap be swapped with tokens on Oraichain, but not vice versa
      const isSupported = UniversalSwapHelper.isSupportedNoPoolSwapEvm(t.coinGeckoId);

      if (direction === SwapDirection.To) return !isSupported;
      if (isSupported) {
        // if we cannot find any matched token then we dont include it in the list since it cannot be swapped
        const sameChainId = getTokenOnSpecificChainId(coingeckoId, t.chainId as NetworkChainId);
        if (!sameChainId) return false;
        return true;
      }
      return true;
    });
  }

  return filteredToTokens.filter((t) => {
    // filter out to tokens that are on a different network & with no pool because we are not ready to support them yet. TODO: support
    if (UniversalSwapHelper.isSupportedNoPoolSwapEvm(t.coinGeckoId)) return t.chainId === chainId;
    return true;
  });
}

export const checkEvmAddress = (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
  switch (chainId) {
    case '0x01':
    case '0x38':
      if (!metamaskAddress) {
        throw generateError('Please login EVM wallet!');
      }
      break;
    case '0x2b6653dc':
      if (!tronAddress) {
        throw generateError('Please login Tron wallet!');
      }
  }
};

export const relayerFeeInfo = {
  [ORAI_BRIDGE_EVM_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX]: 6
};

export const AMOUNT_BALANCE_ENTRIES: [number, string, string][] = [
  [0.25, '25%', 'one-quarter'],
  [0.5, '50%', 'half'],
  [0.75, '75%', 'three-quarters'],
  [1, '100%', 'max']
];

export type SwapType = 'Swap' | 'Bridge' | 'Universal Swap';
export const getSwapType = ({
  fromChainId,
  toChainId,
  fromCoingeckoId,
  toCoingeckoId
}: {
  fromChainId: NetworkChainId;
  toChainId: NetworkChainId;
  fromCoingeckoId: CoinGeckoId;
  toCoingeckoId: CoinGeckoId;
}): SwapType => {
  if (fromChainId === 'Oraichain' && toChainId === 'Oraichain') return 'Swap';

  if (fromCoingeckoId === toCoingeckoId) return 'Bridge';

  return 'Universal Swap';
};

export const getExplorerScan = (chainId: NetworkChainId) => {
  switch (chainId) {
    case '0x01':
      return 'https://etherscan.io/tx';
    case '0x38':
      return 'https://bscscan.com/tx';
    case '0x2b6653dc':
      return 'https://tronscan.org/#/transaction';
    case '0x1ae6':
      return 'https://scan.kawaii.global/tx';
    case 'Oraichain':
      return 'https://scan.orai.io/txs';
    case 'osmosis-1':
      return 'https://www.mintscan.io/osmosis/tx';
    case 'cosmoshub-4':
      return 'https://www.mintscan.io/cosmos/tx';
    case 'injective-1':
      return 'https://explorer.injective.network/transaction';
    case 'kawaii_6886-1':
      return 'https://scan.kawaii.global/tx';
    case 'noble-1':
      return 'https://www.mintscan.io/noble/tx';
    default:
      return 'https://scan.orai.io/txs';
  }
};

// generate TradingView pair base on from & to token in universal-swap
export const generateNewSymbolV2 = (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  currentPair: PairToken
): PairToken | null => {
  let newTVPair: PairToken = { ...currentPair };

  const findedPair = PAIRS_CHART.find((p) => p.symbol.includes(fromToken.name) && p.symbol.includes(toToken.name));

  if (!findedPair) {
    // this case when user click button reverse swap flow  of pair NOT in pool.
    // return null to prevent re-call api of this pair.
    if (currentPair.symbol.split('/').includes(fromToken.name) && currentPair.symbol.split('/').includes(toToken.name))
      return null;
    newTVPair.symbol = `${fromToken.name}/${toToken.name}`;
    newTVPair.info = '';
  } else {
    // this case when user click button reverse swap flow of pair in pool.
    // return null to prevent re-call api of this pair.
    if (findedPair.symbol === currentPair.symbol) return null;
    newTVPair.symbol = findedPair.symbol;
    newTVPair.info = findedPair.info;
  }

  return newTVPair;
};

export const calculateFinalPriceChange = (
  isPairReverseSymbol: boolean,
  currentPrice: number,
  percentPriceChange: number
) => {
  if (!isPairReverseSymbol) return percentPriceChange;

  if (currentPrice === 0) return 0;
  return (currentPrice / (1 + percentPriceChange) - currentPrice) / currentPrice;
};

// generate chain base on to token in universal-swap
export const genCurrentChain = ({
  toToken,
  currentToChain
}: {
  toToken: TokenItemType;
  currentToChain: NetworkName | '';
}): NetworkName | '' => {
  let newCurrentToChain: NetworkName | '' = currentToChain;

  newCurrentToChain = networks?.find((chain) => chain.chainId === toToken.chainId)?.chainName || '';

  return newCurrentToChain;
};

export const formatTimeDataChart = (
  time: number | string,
  type: FILTER_TIME_CHART,
  lastDate: number,
  currentText: string = 'Now'
) => {
  if (!time) {
    return currentText;
  }

  const fmtTime = typeof time === 'string' ? new Date(time).getTime() : time * TIMER.MILLISECOND;
  return time === lastDate ? currentText : `${formatDate(fmtTime)} ${formatTimeWithPeriod(fmtTime)}`;
};

export const getTokenIcon = (token: TokenItemType, theme: string) => {
  let tokenIcon;
  const tokenInfo = oraichainTokensWithIcon.find((e) => e.coinGeckoId === token?.coinGeckoId);

  if (tokenInfo && Object.keys(tokenInfo.IconLight || tokenInfo.Icon || {}).length > 0) {
    tokenIcon = theme === 'light' ? tokenInfo?.IconLight || tokenInfo?.Icon : tokenInfo?.Icon;
  }
  return tokenIcon;
};

export const refreshBalances = async (
  loadingRefresh: boolean,
  setLoadingRefresh: (boolean) => void,
  { metamaskAddress, tronAddress, oraiAddress },
  callback
) => {
  try {
    if (loadingRefresh) return;
    setLoadingRefresh(true);
    await callback({ metamaskAddress, tronAddress, oraiAddress });
  } catch (err) {
    console.log({ err });
  } finally {
    setTimeout(() => {
      setLoadingRefresh(false);
    }, 2000);
  }
};

export const getFromToToken = (
  originalFromToken: TokenItemType,
  originalToToken: TokenItemType,
  fromTokenDenomSwap: string,
  toTokenDenomSwap: string
) => {
  const isEvmSwap = UniversalSwapHelper.isEvmSwappable({
    fromChainId: originalFromToken?.chainId,
    toChainId: originalToToken?.chainId,
    fromContractAddr: originalFromToken?.contractAddress,
    toContractAddr: originalToToken?.contractAddress
  });
  const fromToken = isEvmSwap
    ? tokenMap[fromTokenDenomSwap]
    : getTokenOnOraichain(tokenMap[fromTokenDenomSwap]?.coinGeckoId) ?? tokenMap[fromTokenDenomSwap];
  const toToken = isEvmSwap
    ? tokenMap[toTokenDenomSwap]
    : getTokenOnOraichain(tokenMap[toTokenDenomSwap]?.coinGeckoId) ?? tokenMap[toTokenDenomSwap];

  return { fromToken, toToken };
};

export const getRemoteDenom = (originalToken: TokenItemType) => {
  return originalToken.contractAddress ? originalToken.prefix + originalToken.contractAddress : originalToken.denom;
};

export const getTokenBalance = (originalToken: TokenItemType, amounts: AmountDetails, subAmount: bigint) => {
  return originalToken ? BigInt(amounts[originalToken.denom] ?? '0') + subAmount : BigInt(0);
};

export const getDisableSwap = ({
  originalToToken,
  walletByNetworks,
  swapLoading,
  fromAmountToken,
  toAmountToken,
  fromAmountTokenBalance,
  fromTokenBalance,
  addressTransfer,
  validAddress,
  simulateData,
  isLoadingSimulate
}) => {
  const mobileMode = isMobile();
  const canSwapToCosmos = !mobileMode && originalToToken.cosmosBased && !walletByNetworks.cosmos;
  const canSwapToEvm = !mobileMode && !originalToToken.cosmosBased && !walletByNetworks.evm;
  const canSwapToTron = !mobileMode && originalToToken.chainId === '0x2b6653dc' && !walletByNetworks.tron;
  const canSwapTo = canSwapToCosmos || canSwapToEvm || canSwapToTron;
  const disabledSwapBtn =
    swapLoading ||
    !fromAmountToken ||
    !toAmountToken ||
    fromAmountTokenBalance > fromTokenBalance || // insufficent fund
    !addressTransfer ||
    !validAddress.isValid ||
    isLoadingSimulate ||
    canSwapTo;

  let disableMsg: string;
  if (!validAddress.isValid) disableMsg = `Recipient address not found`;
  if (!addressTransfer) disableMsg = `Recipient address not found`;
  if (canSwapToCosmos) disableMsg = `Please connect cosmos wallet`;
  if (canSwapToEvm) disableMsg = `Please connect evm wallet`;
  if (canSwapToTron) disableMsg = `Please connect tron wallet`;
  if (!simulateData || simulateData.displayAmount <= 0) disableMsg = 'Enter an amount';
  if (fromAmountTokenBalance > fromTokenBalance) disableMsg = `Insufficient funds`;
  if (isLoadingSimulate) disableMsg = `Swap`;
  return { disabledSwapBtn, disableMsg };
};

/**
 * This function return protocols of smart route
 * Example: if has chainId is Cosmos at fromToken or toToken then return ['Oraidex', 'OraidexV3','Osmosis']
 * @param toToken
 * @param useIbcWasm
 * @returns string
 */
export const getProtocolsSmartRoute = (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  { useAlphaIbcWasm, useIbcWasm }
) => {
  const protocols = ['Oraidex', 'OraidexV3'];
  if (useIbcWasm && !useAlphaIbcWasm) return protocols;

  const allowOsmosisProtocols = ['injective-1', 'Neutaro-1', 'noble-1', 'osmosis-1', 'cosmoshub-4', 'celestia'];
  const isAllowOsmosisProtocol =
    allowOsmosisProtocols.includes(fromToken.chainId) || allowOsmosisProtocols.includes(toToken.chainId);

  if (isAllowOsmosisProtocol) return [...protocols, 'Osmosis'];
  return protocols;
};

const toCoinGeckoIds = ['osmosis', 'cosmos', 'oraichain-token', 'usd-coin'];
const listAllowSmartRoute = {
  'osmosis-1-Oraichain': {
    fromCoinGeckoIds: ['osmosis'],
    toCoinGeckoIds
  },
  'injective-1-Oraichain': {
    fromCoinGeckoIds: ['injective-protocol'],
    toCoinGeckoIds
  },
  'noble-1-Oraichain': {
    fromCoinGeckoIds: ['usd-coin'],
    toCoinGeckoIds: [...toCoinGeckoIds, 'injective-protocol']
  },
  'cosmoshub-4-Oraichain': {
    fromCoinGeckoIds: ['cosmos'],
    toCoinGeckoIds: [...toCoinGeckoIds]
  }
};

/**
 * This function check status using ibc wasm
 * Example:  Oraichain -> Oraichain + Cosmos (false) | Oraichain -> Evm (true) | Evm -> Evm + Oraichain + Cosmos (true) | Cosmos -> Cosmos + Oraichain (false) | Cosmos -> Evm (true)
 * @param fromToken
 * @param toToken
 * @returns boolean
 */
export const isAllowIBCWasm = (fromToken: TokenItemType, toToken: TokenItemType) => {
  return false;
};

export const isAllowAlphaIbcWasm = (fromToken: TokenItemType, toToken: TokenItemType) => {
  return true;
};

export const getAverageRatio = (
  simulateData: SimulateResponse,
  averageSimulateData: SimulateResponse,
  fromAmountToken: number,
  originalFromToken: TokenItemType
) => {
  let averageRatio = undefined;
  if (simulateData && fromAmountToken) {
    const displayAmount = new BigDecimal(simulateData.displayAmount).div(fromAmountToken).toNumber();
    averageRatio = {
      amount: toAmount(displayAmount ? displayAmount : averageSimulateData?.displayAmount, originalFromToken.decimals),
      displayAmount: displayAmount ? displayAmount : averageSimulateData?.displayAmount ?? 0
    };
  }
  return { averageRatio };
};

export const findKeyByValue = (obj, value: string) => Object.keys(obj).find((key) => obj[key] === value);

export const transformSwapInfo = (data) => {
  const transformedData = JSON.parse(JSON.stringify(data));
  transformedData.swapInfo = transformedData.swapInfo.map((swap, index) => {
    swap.tokenIn = transformedData.swapInfo[index ? index - 1 : index].tokenOut;
    return swap;
  });
  return transformedData;
};

export const getTokenInfo = (action, path, assetList) => {
  let info;
  let [TokenInIcon, TokenOutIcon] = [DefaultIcon, DefaultIcon];

  const tokenInAction = action.tokenIn;
  const tokenOutAction = action.tokenOut;

  const tokenInChainId = path.chainId;
  const tokenOutChainId = path.tokenOutChainId;

  if (action.type === 'Swap') {
    let tokenInInfo, tokenOutInfo;
    if (tokenInChainId === 'Oraichain') {
      const getLowerString = (string) => string?.toLowerCase();
      tokenInInfo = flattenTokensWithIcon.find((flatToken) =>
        [getLowerString(flatToken.contractAddress), getLowerString(flatToken.denom)].includes(
          getLowerString(tokenInAction)
        )
      );
      tokenOutInfo = flattenTokensWithIcon.find((flatToken) =>
        [getLowerString(flatToken.contractAddress), getLowerString(flatToken.denom)].includes(
          getLowerString(tokenOutAction)
        )
      );

      if (tokenInInfo?.Icon) {
        TokenInIcon = tokenInInfo.Icon;
      }
      if (tokenOutInfo?.Icon) {
        TokenOutIcon = tokenOutInfo.Icon;
      }
      info = {
        tokenIn: tokenInInfo?.name,
        tokenOut: tokenOutInfo?.name
      };
    } else {
      tokenInInfo = assetList.assets.find((asset) => asset.base === tokenInAction);
      tokenOutInfo = assetList.assets.find((asset) => asset.base === tokenOutAction);

      info = {
        tokenInInfo,
        tokenOutInfo,
        tokenIn: tokenInInfo.symbol,
        tokenOut: tokenOutInfo.symbol
      };
    }
  }

  if (action.type === 'Bridge') {
    const getTokenInfoBridge = (token, chainId) => {
      if (chainId === 'Oraichain') {
        const getLowerString = (string) => string?.toLowerCase();
        return flattenTokensWithIcon.find((flatToken) =>
          [getLowerString(flatToken.contractAddress), getLowerString(flatToken.denom)].includes(getLowerString(token))
        );
      }
      return assetList.assets.find((asset) => asset.base === token);
    };

    const tokenInInfo = getTokenInfoBridge(tokenInAction, tokenInChainId);
    const tokenOutInfo = getTokenInfoBridge(tokenOutAction, tokenOutChainId);
    console.log({ tokenInAction, tokenInChainId, tokenInInfo, tokenOutInfo });

    info = {
      tokenIn: tokenInChainId === 'Oraichain' ? tokenInInfo?.name : tokenInInfo?.symbol,
      tokenOut: tokenOutChainId === 'Oraichain' ? tokenOutInfo?.name : tokenOutInfo?.symbol,
      tokenInInfo,
      tokenOutInfo
    };

    if (tokenInChainId === 'Oraichain') TokenInIcon = tokenInInfo.Icon;
    if (tokenOutChainId === 'Oraichain') TokenOutIcon = tokenOutInfo.Icon;
  }

  return { info, TokenInIcon, TokenOutIcon };
};

export const getPathInfo = (path, chainIcons, assets) => {
  let [NetworkFromIcon, NetworkToIcon] = [DefaultIcon, DefaultIcon];

  const pathChainId = path.chainId.split('-')[0].toLowerCase();
  const pathTokenOut = path.tokenOutChainId.split('-')[0].toLowerCase();

  if (path.chainId) {
    const chainFrom = chainIcons.find((cosmos) => cosmos.chainId === path.chainId);
    NetworkFromIcon = chainFrom ? chainFrom.Icon : DefaultIcon;
  }

  if (path.tokenOutChainId) {
    const chainTo = chainIcons.find((cosmos) => cosmos.chainId === path.tokenOutChainId);
    NetworkToIcon = chainTo ? chainTo.Icon : DefaultIcon;
  }

  const getAssetsByChainName = (chainName) => assets.find(({ chain_name }) => chain_name === chainName)?.assets || [];

  const assetList = {
    assets: [...getAssetsByChainName(pathChainId), ...getAssetsByChainName(pathTokenOut)]
  };

  return { NetworkFromIcon, NetworkToIcon, assetList, pathChainId };
};

export const calculateInflationFromApr = async () => {
  const fetchData = async (endpoint) => {
    return fetch(`https://lcd.orai.io/${endpoint}`).then((data) => data.json());
  };

  const VAL_VOTING_POWER = 1000;
  const DAYS_IN_YEARS = 365.2425;
  const APR = 28.5;
  const RATE = 0.03;
  const { block_time } = await fetch('https://api.scan.orai.io/v1/status').then((data) => data.json());
  const delegatorsRewardPerDay = APR / ((DAYS_IN_YEARS / VAL_VOTING_POWER) * 100);
  const numBlocksPerDay = (60 / block_time) * 60 * 24;
  const delegatorsRewardPerBlock = delegatorsRewardPerDay / numBlocksPerDay;

  const valRewardPerBlock = delegatorsRewardPerBlock / (1 - RATE);

  let { bonded_tokens } = (await fetchData('cosmos/staking/v1beta1/pool')).pool;
  const { community_tax, base_proposer_reward, bonus_proposer_reward } = (
    await fetchData('cosmos/distribution/v1beta1/params')
  ).params;
  const voteMultiplier =
    1 - parseFloat(community_tax) - (parseFloat(base_proposer_reward) + parseFloat(bonus_proposer_reward));
  const blockRevision = valRewardPerBlock / ((VAL_VOTING_POWER / bonded_tokens) * voteMultiplier);

  const totalSupply = (await fetchData('cosmos/bank/v1beta1/supply/orai')).amount.amount;
  const { blocks_per_year } = (await fetchData('cosmos/mint/v1beta1/params')).params;
  const inflationRate = blockRevision / (totalSupply / blocks_per_year);

  return {
    inflationRate: inflationRate * 100,
    bonded_tokens
  }; // display in percentage
};
