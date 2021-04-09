import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import MapChartComponent from '@/pages/index/components/map-chart-component';

interface CockpitConfigMapComponentProps {
  componentProps?: string[];
}

const CockpitMapComponent: React.FC<CockpitConfigMapComponentProps> = (props) => {
  const { currentAreaInfo,setCurrentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <MapChartComponent currentAreaInfo={currentAreaInfo} setCurrentAreaInfo={setCurrentAreaInfo} {...props} />
    </>
  );
};

export default CockpitMapComponent;
