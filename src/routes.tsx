/* eslint-disable import/no-anonymous-default-export */
import Loader from 'components/Loader';
import NotFound from 'pages/NotFound';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Balance from 'pages/Balance';
import Pools from 'pages/Pools';
import GpuStaking from 'pages/GpuStaking';
import PoolDetail from 'pages/Pools/PoolDetail';
import UniversalSwap from 'pages/UniversalSwap/index';
import CoHarvest from 'pages/CoHarvest';
import BitcoinDashboard from 'pages/BitcoinDashboard';
import StakingPage from 'pages/Staking';
import DownloadApp from 'pages/DownloadApp';

export default () => (
  <Suspense
    fallback={
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Loader />
      </div>
    }
  >
    <Routes>
      <Route path="/" element={<UniversalSwap />} />
      <Route path="/homebase" element={<UniversalSwap />} />
      <Route path="/gpu-staking" element={<GpuStaking />} />
      <Route path="/staking" element={<StakingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
