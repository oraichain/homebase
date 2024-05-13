import blurIconImg from 'assets/icons/bg_blur_icon.svg';
import { ReactComponent as OpenNewTabIcon } from 'assets/icons/jump.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet-icon.svg';
import classNames from 'classnames';
import { WalletManagement } from 'components/WalletManagement';
import useConfigReducer from 'hooks/useConfigReducer';
import useWalletReducer from 'hooks/useWalletReducer';
import { reduceString } from 'libs/utils';
import styles from './ConnectBanner.module.scss';

const ConnectBanner = () => {
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [oraiAddress] = useConfigReducer('address');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [btcAddress] = useConfigReducer('btcAddress');

  const connectAddress = oraiAddress || metamaskAddress || tronAddress || btcAddress || '';

  const isConnected =
    walletByNetworks.cosmos || walletByNetworks.bitcoin || walletByNetworks.evm || walletByNetworks.tron;

  return (
    <div className={styles.connectBanner}>
      <div className={styles.top}>
        <div className={styles.header}>
          <span className={styles.index}>01</span>
          <span>Connect with Oraichain</span>
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <img src={blurIconImg} alt="blurIconImg" />
              <WalletIcon />
            </div>
            <div className={styles.connectTitle}>
              <span className={classNames({ [styles.connected]: isConnected })}>
                {isConnected ? 'Hello,' : 'Connect wallet to'}
              </span>
              <br />
              <span>{!isConnected ? 'start your Oraichain journey!' : reduceString(connectAddress, 8, 8)}</span>
            </div>
          </div>
          <div className={classNames(styles.right, { [styles.hide]: isConnected })}>
            <WalletManagement />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.learn}>New to Web3? You can learn from here.</span>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Glossary <OpenNewTabIcon />
        </a>
      </div>
    </div>
  );
};

export default ConnectBanner;
