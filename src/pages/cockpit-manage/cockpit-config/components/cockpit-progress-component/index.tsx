import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import ProgressComponent from '@/pages/index/components/project-progress';

interface CockpitProgressComponentProps {
  componentProps?: string[];
}

const CockpitProgressComponent: React.FC<CockpitProgressComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <ProgressComponent areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitProgressComponent;
