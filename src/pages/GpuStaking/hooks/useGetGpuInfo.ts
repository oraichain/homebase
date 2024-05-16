import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TIMER } from 'helper/timer';
import { INTERVAL_TIME_REFETCH } from '../constants';

const getGpuInfo = async () => {
  try {
    const endTime = Date.now();
    const startTime = endTime - TIMER.MILLISECOND_PER_HOUR;
    const res = await axios.get(
      `https://data-lab-center.orai.io/oraichain/gpu-process?offset=0&size=100&startTime=${startTime}&endTime=${endTime}`
    );
    return res?.data;
  } catch (error) {
    console.log('error gpu : ', error);

    return [];
  }
};

const useGetGpuInfo = () => {
  const { data } = useQuery(['gpu-info'], () => getGpuInfo(), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    refetchInterval: INTERVAL_TIME_REFETCH,
    placeholderData: []
  });

  return { data };
};

export default useGetGpuInfo;
