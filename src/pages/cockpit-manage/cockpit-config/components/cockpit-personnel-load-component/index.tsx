import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import PersonnelLoadComponent from '@/pages/index/components/personnel-load';

interface CockpitPersonnelLoadComponentProps {
  componentProps?: string[];
}

const CockpitPersonnelLoadComponent: React.FC<CockpitPersonnelLoadComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <PersonnelLoadComponent areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitPersonnelLoadComponent;
