import { ChainInfo } from '@keplr-wallet/types';
import { network } from 'constants/networks';
import { embedChainInfos } from 'networks';

export default class Keplr {

    constructor() {
        window.onload = async () => {
            if (window.keplr) {
                window.keplr.defaultOptions = {
                    sign: {
                        preferNoSetFee: true,
                        preferNoSetMemo: true,
                    },
                };
            }
        }
    }

    suggestChain = async (chainId: string) => {
        const chainInfo = embedChainInfos.find(chainInfo => chainInfo.chainId === chainId);
        if (!chainInfo) throw "Cannot find chain info given the chain id";
        console.log("chain info: ", chainInfo)
        await window.keplr.experimentalSuggestChain(chainInfo);
        await window.keplr.enable(chainInfo.chainId);
        console.log("enabled");
    };

    async getKeplr(): Promise<keplrType | undefined> {
        return window.keplr
    }

    private async getKeplrKey(): Promise<any | undefined> {
        let chainId = network.chainId;
        if (!chainId) return undefined;
        const keplr = await this.getKeplr();
        if (keplr) {
            console.log("keplr key: ", await keplr.getKey(chainId));
            return keplr.getKey(chainId);
        }
        return undefined;
    }

    async getKeplrAddr(): Promise<String | undefined> {
        const key = await this.getKeplrKey();
        return key.bech32Address;
    }

    async getKeplrPubKey(): Promise<Uint8Array | undefined> {
        const key = await this.getKeplrKey();
        return key.pubKey;
    }
}