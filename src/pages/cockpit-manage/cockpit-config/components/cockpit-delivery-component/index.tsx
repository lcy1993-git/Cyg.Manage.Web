import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import DeliveryManage from '@/pages/index/components/delivery-manage';

interface CockpitConfigDeliveryComponentProps {
  componentProps?: string[];
}

const CockpitDeliveryComponent: React.FC<CockpitConfigDeliveryComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <DeliveryManage currentAreaInfo={currentAreaInfo} {...props} />
    </>
  );
};

export default CockpitDeliveryComponent;
