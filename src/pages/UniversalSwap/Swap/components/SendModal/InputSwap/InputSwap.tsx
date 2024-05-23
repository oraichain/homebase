import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import cn from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { TokenInfo } from 'types/token';
import styles from './InputSwap.module.scss';
import { chainInfosWithIcon } from 'config/chainInfos';
import { Themes } from 'context/theme-context';
import { numberWithCommas } from 'helper/helpers';

const cx = cn.bind(styles);

export const AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP: [number, string, string][] = [
  [0.5, '50%', 'half'],
  [1, '100%', 'max']
];

interface InputSwapProps {
  Icon: CoinIcon;
  setIsSelectToken: (value: boolean) => void;
  token: TokenItemType;
  amount: number;
  tokenFee: number;
  onChangeAmount?: (amount: number | undefined) => void;
  balance: string | bigint;
  disable?: boolean;
  originalToken?: TokenInfo;
  setCoe?: React.Dispatch<React.SetStateAction<number>>;
  usdPrice: string;
  type?: string;
  onChangePercentAmount?: (coff: number) => void;
  theme: Themes;
}

export default function InputSwapV4({
  Icon,
  setIsSelectToken,
  token,
  amount,
  onChangeAmount,
  tokenFee,
  balance,
  disable,
  originalToken,
  setCoe,
  usdPrice,
  type,
  onChangePercentAmount,
  theme
}: InputSwapProps) {
  return (
    <>
      <div className={cx('input-swap-balance', type === 'from' && 'is-enable-coeff')}>
        <div className={cx('show-balance')}>
          <TokenBalance
            prefix="Balance: "
            balance={{
              amount: balance,
              decimals: originalToken?.decimals,
              denom: originalToken?.symbol || token?.name || ''
            }}
            decimalScale={6}
          />
          {type === 'from' && (
            <div className={cx('coeff')}>
              {AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP.map(([coeff, text]) => (
                <button
                  key={coeff}
                  className={cx('percent')}
                  onClick={(event) => {
                    event.stopPropagation();
                    onChangePercentAmount(coeff);
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectToken(true)}>
          <div className={cx('left')}>
            <div className={cx('icon')}>{Icon && <Icon className={cx('logo')} />}</div>
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
            </div>
            {/* <img src={ArrowImg} alt="arrow" /> */}
          </div>
        </div>
        <div className={cx('box-input')}>
          <div className={cx('input')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              className={cx('amount')}
              decimalScale={6}
              disabled={disable}
              type="text"
              value={amount}
              onChange={() => {
                setCoe(0);
              }}
              isAllowed={(values) => {
                const { floatValue } = values;
                // allow !floatValue to let user can clear their input
                return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
              }}
              onValueChange={({ floatValue }) => {
                onChangeAmount && onChangeAmount(floatValue);
              }}
            />
          </div>
          <div className={cx('usd')}>≈ ${amount ? numberWithCommas(Number(usdPrice) || 0) : 0}</div>
        </div>
      </div>
      {!!tokenFee && (
        <div className={cx('input-swap-fee')}>
          <div>Fee: {tokenFee}%</div>
        </div>
      )}
    </>
  );
}
