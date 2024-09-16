import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as ExternalLinkIcon } from 'assets/icons/ic_external_link.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import { default as LogoFullImgDark, default as LogoFullImgLight } from 'assets/images/homeBase_full.svg';
import classNames from 'classnames';
import { WalletManagement } from 'components/WalletManagement/WalletManagement';
import { ThemeContext } from 'context/theme-context';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.scss';
import Sidebar from './Sidebar';
import TopBarIcon from 'assets/images/flicker-dot.svg';
import { GithubConnect } from 'components/GithubConnect';

const Menu: React.FC = () => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const [otherActive, setOtherActive] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [isOpenSubMenuMobile, setIsOpenSubMenuMobile] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    setLink(location.pathname);
  }, [location.pathname]);

  const renderLink = (
    to: string,
    title: string,
    onClick: any,
    externalLink = false,
    Icon?: ReactNode,
    isExternalIcon = true
  ) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item, { [styles.active]: link === to }, styles[theme], styles.spin)}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          {Icon}
          <span className={classNames(styles[theme], styles.menu_item_text)}>{title}</span>
          {isExternalIcon && (
            <div className={styles.hoverIcon}>
              <ExternalLinkIcon />
            </div>
          )}
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
          { [styles.active]: !otherActive && (link.includes(to) || (link === '/' && to === '/homebase')) },
          styles[theme],
          styles.spin
        )}
      >
        {Icon}
        <span className={classNames(styles.menu_item_text, { [styles.active]: link === to }, styles[theme])}>
          {title}
        </span>
      </Link>
    );
  };

  const mobileMode = isMobile();
  const ToggleIcon = open ? CloseIcon : MenuIcon;
  const darkTheme = theme === 'dark';

  const menuListMobile = <div className={classNames(styles.menu_list)}></div>;

  return (
    <>
      {mobileMode ? (
        <>
          <div className={styles.menuMobile}>
            <div className={styles.logo}>
              <ToggleIcon onClick={handleToggle} />
              <Link to={'/'} onClick={() => setLink('/')}>
                <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
              </Link>
            </div>
            <GithubConnect mobileMode={mobileMode} />
            <WalletManagement />
          </div>

          <div ref={ref} className={classNames(styles.sideMenu, { [styles.open]: open })}>
            {/* {menuListMobile} */}
            <Sidebar />
          </div>
        </>
      ) : (
        <div className={classNames(styles.menu)}>
          <div className={styles.menuLeft}>
            <div className={styles.logoWrapper}>
              <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
                <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
              </Link>
            </div>
          </div>

          <div className={classNames(styles.wrapMenuRight)}>
            <div className={classNames(styles.menuMiddle)}>
              <img src={TopBarIcon} alt="top_bar_icon" />

              <div className={classNames(styles.menuMiddleText)}>
                Millions of EVM wallet users will soon be able to join the Oraichain ecosystem with ease!
              </div>
            </div>

            <div className={classNames(styles.menuRight)}>
              <GithubConnect />

              <div className={classNames(styles.connect_wallet_wrapper)}>
                <span>
                  <WalletManagement />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
