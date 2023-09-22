import cn from 'classnames/bind';
import { FunctionComponent, useMemo, useState } from 'react';

import Modal from 'components/Modal';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';

import ConnectProcessing from './ConnectProcessing';
import ConnectError from './ConnectError';
import styles from './index.module.scss';

const cx = cn.bind(styles);

interface WalletItem {
  name: string;
  icon: FunctionComponent;
}

const WALLETS: WalletItem[] = [
  { name: 'Owallet', icon: OwalletIcon },
  { name: 'Metamask', icon: MetamaskIcon },
  { name: 'TronLink', icon: OwalletIcon },
  { name: 'Phantom', icon: OwalletIcon },
  { name: 'Keplr', icon: OwalletIcon },
  { name: 'Ledger', icon: OwalletIcon }
];

enum CONNECT_STATUS {
  SELECTING = 'SELECTING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

const ChooseWalletModal: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.SELECTING);
  const [walletSelected, setWalletSelected] = useState<WalletItem>();

  const content = useMemo(() => {
    if (connectStatus === CONNECT_STATUS.SELECTING) {
      return (
        <div className={cx('wallets_wrapper')}>
          {WALLETS.map((wallet, index) => {
            return (
              <div
                key={index}
                className={cx('wallet_item')}
                onClick={() => {
                  setWalletSelected(wallet);
                  setConnectStatus(CONNECT_STATUS.PROCESSING);
                }}
              >
                <div className={cx('wallet_icon')}>
                  <wallet.icon />
                </div>
                <div className={cx('wallet_name')}>{wallet.name}</div>
              </div>
            );
          })}
        </div>
      );
    } else if (connectStatus === CONNECT_STATUS.PROCESSING) {
      return (
        <ConnectProcessing
          close={() => {
            close();
            setConnectStatus(CONNECT_STATUS.SELECTING);
          }}
          walletName={walletSelected.name}
        />
      );
    } else {
      return (
        <ConnectError
          close={() => {
            close();
            setConnectStatus(CONNECT_STATUS.SELECTING);
          }}
          handleTryAgain={() => {}}
        />
      );
    }
  }, [connectStatus]);

  return (
    <Modal
      isOpen={true}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={cx('choose_wallet_modal_container')}
    >
      <div className={cx('choose_wallet_modal_wrapper')}>
        <div className={cx('header')}>
          <div>Connect to OraiDEX</div>
          <div onClick={close} className={cx('close_icon')}>
            <CloseIcon />
          </div>
        </div>

        {content}
      </div>
    </Modal>
  );
};

export default ChooseWalletModal;
