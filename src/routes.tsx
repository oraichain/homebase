/* eslint-disable import/no-anonymous-default-export */
import Loader from 'components/Loader';
import NotFound from 'pages/NotFound';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import GpuCredit from 'pages/GpuCredit';
import GpuStaking from 'pages/GpuStaking';
import UniversalSwap from 'pages/UniversalSwap/index';
import GithubLogin from 'pages/GithubLogin/GithubLogin';

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
      <Route path="/gpu-credit" element={<GpuCredit />} />
      <Route path="/github-login" element={<GithubLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
