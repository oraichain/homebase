/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.20.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  UseQueryOptions,
  useQuery,
  useMutation,
  UseMutationOptions
} from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { StdFee } from '@cosmjs/amino';
import {
  Addr,
  Decimal,
  Uint128,
  OracleTreasuryQuery,
  OracleExchangeQuery,
  OracleContractQuery,
  Null,
  ExchangeRateItem,
  Coin
} from './types';
import {
  InstantiateMsg,
  ExecuteMsg,
  QueryMsg,
  MigrateMsg,
  ContractInfoResponse,
  ExchangeRateResponse,
  ExchangeRatesResponse,
  RewardPoolResponse,
  TaxCapResponse,
  TaxRateResponse
} from './OraiswapOracle.types';
import {
  OraiswapOracleQueryClient,
  OraiswapOracleClient
} from './OraiswapOracle.client';
export interface OraiswapOracleReactQuery<TResponse, TData = TResponse> {
  client: OraiswapOracleQueryClient | undefined;
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined;
  };
}
export interface OraiswapOracleContractQuery<TData>
  extends OraiswapOracleReactQuery<Null, TData> {}
export function useOraiswapOracleContractQuery<TData = Null>({
  client,
  options
}: OraiswapOracleContractQuery<TData>) {
  return useQuery<Null, Error, TData>(
    ['oraiswapOracleContract', client?.contractAddress],
    () =>
      client ? client.contract() : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleExchangeQuery<TData>
  extends OraiswapOracleReactQuery<Null, TData> {}
export function useOraiswapOracleExchangeQuery<TData = Null>({
  client,
  options
}: OraiswapOracleExchangeQuery<TData>) {
  return useQuery<Null, Error, TData>(
    ['oraiswapOracleExchange', client?.contractAddress],
    () =>
      client ? client.exchange() : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleTreasuryQuery<TData>
  extends OraiswapOracleReactQuery<Null, TData> {}
export function useOraiswapOracleTreasuryQuery<TData = Null>({
  client,
  options
}: OraiswapOracleTreasuryQuery<TData>) {
  return useQuery<Null, Error, TData>(
    ['oraiswapOracleTreasury', client?.contractAddress],
    () =>
      client ? client.treasury() : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleRewardPoolQuery<TData>
  extends OraiswapOracleReactQuery<RewardPoolResponse, TData> {
  args: {
    denom: string;
  };
}
export function useOraiswapOracleRewardPoolQuery<TData = RewardPoolResponse>({
  client,
  args,
  options
}: OraiswapOracleRewardPoolQuery<TData>) {
  return useQuery<RewardPoolResponse, Error, TData>(
    ['oraiswapOracleRewardPool', client?.contractAddress, JSON.stringify(args)],
    () =>
      client
        ? client.rewardPool({
            denom: args.denom
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleContractInfoQuery<TData>
  extends OraiswapOracleReactQuery<ContractInfoResponse, TData> {}
export function useOraiswapOracleContractInfoQuery<
  TData = ContractInfoResponse
>({ client, options }: OraiswapOracleContractInfoQuery<TData>) {
  return useQuery<ContractInfoResponse, Error, TData>(
    ['oraiswapOracleContractInfo', client?.contractAddress],
    () =>
      client
        ? client.contractInfo()
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleExchangeRatesQuery<TData>
  extends OraiswapOracleReactQuery<ExchangeRatesResponse, TData> {
  args: {
    baseDenom?: string;
    quoteDenoms: string[];
  };
}
export function useOraiswapOracleExchangeRatesQuery<
  TData = ExchangeRatesResponse
>({ client, args, options }: OraiswapOracleExchangeRatesQuery<TData>) {
  return useQuery<ExchangeRatesResponse, Error, TData>(
    [
      'oraiswapOracleExchangeRates',
      client?.contractAddress,
      JSON.stringify(args)
    ],
    () =>
      client
        ? client.exchangeRates({
            baseDenom: args.baseDenom,
            quoteDenoms: args.quoteDenoms
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleExchangeRateQuery<TData>
  extends OraiswapOracleReactQuery<ExchangeRateResponse, TData> {
  args: {
    baseDenom?: string;
    quoteDenom: string;
  };
}
export function useOraiswapOracleExchangeRateQuery<
  TData = ExchangeRateResponse
>({ client, args, options }: OraiswapOracleExchangeRateQuery<TData>) {
  return useQuery<ExchangeRateResponse, Error, TData>(
    [
      'oraiswapOracleExchangeRate',
      client?.contractAddress,
      JSON.stringify(args)
    ],
    () =>
      client
        ? client.exchangeRate({
            baseDenom: args.baseDenom,
            quoteDenom: args.quoteDenom
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleTaxCapQuery<TData>
  extends OraiswapOracleReactQuery<TaxCapResponse, TData> {
  args: {
    denom: string;
  };
}
export function useOraiswapOracleTaxCapQuery<TData = TaxCapResponse>({
  client,
  args,
  options
}: OraiswapOracleTaxCapQuery<TData>) {
  return useQuery<TaxCapResponse, Error, TData>(
    ['oraiswapOracleTaxCap', client?.contractAddress, JSON.stringify(args)],
    () =>
      client
        ? client.taxCap({
            denom: args.denom
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleTaxRateQuery<TData>
  extends OraiswapOracleReactQuery<TaxRateResponse, TData> {}
export function useOraiswapOracleTaxRateQuery<TData = TaxRateResponse>({
  client,
  options
}: OraiswapOracleTaxRateQuery<TData>) {
  return useQuery<TaxRateResponse, Error, TData>(
    ['oraiswapOracleTaxRate', client?.contractAddress],
    () =>
      client
        ? client.treasury('tax_rate', {})
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true)
    }
  );
}
export interface OraiswapOracleUpdateTaxRateMutation {
  client: OraiswapOracleClient;
  msg: {
    rate: Decimal;
  };
  args?: {
    fee?: number | StdFee | 'auto';
    memo?: string;
    funds?: Coin[];
  };
}
export function useOraiswapOracleUpdateTaxRateMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      OraiswapOracleUpdateTaxRateMutation
    >,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, OraiswapOracleUpdateTaxRateMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateTaxRate(msg, fee, memo, funds),
    options
  );
}
export interface OraiswapOracleUpdateTaxCapMutation {
  client: OraiswapOracleClient;
  msg: {
    cap: Uint128;
    denom: string;
  };
  args?: {
    fee?: number | StdFee | 'auto';
    memo?: string;
    funds?: Coin[];
  };
}
export function useOraiswapOracleUpdateTaxCapMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      OraiswapOracleUpdateTaxCapMutation
    >,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, OraiswapOracleUpdateTaxCapMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateTaxCap(msg, fee, memo, funds),
    options
  );
}
export interface OraiswapOracleDeleteExchangeRateMutation {
  client: OraiswapOracleClient;
  msg: {
    denom: string;
  };
  args?: {
    fee?: number | StdFee | 'auto';
    memo?: string;
    funds?: Coin[];
  };
}
export function useOraiswapOracleDeleteExchangeRateMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      OraiswapOracleDeleteExchangeRateMutation
    >,
    'mutationFn'
  >
) {
  return useMutation<
    ExecuteResult,
    Error,
    OraiswapOracleDeleteExchangeRateMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.deleteExchangeRate(msg, fee, memo, funds),
    options
  );
}
export interface OraiswapOracleUpdateExchangeRateMutation {
  client: OraiswapOracleClient;
  msg: {
    denom: string;
    exchangeRate: Decimal;
  };
  args?: {
    fee?: number | StdFee | 'auto';
    memo?: string;
    funds?: Coin[];
  };
}
export function useOraiswapOracleUpdateExchangeRateMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      OraiswapOracleUpdateExchangeRateMutation
    >,
    'mutationFn'
  >
) {
  return useMutation<
    ExecuteResult,
    Error,
    OraiswapOracleUpdateExchangeRateMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateExchangeRate(msg, fee, memo, funds),
    options
  );
}
export interface OraiswapOracleUpdateAdminMutation {
  client: OraiswapOracleClient;
  msg: {
    admin: Addr;
  };
  args?: {
    fee?: number | StdFee | 'auto';
    memo?: string;
    funds?: Coin[];
  };
}
export function useOraiswapOracleUpdateAdminMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, OraiswapOracleUpdateAdminMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, OraiswapOracleUpdateAdminMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateAdmin(msg, fee, memo, funds),
    options
  );
}
