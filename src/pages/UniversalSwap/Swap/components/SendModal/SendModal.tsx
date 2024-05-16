import { GAS_ESTIMATION_SWAP_DEFAULT, TokenItemType, toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { getTransactionUrl, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { useCopyClipboard } from 'hooks/useCopyClipboard';
import { calcMaxAmount, getTokenIcon } from 'pages/UniversalSwap/helpers';
import { FC, useState } from 'react';
import InputCommon from '../InputCommon';
import InputSwap from './InputSwap/InputSwap';
import styles from './SendModal.module.scss';

export const SendModal: FC<{
  isOpen: boolean;
  close: () => void;
  open: () => void;
  tokenInfo: TokenItemType | any;
  address: string;
}> = ({ isOpen, close, open, tokenInfo, address }) => {
  const [theme] = useConfigReducer('theme');
  const [amount, setAmount] = useState<bigint | any>(0);
  const [addressRecipient, setAddressRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [coe, setCoe] = useState(0);
  const FromIcon = getTokenIcon(tokenInfo, theme);
  const { handleReadClipboard } = useCopyClipboard();

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={`${styles.sendModal}`}>
      <div className={classNames(styles.sendModalContainer, styles[theme])}>
        <div className={styles.sendModalContainerHeader}>
          <div />
          <div className={styles.sendModalContainerHeaderTitle}>Send Asset</div>
          <div className={styles.sendModalContainerHeaderBtn}>
            <div className={styles.sendModalContainerHeaderBtnClose} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className={styles.sendModalContainerHeaderInfo}>
          <div className={styles.sendModalContainerHeaderInfoIcon}>
            {theme === 'dark' ? <OraiIcon /> : <OraiLightIcon />}
          </div>
          <div>
            <div className={styles.sendModalContainerHeaderInfoLabel}>Send from Oraichain</div>
            <div className={styles.sendModalContainerHeaderInfoAddress}>{address}</div>
          </div>
        </div>
        <div className={styles.sendModalContainerHeaderInput}>
          <div className={styles.sendModalContainerHeaderInputSwap}>
            <InputSwap
              type={'from'}
              balance={tokenInfo.balance}
              originalToken={tokenInfo}
              Icon={FromIcon}
              theme={theme}
              onChangePercentAmount={(coeff) => {
                if (coe === coeff) return setAmount(0);
                const finalAmount = calcMaxAmount({
                  maxAmount: tokenInfo.balance,
                  token: tokenInfo,
                  coeff,
                  gas: GAS_ESTIMATION_SWAP_DEFAULT
                });
                setCoe(coeff);
                setAmount(finalAmount * coeff);
              }}
              token={tokenInfo}
              amount={amount}
              onChangeAmount={(value) => {
                if (!value) {
                  setCoe(0);
                  return;
                }
                setAmount(value);
              }}
              setCoe={setCoe}
              setIsSelectToken={function (value: boolean): void {
                // throw new Error('Function not implemented.');
              }}
              tokenFee={0}
              usdPrice={''}
            />
          </div>
          <div className={styles.sendModalContainerHeaderInputRecipient}>
            <InputCommon
              title="Recipient"
              value={addressRecipient}
              placeholder={'Enter wallet address'}
              onChange={(val) => setAddressRecipient(val)}
              defaultValue={addressRecipient}
              suffix={
                <div
                  className={styles.sendModalContainerHeaderInputRecipientPaste}
                  onClick={() => {
                    handleReadClipboard((text) => setAddressRecipient(text));
                  }}
                >
                  PASTE
                </div>
              }
            />
          </div>
          <div className={styles.sendModalContainerHeaderInputNetwork}>
            <div className={styles.sendModalContainerHeaderInputNetworkTitle}>Network</div>
            <div className={styles.sendModalContainerHeaderInputNetworkInfo}>
              <span>ORAI</span>
              <span>Oraichain</span>
            </div>
          </div>
          <div className={styles.sendModalContainerHeaderInputMemo}>
            <InputCommon
              title=" "
              placeholder="Memo (Required if send to KuCoin address)"
              value={memo}
              onChange={(val) => setMemo(val)}
              defaultValue={memo}
            />
          </div>
        </div>

        {(() => {
          let disableMsg: string;
          if (amount <= 0) disableMsg = 'Enter an amount';
          const disabled = actionLoading;
          return (
            <div className={styles.sendModalContainerHeaderBtnConfirm}>
              <Button
                onClick={async () => {
                  try {
                    if (!window.ethereum) return;
                    setActionLoading(true);
                    // const signer = await MetamaskOfflineSigner.connect(window.ethereum, network.denom);
                    // const {
                    //   client,
                    //   defaultAddress: { address }
                    // } = await getCosmWasmClient({ chainId: network.chainId, signer });
                    const type = tokenInfo?.contractAddress ? 'cw20' : 'native';
                    console.log({ type, tokenInfo });

                    let result;
                    if (type === 'native') {
                      result = await window.client.sendTokens(
                        address,
                        addressRecipient,
                        [
                          {
                            amount: toAmount(amount).toString(),
                            denom: tokenInfo.denom
                          }
                        ],
                        'auto',
                        memo
                      );
                    } else {
                      console.log({
                        address,
                        tokenInfo: tokenInfo.contractAddress,
                        transfer: {
                          transfer: {
                            recipient: addressRecipient,
                            amount: toAmount(amount).toString()
                          }
                        }
                      });

                      result = await window.client.execute(
                        address,
                        tokenInfo.contractAddress,
                        {
                          transfer: {
                            recipient: addressRecipient,
                            amount: toAmount(amount).toString()
                          }
                        },
                        'auto',
                        memo
                      );
                    }
                    displayToast(TToastType.TX_SUCCESSFUL, {
                      customLink: getTransactionUrl('Oraichain', result.transactionHash)
                    });
                  } catch (error) {
                    console.log('error in send: ', error);
                    handleErrorTransaction(error);
                  } finally {
                    setActionLoading(false);
                  }
                }}
                type="primary"
                disabled={disabled}
              >
                {actionLoading && <Loader width={22} height={22} />}
                {disableMsg || 'Send'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
