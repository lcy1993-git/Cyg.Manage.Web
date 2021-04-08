import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import DeliveryManage from '@/pages/index/components/delivery-manage';

interface CockpitConfigDeliveryComponentProps {
  componentProps?: string[];
}

const CockpitDeliveryComponent: React.FC<CockpitConfigDeliveryComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <DeliveryManage areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitDeliveryComponent;
