import { ReactComponent as BuyCryptoIcon } from 'assets/icons/buy_crypto.svg';
import { ReactComponent as CoHavestIcon } from 'assets/icons/co_harvest.svg';
import { ReactComponent as GovernanceIcon } from 'assets/icons/governance.svg';
import { ReactComponent as GpuStakingIcon } from 'assets/icons/gpu_staking.svg';
import { ReactComponent as GpuCreditIcon } from 'assets/icons/gpu_credit.svg';
import { ReactComponent as HomeBaseIcon } from 'assets/icons/homebase.svg';
import { ReactComponent as GitIcon } from 'assets/icons/ic_github.svg';
import { ReactComponent as DiscordIcon } from 'assets/icons/ic_discord.svg';
import { ReactComponent as TeleIcon } from 'assets/icons/ic_telegram.svg';
import { ReactComponent as TwisterIcon } from 'assets/icons/ic_twitter.svg';
import { ReactComponent as JumpIcon } from 'assets/icons/jump.svg';
import { ReactComponent as AirightIcon } from 'assets/icons/logo_airight.svg';
import { ReactComponent as DefiLensIcon } from 'assets/icons/logo_defi_lens.svg';
import { ReactComponent as ExplorerIcon } from 'assets/icons/logo_explorer.svg';
import { ReactComponent as LLMLayerIcon } from 'assets/icons/logo_llm_layer.svg';
import { ReactComponent as ThesisIcon } from 'assets/icons/logo_thesis.svg';
import { ReactComponent as LfgIcon } from 'assets/icons/logo_lfg.svg';
import { ReactComponent as OraidexIcon } from 'assets/icons/logo_oraidex.svg';
import { ReactComponent as OrderbookIcon } from 'assets/icons/orderbook_ic.svg';
import { ReactComponent as OFutureIcon } from 'assets/icons/future_ic.svg';
import { ReactComponent as OrchaiIcon } from 'assets/icons/logo_orchai.svg';
import { ReactComponent as OraiStakingIcon } from 'assets/icons/orai_staking.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/logo_owallet.svg';
import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import { ReactComponent as ControlCenterIcon } from 'assets/icons/control-center.svg';
import classNames from 'classnames';
import ModalDownloadOwallet from 'components/Modals/ModalDownloadOwallet/ModalDownloadOwallet';
import useTheme from 'hooks/useTheme';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import BuyOraiModal from './BuyOraiModal';
import { isMobile } from '@walletconnect/browser-utils';

const Sidebar: React.FC<{}> = React.memo((props) => {
  const location = useLocation();
  const [link, setLink] = useState('');
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isOpenQrCodeOwallet, setIsOpenQrCodeOwallet] = useState(false);
  const mobileMode = isMobile();

  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [openBuy, setOpenBuy] = useState(false);

  useEffect(() => {
    setLink(location.pathname);
  }, [location]);

  const renderLink = (
    to: string,
    title: string,
    onClick: any,
    iconLeft: ReactElement,
    iconRight?: ReactElement,
    externalLink = false,
    disabled = false
  ) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item, styles[theme], { [styles.disabled]: disabled })}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          <div className={classNames(styles.menu_item_tab)}>
            {iconLeft}
            <span className={classNames(styles.menu_item_text, styles[theme])}>{title}</span>
          </div>
          {iconRight}
        </a>
      );
    return (
      <Link
        to={to}
        onClick={() => {
          setOpen(!open);
          onClick(to);
        }}
        className={classNames(
          styles.menu_item,
          { [styles.active]: link.includes(to) || (link === '/' && to === '/homebase') },
          styles[theme],
          { [styles.disabled]: disabled }
        )}
      >
        <div className={classNames(styles.menu_item_tab)}>
          {iconLeft}
          <span className={classNames(styles.menu_item_text, { [styles.active]: link === to }, styles[theme])}>
            {title}
          </span>
        </div>
        {iconRight}
      </Link>
    );
  };

  return (
    <>
      <div className={classNames(styles.sidebar, { [styles.open]: open })}>
        <div className={classNames(styles.sidebar_menu)}>
          <div className={classNames(styles.menu_items)}>
            {renderLink('/homebase', 'Homebase', setLink, <HomeBaseIcon />)}
            {renderLink('/gpu-staking', 'GPU Staking', setLink, <GpuStakingIcon />)}
            {renderLink('/gpu-credit', 'GPU Credit', setLink, <GpuCreditIcon />)}
            {renderLink(
              'https://scan.orai.io/validators',
              'ORAI Staking',
              setLink,
              <OraiStakingIcon />,
              <JumpIcon />,
              true
            )}
            {renderLink(
              'https://scan.orai.io/proposals',
              'Governance',
              setLink,
              <GovernanceIcon />,
              <JumpIcon />,
              true
            )}
            {renderLink(
              '#',
              'Buy Crypto',
              () => {
                setOpenBuy(true);
              },
              <BuyCryptoIcon />
            )}
            {renderLink('/control-center', 'Control Center', setLink, <ControlCenterIcon />)}
            {renderLink('#', 'Co-Harvest', () => {}, <CoHavestIcon />, <TimeIcon />, false, true)}
          </div>
        </div>
        <div className={classNames(styles.sidebar_divied)}></div>
        <div className={classNames(styles.sidebar_menu)}>
          <div>
            <div>Featured DApps</div>
            {/* <div>-</div> */}
          </div>
          <div className={classNames(styles.menu_items)}>
            {renderLink('https://thesis.io', 'Thesis.io', setLink, <ThesisIcon />, <JumpIcon />, true)}
            {renderLink('https://lfg.land', 'LFG!!!', setLink, <LfgIcon />, <JumpIcon />, true)}
            {renderLink('https://oraidex.io', 'OraiDEX', setLink, <OraidexIcon />, <JumpIcon />, true)}
            {renderLink(
              'https://orderbook.oraidex.io/',
              'Orderbook',
              setLink,
              <OrderbookIcon className={styles.customIcon} />,
              <JumpIcon />,
              true
            )}
            {renderLink(
              'https://futures.oraidex.io/',
              'Futures',
              setLink,
              <OFutureIcon className={styles.customIcon} />,
              <JumpIcon />,
              true
            )}
            {renderLink('https://defilens.ai', 'DeFi Lens', setLink, <DefiLensIcon />, <JumpIcon />, true)}
            {renderLink('https://layer.orai.io/llm', 'LLM Layer', setLink, <LLMLayerIcon />, <JumpIcon />, true)}
            {renderLink('https://airight.io', 'aiRight', setLink, <AirightIcon />, <JumpIcon />, true)}
            {renderLink('https://orchai.io', 'Orchai', setLink, <OrchaiIcon />, <JumpIcon />, true)}
          </div>
        </div>
        <div className={classNames(styles.sidebar_divied)}></div>
        <div className={classNames(styles.sidebar_menu)}>
          <div className={classNames(styles.menu_items)}>
            {renderLink('https://scan.orai.io/', 'Explorer', setLink, <ExplorerIcon />, <JumpIcon />, true)}
            {/* {renderLink(
              '/homebase',
              'Install OWallet',
              () => setIsOpenQrCodeOwallet(true),
              <div>
                <OwalletIcon />
              </div>
            )} */}
          </div>
          {!mobileMode && (
            <div className={styles.download} onClick={() => setIsOpenQrCodeOwallet(true)}>
              <OwalletIcon />
              Install OWallet
            </div>
          )}

          <div className={styles.social}>
            <a href="https://t.me/oraichain" target="_blank" rel="noopener noreferrer">
              <TeleIcon />
            </a>
            <a href="https://twitter.com/oraichain" target="_blank" rel="noopener noreferrer">
              <TwisterIcon />
            </a>
            <a href="https://discord.gg/oraichain" target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
            </a>
            <a href="https://github.com/oraichain" target="_blank" rel="noopener noreferrer">
              <GitIcon />
            </a>
          </div>
        </div>
        {/* <div className={styles.menu_footer} onClick={() => setIsOpenQrCodeOwallet(true)}>
          {theme === 'light' ? <DownloadOwalletIcon /> : <DownloadOwalletIconDark />}
          <div className={styles.download}>
            <span>Download</span>
            <LogoDownloadOwalletIcon />
          </div>
        </div> */}
      </div>

      {openBuy && (
        <BuyOraiModal
          open={openBuy}
          close={() => {
            setOpenBuy(false);
            setIsLoadedIframe(false);
          }}
          onAfterLoad={() => setIsLoadedIframe(true)}
          isLoadedIframe={isLoadedIframe}
        />
      )}
      {isOpenQrCodeOwallet && <ModalDownloadOwallet close={() => setIsOpenQrCodeOwallet(false)} />}
    </>
  );
});

export default Sidebar;
