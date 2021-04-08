import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import CaseComponent from '@/pages/index/components/project-schedule-status';

interface CockpitConfigCaseComponentProps {
  componentProps?: string[];
}

const CockpitCaseComponent: React.FC<CockpitConfigCaseComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <CaseComponent areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitCaseComponent;
