import { makeAutoObservable, runInAction } from "mobx";
import { inject, singleshot } from "react-declarative";

import {
    ethers,
    BaseContract,
    BigNumber,
} from "ethers";

import EthersService from "./EthersService";

import { CC_CONTRACT_ADDRESS } from "../../config/params";
import { CC_CONTRACT_ABI } from "../../config/params";

import TYPES from "../types";

type IContract = BaseContract & Record<string, (...args: any[]) => Promise<any>>;

export class ContractService {

    readonly ethersService = inject<EthersService>(TYPES.ethersService);

    private _instance: IContract = null as never;

    get isContractConnected() {
        return !!this._instance;
    };

    constructor() {
        makeAutoObservable(this);
    };

    name = singleshot(async () => String(await this._instance.name()));
    symbol = singleshot(async () => String(await this._instance.symbol()));
    mintWave = singleshot(async () => Number((await this._instance.mintWave()).toString()));
    maxSupply = singleshot(async () => Number((await this._instance.maxSupply()).toString()));
    totalSupply = singleshot(async () => Number((await this._instance.totalSupply()).toString()));
    maxMintAmountPerTx = singleshot(async () =>  Number((await this._instance.maxMintAmountPerTx()).toString()));
    tokenPrice = singleshot(async () =>  Number((await this._instance.cost()).toString()));
    isPaused = singleshot(async () => Boolean(await this._instance.paused()));

    mintTokens = async (amount: number, value: number) => {
        return await this._instance.mint(amount.toString(), {
            value: value.toString(),
        });
    };

    prefetch = singleshot(async () => {
        console.log("ContractService prefetch started");
        try {
            const deployedCode = await this.ethersService.getCode(CC_CONTRACT_ADDRESS);
            if (deployedCode === '0x') {
                throw new Error('ContractService contract not deployed');
            }
            const instance = new ethers.Contract(
                CC_CONTRACT_ADDRESS,
                CC_CONTRACT_ABI,
                this.ethersService.getSigner(),
            ) as IContract;
            runInAction(() => this._instance = instance);
        } catch (e) {
            console.warn('ContractService prefetch failed', e);
        }
    });

};

export default ContractService;
