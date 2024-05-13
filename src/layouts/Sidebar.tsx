import { ReactComponent as BuyCryptoIcon } from 'assets/icons/buy_crypto.svg';
import { ReactComponent as CoHavestIcon } from 'assets/icons/co_harvest.svg';
import { ReactComponent as GovernanceIcon } from 'assets/icons/governance.svg';
import { ReactComponent as GpuStakingIcon } from 'assets/icons/gpu_staking.svg';
import { ReactComponent as HomeBaseIcon } from 'assets/icons/homebase.svg';
import { ReactComponent as DiscordIcon } from 'assets/icons/ic_discord.svg';
import { ReactComponent as TeleIcon } from 'assets/icons/ic_telegram.svg';
import { ReactComponent as TwisterIcon } from 'assets/icons/ic_twitter.svg';
import { ReactComponent as JumpIcon } from 'assets/icons/jump.svg';
import { ReactComponent as AirightIcon } from 'assets/icons/logo_airight.svg';
import { ReactComponent as DefiLensIcon } from 'assets/icons/logo_defi_lens.svg';
import { ReactComponent as ExplorerIcon } from 'assets/icons/logo_explorer.svg';
import { ReactComponent as LLMLayerIcon } from 'assets/icons/logo_llm_layer.svg';
import { ReactComponent as OraidexIcon } from 'assets/icons/logo_oraidex.svg';
import { ReactComponent as OrchaiIcon } from 'assets/icons/logo_orchai.svg';
import { ReactComponent as OraiStakingIcon } from 'assets/icons/orai_staking.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import classNames from 'classnames';
import ModalDownloadOwallet from 'components/Modals/ModalDownloadOwallet/ModalDownloadOwallet';
import useTheme from 'hooks/useTheme';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC<{}> = React.memo((props) => {
  const location = useLocation();
  const [link, setLink] = useState('');
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isOpenQrCodeOwallet, setIsOpenQrCodeOwallet] = useState(false);

  useEffect(() => {
    setLink(location.pathname);
  }, [location]);

  const renderLink = (
    to: string,
    title: string,
    onClick: any,
    iconLeft: ReactElement,
    iconRight?: ReactElement,
    externalLink = false
  ) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item, styles[theme])}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          {iconLeft}
          <span className={classNames(styles[theme], styles.menu_item_text)}>{title}</span>
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
          styles[theme]
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
            {renderLink('/homebase', 'ORAI Staking', setLink, <OraiStakingIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'Governance', setLink, <GovernanceIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'Buy Crypto', setLink, <BuyCryptoIcon />)}
            {renderLink('/homebase', 'Co-Harvest', setLink, <CoHavestIcon />, <TimeIcon />)}
          </div>
        </div>
        <div className={classNames(styles.sidebar_divied)}></div>
        <div className={classNames(styles.sidebar_menu)}>
          <div>
            <div>Featured DApps</div>
            {/* <div>-</div> */}
          </div>
          <div className={classNames(styles.menu_items)}>
            {renderLink('/homebase', 'OraiDEX', setLink, <OraidexIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'DeFi Lens', setLink, <DefiLensIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'LLM Layer', setLink, <LLMLayerIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'aiRight', setLink, <AirightIcon />, <JumpIcon />)}
            {renderLink('/homebase', 'Orchai', setLink, <OrchaiIcon />, <JumpIcon />)}
          </div>
        </div>
        <div className={classNames(styles.sidebar_divied)}></div>
        <div className={classNames(styles.sidebar_menu)}>
          <div className={classNames(styles.menu_items)}>
            {renderLink('/homebase', 'Explorer', setLink, <ExplorerIcon />, <JumpIcon />)}
            {/* {renderLink(
              '/homebase',
              'Install OWallet',
              () => setIsOpenQrCodeOwallet(true),
              <div>
                <OwalletIcon />
              </div>
            )} */}
          </div>
          <div className={styles.download} onClick={() => setIsOpenQrCodeOwallet(true)}>
            <OwalletIcon />
            Install OWallet
          </div>
          <div className={styles.social}>
            <a href="https://t.me/oraidex" target="_blank" rel="noopener noreferrer">
              <TeleIcon />
            </a>
            <a href="https://twitter.com/oraidex" target="_blank" rel="noopener noreferrer">
              <TwisterIcon />
            </a>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
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
      {isOpenQrCodeOwallet && <ModalDownloadOwallet close={() => setIsOpenQrCodeOwallet(false)} />}
    </>
  );
});

export default Sidebar;
