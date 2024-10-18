import { useQuery } from '@tanstack/react-query';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { network } from 'config/networks';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';

import { flattenTokensWithIcon } from 'config/chainInfos';
import { LUCKY_DRAW_CONTRACT, LUCKY_DRAW_FEE, FETCH_RESULT_INTERVAL, MAX_SPIN_TIME_PER_SEND } from './constants';
import { LuckyWheelContractQueryClient } from './lucky-draw-client';
import { Spin } from './lucky-draw-client/LuckyWheelContract.types';

export const getDataLogByKey = (log: any, key: string) => {
  const events = log?.events || [];

  const wasmEvent = events.find((e) => e.type === 'wasm') || { type: 'wasm', attributes: [] };

  const { value = '' } = wasmEvent.attributes?.find((we) => we.key === key) || { key, value: '' };

  return { value };
};

export const sendMultiple = async ({
  senderAddress,
  timeToSpin = MAX_SPIN_TIME_PER_SEND,
  fee = LUCKY_DRAW_FEE,
  feeDenom = 'orai'
}: {
  senderAddress: string;
  timeToSpin?: number;
  fee?: string;
  feeDenom?: string;
}) => {
  const msgs = [...new Array(timeToSpin)].map(() => {
    return {
      contractAddress: LUCKY_DRAW_CONTRACT,
      msg: { spin: {} },
      funds: [{ denom: feeDenom, amount: fee }]
    };
  });

  const result = await window.client.executeMultiple(senderAddress, msgs, 'auto');

  return {
    logs: result?.logs,
    transactionHash: result.transactionHash
  };
};

export const useLuckyDrawConfig = () => {
  const getSpinConfig = async () => {
    const luckyDrawClient = new LuckyWheelContractQueryClient(window.client, LUCKY_DRAW_CONTRACT);
    const data = await luckyDrawClient.config();

    return data;
  };
  const {
    data: spinConfig,
    isLoading,
    refetch: refetchConfig
  } = useQuery(['getSpinConfig'], () => getSpinConfig(), {
    refetchOnWindowFocus: true,
    // refetchInterval: LUCKY_DRAW_INTERVAL
    placeholderData: {
      owner: 'orai1x2hrsfczmh9stjhpgepqnhc0ek0k6m7a74uuxd',
      reward_token: {
        native_token: {
          denom: 'orai'
        }
      },
      participation_token: { native_token: { denom: 'orai' } },
      fee_per_spin: LUCKY_DRAW_FEE,
      max_limit: '1000',
      total_prize: '10000'
    }
  });

  const fee = spinConfig?.fee_per_spin || LUCKY_DRAW_FEE;
  const feeDenom = spinConfig?.participation_token?.['native_token']?.denom || 'orai';
  const feeToken = flattenTokensWithIcon.find((tk) => tk.denom === feeDenom);

  return {
    spinConfig: {
      feeDenom,
      feeToken,
      fee
    },
    isLoading,
    refetchConfig
  };
};

export const useGetSpinResult = ({ id }: { id: number }) => {
  const getSpinResults = async () => {
    const luckyDrawClient = new LuckyWheelContractQueryClient(window.client, LUCKY_DRAW_CONTRACT);
    return luckyDrawClient.getSpin({ id });
  };

  const {
    data: spinResult,
    isLoading,
    refetch: refetchResult
  } = useQuery(['getSpinConfig', id], () => getSpinResults(), {
    refetchOnWindowFocus: true,
    refetchInterval: (data) => {
      return data?.result_time ? false : FETCH_RESULT_INTERVAL;
    },
    // refetchInterval: FETCH_RESULT_INTERVAL,
    enabled: !!id,
    placeholderData: {
      id,
      participant: '',
      random_number: '0',
      reward: '0',
      spin_time: Math.floor(Date.now() / 1000),
      result_time: 0
    }
  });

  // console.log('spinResult ==>', spinResult);
  return {
    spinResult,
    isLoading,
    refetchResult
  };
};

export const useGetTotalWonReward = () => {
  const getState = async () => {
    const contractClient = new LuckyWheelContractQueryClient(window.client, LUCKY_DRAW_CONTRACT);
    const res = await contractClient.state();
    return res.total_prize_won;
  };

  const { data, isLoading, refetch } = useQuery(['getState'], () => getState(), {});
  return { totalRewarded: data, isLoading, refetchTotalRewarded: refetch };
};

export const useGetListSpinResult = ({ spinIdList }: { spinIdList: number[] }) => {
  const getListSpinResults = async () => {
    const multicall = new MulticallQueryClient(window.client, network.multicall);

    const res = await multicall.aggregate({
      queries: spinIdList.map((id) => ({
        address: LUCKY_DRAW_CONTRACT,
        data: toBinary({ spin: { id } })
      }))
    });

    const data = spinIdList.map((spinId, ind) => {
      if (!res.return_data[ind].success) {
        return {
          spinId,
          participant: '',
          random_number: '0',
          reward: '0',
          spin_time: Math.floor(Date.now() / 1000),
          result_time: 0
        };
      }
      const response: Spin = fromBinary(res.return_data[ind].data);
      return response;
    });

    // const luckyDrawClient = new LuckyWheelContractQueryClient(window.client, LUCKY_DRAW_CONTRACT);
    // const data = await luckyDrawClient.spin({ id });

    return data;
  };

  const {
    data: spinResult,
    isLoading,
    refetch: refetchResult
  } = useQuery(['getSpinConfigList', spinIdList], () => getListSpinResults(), {
    refetchOnWindowFocus: true,
    refetchInterval: (data) => {
      const checkStop = data?.length && data?.every((d) => d.result_time && d.result_time > 0);
      // console.log('checkStop', checkStop);
      return checkStop ? false : FETCH_RESULT_INTERVAL;
    },
    enabled: !!spinIdList?.length,
    placeholderData: []
  });

  const isDone = spinResult?.length && spinResult?.every((d) => d.result_time && d.result_time > 0);

  // console.log('spinResult ==>', { spinIdList, spinResult, isDone });

  return {
    isDone,
    spinResult,
    isLoading,
    refetchResult
  };
};
