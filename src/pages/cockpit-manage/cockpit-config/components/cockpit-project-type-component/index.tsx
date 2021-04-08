import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import ProjectTypeComponent from '@/pages/index/components/project-type';

interface CockpitProjectTypeComponentProps {
  componentProps?: string[];
}

const CockpitProjectTypeComponent: React.FC<CockpitProjectTypeComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <ProjectTypeComponent areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitProjectTypeComponent;
