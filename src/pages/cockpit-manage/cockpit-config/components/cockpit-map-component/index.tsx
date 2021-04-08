import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import MapChartComponent from '@/pages/index/components/map-chart-component';

interface CockpitConfigMapComponentProps {
  componentProps?: string[];
}

const CockpitMapComponent: React.FC<CockpitConfigMapComponentProps> = (props) => {
  const { setCurrentAreaId, setCurrentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <MapChartComponent
        setCurrentAreaId={setCurrentAreaId}
        setCurrentAreaLevel={setCurrentAreaLevel}
        {...props}
      />
    </>
  );
};

export default CockpitMapComponent;
