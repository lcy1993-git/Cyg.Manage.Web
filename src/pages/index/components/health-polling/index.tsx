import { pollingHealth } from '@/services/index';
import { useRequest } from 'ahooks';
import React from 'react';

const HealthPolling: React.FC = () => {
  //轮询
  useRequest(() => pollingHealth(), {
    pollingInterval: 3000,
  });
  return <div></div>;
};

export default HealthPolling;
