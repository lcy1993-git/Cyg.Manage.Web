import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import ProgressComponent from '@/pages/index/components/project-progress';

interface CockpitProgressComponentProps {
  componentProps?: string[];
}

const CockpitProgressComponent: React.FC<CockpitProgressComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <ProgressComponent currentAreaInfo={currentAreaInfo} {...props} />
    </>
  );
};

export default CockpitProgressComponent;
