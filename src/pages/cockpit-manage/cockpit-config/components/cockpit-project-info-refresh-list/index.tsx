import React, { useContext } from 'react';
import { CockpitConfigContext } from '../../context';
import ProjetctRefreshList from '@/pages/index/components/project-info-refresh-list';
import ChartBox from '@/pages/index/components/chart-box';

interface CockpitProjectInfoFreshListProps {
  componentProps?: string[];
}

const CockpitProjectInfoFreshList: React.FC<CockpitProjectInfoFreshListProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext);

  return (
    <>
      <ChartBox title="实时数据">
        <ProjetctRefreshList currentAreaInfo={currentAreaInfo} {...props} />
      </ChartBox>
    </>
  );
};

export default CockpitProjectInfoFreshList;
