import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import MapChartComponent from '@/pages/index/components/map-chart-component';

interface CockpitConfigMapComponentProps {
  componentProps?: string[];
}

const CockpitMapComponent: React.FC<CockpitConfigMapComponentProps> = (props) => {
  const { setCurrentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <MapChartComponent setCurrentAreaInfo={setCurrentAreaInfo} {...props} />
    </>
  );
};

export default CockpitMapComponent;
