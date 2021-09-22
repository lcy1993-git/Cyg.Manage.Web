import { getProjectStatisticsOfPie } from '@/services/project-management/project-statistics-v2';
import { handleRate } from '@/utils/utils';
import { useRequest } from 'ahooks';
import React from 'react';
import { useProjectAllAreaStatisticsStore } from '../../store';
import styles from './index.less';
import NumberStatisticsComponent from './number-statistics-component';
import StatisticsBieChart from './statistics-bie-chart';

const ProjectStatisticsComponent: React.FC = () => {
  const { dataType, companyInfo, projectShareCompanyId } = useProjectAllAreaStatisticsStore();

  // ! 待接口完善
  const { data } = useRequest<StatusParams>(
    () =>
      getProjectStatisticsOfPie({
        projectShareCompanyId: companyInfo.companyId!,
        companyId: projectShareCompanyId,
      }),
    {
      refreshDeps: [dataType],
      ready: !!projectShareCompanyId,
    },
  );

  return (
    <div className={styles.projectStatisticsComponent}>
      <div className={styles.projectStatisticsChart}>
        <div className={styles.projectTotalNumber}>
          <NumberStatisticsComponent title={'项目总数'} num={data?.totalQty ?? 0} unit={'个'} />
        </div>
        <StatisticsBieChart statusData={data!!} />
      </div>
      <div className={styles.projectStatisticsOther}>
        <div style={{ marginBottom: '48px' }}>
          <NumberStatisticsComponent title={'已设计数'} num={data?.designedQty ?? 0} unit={'个'} />
        </div>
        <NumberStatisticsComponent
          title={'完成率'}
          num={handleRate(data?.completionRate ?? 0)}
          unit={'%'}
        />
      </div>
    </div>
  );
};

export default ProjectStatisticsComponent;
