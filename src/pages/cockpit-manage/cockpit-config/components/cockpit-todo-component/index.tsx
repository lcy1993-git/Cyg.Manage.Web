import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import TodoComponent from '@/pages/index/components/to-do';

interface CockpitConfigTodoComponentProps {
  componentProps?: string[];
}

const CockpitTodoComponent: React.FC<CockpitConfigTodoComponentProps> = (props) => {
  const { currentAreaId, currentAreaLevel } = useContext(CockpitConfigContext);

  return (
    <>
      <TodoComponent areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  );
};

export default CockpitTodoComponent;
