/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.26.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {Uint128, Logo, EmbeddedLogo, Binary, Cw20Coin, InstantiateMarketingInfo, Expiration, Timestamp, Uint64, AllowanceInfo, SpenderAllowanceInfo, LogoInfo, Addr} from "./types";
import {InstantiateMsg, MinterResponse, ExecuteMsg, QueryMsg, AllAccountsResponse, AllAllowancesResponse, AllSpenderAllowancesResponse, AllowanceResponse, BalanceResponse, DownloadLogoResponse, MarketingInfoResponse, TokenInfoResponse} from "./OraiswapToken.types";
export interface OraiswapTokenReadOnlyInterface {
  contractAddress: string;
  balance: ({
    address
  }: {
    address: string;
  }) => Promise<BalanceResponse>;
  tokenInfo: () => Promise<TokenInfoResponse>;
  minter: () => Promise<MinterResponse>;
  allowance: ({
    owner,
    spender
  }: {
    owner: string;
    spender: string;
  }) => Promise<AllowanceResponse>;
  allAllowances: ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<AllAllowancesResponse>;
  allSpenderAllowances: ({
    limit,
    spender,
    startAfter
  }: {
    limit?: number;
    spender: string;
    startAfter?: string;
  }) => Promise<AllSpenderAllowancesResponse>;
  allAccounts: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<AllAccountsResponse>;
  marketingInfo: () => Promise<MarketingInfoResponse>;
  downloadLogo: () => Promise<DownloadLogoResponse>;
}
export class OraiswapTokenQueryClient implements OraiswapTokenReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.balance = this.balance.bind(this);
    this.tokenInfo = this.tokenInfo.bind(this);
    this.minter = this.minter.bind(this);
    this.allowance = this.allowance.bind(this);
    this.allAllowances = this.allAllowances.bind(this);
    this.allSpenderAllowances = this.allSpenderAllowances.bind(this);
    this.allAccounts = this.allAccounts.bind(this);
    this.marketingInfo = this.marketingInfo.bind(this);
    this.downloadLogo = this.downloadLogo.bind(this);
  }

  balance = async ({
    address
  }: {
    address: string;
  }): Promise<BalanceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      balance: {
        address
      }
    });
  };
  tokenInfo = async (): Promise<TokenInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      token_info: {}
    });
  };
  minter = async (): Promise<MinterResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      minter: {}
    });
  };
  allowance = async ({
    owner,
    spender
  }: {
    owner: string;
    spender: string;
  }): Promise<AllowanceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      allowance: {
        owner,
        spender
      }
    });
  };
  allAllowances = async ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<AllAllowancesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_allowances: {
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
  allSpenderAllowances = async ({
    limit,
    spender,
    startAfter
  }: {
    limit?: number;
    spender: string;
    startAfter?: string;
  }): Promise<AllSpenderAllowancesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_spender_allowances: {
        limit,
        spender,
        start_after: startAfter
      }
    });
  };
  allAccounts = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<AllAccountsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_accounts: {
        limit,
        start_after: startAfter
      }
    });
  };
  marketingInfo = async (): Promise<MarketingInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      marketing_info: {}
    });
  };
  downloadLogo = async (): Promise<DownloadLogoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      download_logo: {}
    });
  };
}
export interface OraiswapTokenInterface extends OraiswapTokenReadOnlyInterface {
  contractAddress: string;
  sender: string;
  transfer: ({
    amount,
    recipient
  }: {
    amount: Uint128;
    recipient: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  burn: ({
    amount
  }: {
    amount: Uint128;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  send: ({
    amount,
    contract,
    msg
  }: {
    amount: Uint128;
    contract: string;
    msg: Binary;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  increaseAllowance: ({
    amount,
    expires,
    spender
  }: {
    amount: Uint128;
    expires?: Expiration;
    spender: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  decreaseAllowance: ({
    amount,
    expires,
    spender
  }: {
    amount: Uint128;
    expires?: Expiration;
    spender: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  transferFrom: ({
    amount,
    owner,
    recipient
  }: {
    amount: Uint128;
    owner: string;
    recipient: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  sendFrom: ({
    amount,
    contract,
    msg,
    owner
  }: {
    amount: Uint128;
    contract: string;
    msg: Binary;
    owner: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  burnFrom: ({
    amount,
    owner
  }: {
    amount: Uint128;
    owner: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  mint: ({
    amount,
    recipient
  }: {
    amount: Uint128;
    recipient: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  updateMinter: ({
    newMinter
  }: {
    newMinter?: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  updateMarketing: ({
    description,
    marketing,
    project
  }: {
    description?: string;
    marketing?: string;
    project?: string;
  }, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
  uploadLogo: (logo: Logo, $fee?: number | StdFee | "auto", $memo?: string, $funds?: Coin[]) => Promise<ExecuteResult>;
}
export class OraiswapTokenClient extends OraiswapTokenQueryClient implements OraiswapTokenInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.transfer = this.transfer.bind(this);
    this.burn = this.burn.bind(this);
    this.send = this.send.bind(this);
    this.increaseAllowance = this.increaseAllowance.bind(this);
    this.decreaseAllowance = this.decreaseAllowance.bind(this);
    this.transferFrom = this.transferFrom.bind(this);
    this.sendFrom = this.sendFrom.bind(this);
    this.burnFrom = this.burnFrom.bind(this);
    this.mint = this.mint.bind(this);
    this.updateMinter = this.updateMinter.bind(this);
    this.updateMarketing = this.updateMarketing.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
  }

  transfer = async ({
    amount,
    recipient
  }: {
    amount: Uint128;
    recipient: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      transfer: {
        amount,
        recipient
      }
    }, $fee, $memo, $funds);
  };
  burn = async ({
    amount
  }: {
    amount: Uint128;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      burn: {
        amount
      }
    }, $fee, $memo, $funds);
  };
  send = async ({
    amount,
    contract,
    msg
  }: {
    amount: Uint128;
    contract: string;
    msg: Binary;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      send: {
        amount,
        contract,
        msg
      }
    }, $fee, $memo, $funds);
  };
  increaseAllowance = async ({
    amount,
    expires,
    spender
  }: {
    amount: Uint128;
    expires?: Expiration;
    spender: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      increase_allowance: {
        amount,
        expires,
        spender
      }
    }, $fee, $memo, $funds);
  };
  decreaseAllowance = async ({
    amount,
    expires,
    spender
  }: {
    amount: Uint128;
    expires?: Expiration;
    spender: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      decrease_allowance: {
        amount,
        expires,
        spender
      }
    }, $fee, $memo, $funds);
  };
  transferFrom = async ({
    amount,
    owner,
    recipient
  }: {
    amount: Uint128;
    owner: string;
    recipient: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      transfer_from: {
        amount,
        owner,
        recipient
      }
    }, $fee, $memo, $funds);
  };
  sendFrom = async ({
    amount,
    contract,
    msg,
    owner
  }: {
    amount: Uint128;
    contract: string;
    msg: Binary;
    owner: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      send_from: {
        amount,
        contract,
        msg,
        owner
      }
    }, $fee, $memo, $funds);
  };
  burnFrom = async ({
    amount,
    owner
  }: {
    amount: Uint128;
    owner: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      burn_from: {
        amount,
        owner
      }
    }, $fee, $memo, $funds);
  };
  mint = async ({
    amount,
    recipient
  }: {
    amount: Uint128;
    recipient: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint: {
        amount,
        recipient
      }
    }, $fee, $memo, $funds);
  };
  updateMinter = async ({
    newMinter
  }: {
    newMinter?: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_minter: {
        new_minter: newMinter
      }
    }, $fee, $memo, $funds);
  };
  updateMarketing = async ({
    description,
    marketing,
    project
  }: {
    description?: string;
    marketing?: string;
    project?: string;
  }, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_marketing: {
        description,
        marketing,
        project
      }
    }, $fee, $memo, $funds);
  };
  uploadLogo = async (logo: Logo, $fee: number | StdFee | "auto" = "auto", $memo?: string, $funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      upload_logo: logo
    }, $fee, $memo, $funds);
  };
}