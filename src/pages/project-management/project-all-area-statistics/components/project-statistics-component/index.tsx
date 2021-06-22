import React from 'react';
import styles from './index.less';
import NumberStatisticsComponent from './number-statistics-component';
import StatisticsBieChart from './statistics-bie-chart';
import { useRequest } from 'ahooks';
import { getStatus } from '@/services/project-management/project-all-area-statistics';

const ProjectStatisticsCompoent: React.FC = () => {
  const { data } = useRequest(() => getStatus());

  return (
    <div className={styles.projectStatisticsComponent}>
      <div className={styles.projectStatisticsChart}>
        <div className={styles.projectTotalNumber}>
          <NumberStatisticsComponent title={'项目总数'} num={data?.totalQty ?? 0} unit={'个'} />
        </div>
        <StatisticsBieChart statusData={data} />
      </div>
      <div className={styles.projectStatisticsOther}>
        <div style={{ marginBottom: '48px' }}>
          <NumberStatisticsComponent title={'已设计数'} num={data?.designedQty ?? 0} unit={'个'} />
        </div>
        <NumberStatisticsComponent title={'完成率'} num={data?.completionRate ?? 0} unit={'%'} />
      </div>
    </div>
  );
};

export default ProjectStatisticsCompoent;
