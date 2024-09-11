import { checkValidateAddressWithNetwork } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { tokenMap } from 'config/bridgeTokens';
import { getAddressTransfer, networks } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useWalletReducer from 'hooks/useWalletReducer';
import { getFromToToken } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToChain, selectCurrentToken } from 'reducer/tradingSlice';
import useFilteredTokens from './useFilteredTokens';

const useHandleEffectTokenChange = ({ fromTokenDenomSwap, toTokenDenomSwap }) => {
  const dispatch = useDispatch();
  const currentPair = useSelector(selectCurrentToken);
  const currentToChain = useSelector(selectCurrentToChain);
  const [searchTokenName] = useState('');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');

  const [addressTransfer, setAddressTransfer] = useState('');
  const [initAddressTransfer, setInitAddressTransfer] = useState('');

  // get token on oraichain to simulate swap amount.
  const originalFromToken = tokenMap[fromTokenDenomSwap];
  const originalToToken = tokenMap[toTokenDenomSwap];

  const { fromToken, toToken } = getFromToToken(
    originalFromToken,
    originalToToken,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

  const { filteredToTokens, filteredFromTokens } = useFilteredTokens(
    originalFromToken,
    originalToToken,
    searchTokenName,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

  useEffect(() => {
    (async () => {
      if (!isMobile()) {
        if (!walletByNetworks.evm && !walletByNetworks.cosmos && !walletByNetworks.tron) {
          return setAddressTransfer('');
        }

        if (originalToToken.cosmosBased && !walletByNetworks.cosmos) {
          return setAddressTransfer('');
        }

        if (!originalToToken.cosmosBased && originalToToken.chainId === '0x2b6653dc' && !walletByNetworks.tron) {
          return setAddressTransfer('');
        }

        if (!originalToToken.cosmosBased && !walletByNetworks.evm) {
          return setAddressTransfer('');
        }
      }

      if (originalToToken.chainId) {
        const findNetwork = networks.find((net) => net.chainId === originalToToken.chainId);
        const address = await getAddressTransfer(findNetwork, walletByNetworks);

        setAddressTransfer(address);
        setInitAddressTransfer(address);
      }
    })();
  }, [
    originalToToken,
    oraiAddress,
    metamaskAddress,
    tronAddress,
    walletByNetworks.evm,
    walletByNetworks.cosmos,
    walletByNetworks.tron,
    window?.ethereumDapp,
    window?.tronWebDapp
  ]);

  const isConnectedWallet =
    walletByNetworks.cosmos || walletByNetworks.bitcoin || walletByNetworks.evm || walletByNetworks.tron;

  let validAddress = {
    isValid: true
  };

  if (isConnectedWallet) validAddress = checkValidateAddressWithNetwork(addressTransfer, originalToToken?.chainId);

  return {
    originalFromToken,
    originalToToken,
    filteredToTokens,
    filteredFromTokens,
    searchTokenName,
    fromToken,
    toToken,

    addressInfo: {
      addressTransfer,
      initAddressTransfer,
      setAddressTransfer,
      setInitAddressTransfer
    },
    validAddress,
    isConnectedWallet
  };
};

export default useHandleEffectTokenChange;
