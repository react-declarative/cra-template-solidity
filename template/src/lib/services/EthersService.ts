import { makeAutoObservable, runInAction } from "mobx";

import { singleshot } from "react-declarative";
import { ethers } from 'ethers'

// import detectEthereumProvider from '@metamask/detect-provider'; // ^1.2.0
// const browserProvider = await detectEthereumProvider() as ExternalProvider;
// if (browserProvider?.isMetaMask !== true) {
// this.provider = new ethers.providers.Web3Provider(browserProvider);
// const rpcProvider = ethers.providers.JsonRpcProvider(url) // todo check for solana

interface IWindowExtended extends Window {
    ethereum: any;
    web3: any;
}

const window = globalThis as unknown as IWindowExtended;

export class EthersService {

    private _provider: ethers.providers.Web3Provider = null as never;

    get isProviderConnected() {
        return !!this._provider;
    };

    get isMetamaskAvailable() {
        return !!window.ethereum;
    };

    get isAccountEnabled() {
        return !!window.ethereum?.selectedAddress;
    };

    get provider() {
        return this._provider;
    };

    constructor() {
        makeAutoObservable(this);
    };

    enable = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.registerWalletEvents();
    };

    getNetwork = async () => {
        const network = await this._provider.getNetwork();
        return network;
    };

    getAccount = async () => {
        const accounts = await this._provider.listAccounts();
        return accounts[0] || null;
    };

    getChainId = async () => {
        const { chainId } = await this.getNetwork();
        return chainId;
    };

    getSigner = () => {
        return this._provider.getSigner();
    };

    getCode = (address: string) => {
        return this._provider.getCode(address);
    };

    personalSign = async (message: string): Promise<string> => {
        const account = await this.getAccount();
        return await window.ethereum.request({
            params: [message, account],
            method: "personal_sign",
            from: account,
        });
    };

    addTestChain = (chainId: string | number = 1337) => {
        if (!String(chainId).includes('0x')) {
            chainId = `0x${chainId.toString(16)}`;
        }
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId,
                rpcUrls: ["http://localhost:8545"],
                chainName: "Local GETH",
                nativeCurrency: {
                    name: "GETH",
                    symbol: "GETH",
                    decimals: 18
                },
            }]
        });
    };

    validateSign = async (message: string, sign: string): Promise<string | null> => {
        try {
            return await window.ethereum.request({
                params: [message, sign],
                method: "personal_ecRecover",
            });
        } catch (e: unknown) {
            console.warn(e);
            return null;
        }
    };

    private registerWalletEvents = () => {
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    };

    prefetch = singleshot(async () => {
        console.log("EthersService prefetch started");
        try {
            if (window.ethereum) {
                console.log("EthersService prefetch eip-1102 detected");
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                runInAction(() => this._provider = provider);
            }
            if (this.isAccountEnabled) {
                this.registerWalletEvents();
            }
        } catch (e) {
            console.warn('EthersService prefetch failed', e);
        }
    });

};

export default EthersService;
