import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import ProjectTypeComponent from '@/pages/index/components/project-type';

interface CockpitProjectTypeComponentProps {
  componentProps?: string[];
}

const CockpitProjectTypeComponent: React.FC<CockpitProjectTypeComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <ProjectTypeComponent areaInfo={currentAreaInfo} {...props} />
    </>
  );
};

export default CockpitProjectTypeComponent;
