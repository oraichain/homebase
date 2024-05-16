import { CW20_DECIMALS, CoinIcon, getSubAmountDetails, toAmount, toDisplay, tokenMap } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as KadoIcon } from 'assets/icons/ic_kado.svg';
import StakeIcon from 'assets/icons/stake.svg';
import WalletIcon from 'assets/icons/wallet-v3.svg';
import cn from 'classnames/bind';
import { Table, TableHeaderProps } from 'components/Table';
import { flattenTokens } from 'config/bridgeTokens';
import { tokensIcon } from 'config/chainInfos';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getTotalUsd, toSumDisplay } from 'libs/utils';
import { formatDisplayUsdt, toFixedIfNecessary } from 'helper/helpers';
import { useGetMyStake } from 'pages/Pools/hooks';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { AssetInfoResponse } from 'types/swap';
import styles from './AssetsTab.module.scss';
import { SendModal } from '../Swap/components/SendModal';
import classNames from 'classnames';
import ToggleSwitch from 'components/ToggleSwitch';

const cx = cn.bind(styles);

export const AssetsTab: FC<{ networkFilter: string; openBuyModal: () => void }> = ({ networkFilter, openBuyModal }) => {
  const { data: prices } = useCoinGeckoPrices();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [address] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useState(true);
  const [openModalSend, setOpenModalSend] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({});

  const sizePadding = isMobile() ? '12px' : '24px';
  const { totalStaked } = useGetMyStake({
    stakerAddress: address
  });
  let totalUsd: number = getTotalUsd(amounts, prices);
  if (networkFilter) {
    const subAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId === networkFilter)
    );
    totalUsd = getTotalUsd(subAmounts, prices);
  }

  let listAsset: {
    src?: CoinIcon;
    label?: string;
    balance?: number | string;
  }[] = [
    {
      src: WalletIcon,
      label: 'Total balance',
      balance: formatDisplayUsdt(totalUsd)
    }
  ];

  if (!networkFilter || networkFilter === 'Oraichain') {
    listAsset = [
      ...listAsset,
      {
        src: StakeIcon,
        label: 'Total staked',
        balance: formatDisplayUsdt(toDisplay(BigInt(Math.trunc(totalStaked)), CW20_DECIMALS))
      }
    ];
  }

  const data = flattenTokens
    .reduce((result, token) => {
      // not display because it is evm map and no bridge to option, also no smart contract and is ibc native
      if (token.bridgeTo || token.contractAddress) {
        const isValidNetwork = !networkFilter || token.chainId === networkFilter;
        if (isValidNetwork) {
          const amount = BigInt(amounts[token.denom] ?? 0);
          const isHaveSubAmounts = token.contractAddress && token.evmDenoms;
          const subAmounts = isHaveSubAmounts ? getSubAmountDetails(amounts, token) : {};
          const totalAmount = amount + (isHaveSubAmounts ? toAmount(toSumDisplay(subAmounts), token.decimals) : 0n);
          const value = toDisplay(totalAmount.toString(), token.decimals) * (prices[token.coinGeckoId] || 0);

          const SMALL_BALANCE = 0.5;
          const isHide = hideOtherSmallAmount && value < SMALL_BALANCE;
          if (isHide) return result;

          const tokenIcon = tokensIcon.find((tIcon) => tIcon.coinGeckoId === token.coinGeckoId);
          result.push({
            name: token.name,
            coinGeckoId: token.coinGeckoId,
            contractAddress: token?.contractAddress,
            symbol: token.name,
            chainName: token.org,
            icon: tokenIcon?.Icon,
            iconLight: tokenIcon?.IconLight,
            price: prices[token.coinGeckoId] || 0,
            balance: toDisplay(totalAmount.toString(), token.decimals),
            denom: token.denom,
            value,
            coeff: 0,
            coeffType: 'increase'
          });
        }
      }

      return result;
    }, [])
    .sort((a, b) => b.value - a.value);

  const headers: TableHeaderProps<AssetInfoResponse> = {
    assets: {
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
            <div className={styles.assetName}>{data.name}</div>
            <div className={styles.assetChain}>{data.chainName}</div>
          </div>
        </div>
      ),
      width: '30%',
      align: 'left',
      padding: `0px 0px 0px ${sizePadding}`
    },
    price: {
      name: 'PRICE',
      width: '20%',
      accessor: (data) => <div className={styles.price}>${Number(data.price.toFixed(6))}</div>,
      align: 'left'
    },
    balance: {
      name: 'BALANCE',
      width: '20%',
      align: 'left',
      accessor: (data) => (
        <div className={cx('balance', `${!data.balance && 'balance-low'}`)}>
          {toFixedIfNecessary(data.balance.toString(), isMobile() ? 3 : 6)}
          {/* {numberWithCommas(toFixedIfNecessary(data.balance.toString(), isMobile() ? 3 : 6))}{' '} */}
          <span className={cx('balance-assets')}>&nbsp;{data.name}</span>
        </div>
      )
    },
    value: {
      name: 'VALUE',
      width: '20%',
      align: 'left',
      padding: '0px 8px 0px 0px',
      accessor: (data) => {
        return (
          <div className={styles.valuesColumn}>
            <div>
              <div className={styles.value}>{formatDisplayUsdt(data.value)}</div>
            </div>
          </div>
        );
      }
    },
    action: {
      name: 'ACTION',
      width: '12%',
      align: 'left',
      padding: '0px 8px 0px 0px',
      accessor: (data) => {
        if (data.chainName !== 'Oraichain') return;

        return (
          <div className={styles.valuesColumn}>
            <button
              disabled={data.chainName !== 'Oraichain'}
              title={data.chainName !== 'Oraichain' ? 'Feature only support for token on Oraichain' : undefined}
              className={classNames(styles.action, { [styles.disabled]: data.chainName !== 'Oraichain' })}
              onClick={(event) => {
                event.stopPropagation();
                setTokenInfo(openModalSend ? {} : data);
                setOpenModalSend(!openModalSend);
              }}
            >
              Send
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className={cx('assetsTab')}>
      <div className={cx('info')}>
        <div className={cx('title')}>
          <span className={cx('index')}>02</span>
          <span>Manage your assets</span>
        </div>

        <div className={cx('usd')}>{formatDisplayUsdt(totalUsd)}</div>
      </div>

      <div className={cx('handle-wrapper')}>
        <button
          className={cx('btn')}
          onClick={() => {
            openBuyModal();
          }}
        >
          <KadoIcon />
          Buy Crypto with fiat
        </button>
        <div className={cx('switch')}>
          <ToggleSwitch
            small={true}
            id="small-balances"
            checked={hideOtherSmallAmount}
            onChange={() => setHideOtherSmallAmount(!hideOtherSmallAmount)}
          />
          <label htmlFor="small-balances">Hide small balances!</label>
        </div>
      </div>
      <div className={cx('table')}>
        <Table
          headers={headers}
          data={data}
          stylesColumn={{
            padding: '16px 0'
          }}
        />
      </div>

      <SendModal
        isOpen={openModalSend}
        open={() => setOpenModalSend(true)}
        close={() => setOpenModalSend(false)}
        tokenInfo={tokenInfo}
        address={address}
      />
    </div>
  );
};
