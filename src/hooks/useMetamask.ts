import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useLocation } from 'react-router-dom';
import { BSC_CHAIN_ID, ETHEREUM_CHAIN_ID } from 'config/constants';
import useGlobalState from './useGlobalState';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56]
});

export function useEagerConnect(isInactive) {
  const web3React = useWeb3React();
  const { pathname } = useLocation();
  const [metamaskAddress, setMetamaskAddress] =
    useGlobalState('metamaskAddress');

  useEffect(() => {
    if (!window.ethereum) return;
    if (![BSC_CHAIN_ID, ETHEREUM_CHAIN_ID].includes(window.ethereum.chainId))
      return;
    if (
      !web3React.account &&
      !isInactive &&
      (pathname === '/' || pathname === '/bridge')
    ) {
      console.log('activate');
      web3React.activate(injected);
    }
  }, [pathname]);

  useEffect(() => {
    if (!window.ethereum) return;
    (async function () {
      setMetamaskAddress(web3React.account || (await injected.getAccount()));
    })();
  }, [web3React.account]);
}

export function useInactiveListener() {
  const { active, error, activate, deactivate, library } = useWeb3React();
  const [, setMetamaskAddress] = useGlobalState('metamaskAddress');

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on) {
      ethereum.on('connect', handleConnect);
      // ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      // ethereum.on('networkChanged', handleNetworkChanged);
      // ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (ethereum.removeListener) {
          // ethereum.removeListener('connect', handleConnect);
          // ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          // ethereum.removeListener('networkChanged', handleNetworkChanged);
          // ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [active, error, activate]);

  const handleConnect = () => {
    activate(injected);
  };
  const handleChainChanged = (chainId) => {
    activate(injected);
  };
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setMetamaskAddress(accounts[0]);
    }
  };
  const handleNetworkChanged = (networkId) => {
    activate(injected);
  };
  const handleDisconnect = () => {
    if (library?.provider?.isMetamask) {
      deactivate();
    }
  };
}