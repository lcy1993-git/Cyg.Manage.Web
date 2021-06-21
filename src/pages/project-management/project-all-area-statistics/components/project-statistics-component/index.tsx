import React from 'react';
import styles from './index.less';
import NumberStatisticsComponent from './number-statistics-component';
import StatisticsBieChart from './statistics-bie-chart';

const ProjectStatisticsCompoent: React.FC = () => {
  return (
    <div className={styles.projectStatisticsComponent}>
      <div className={styles.projectStatisticsChart}>
        <StatisticsBieChart />
      </div>
      <div className={styles.projectStatisticsOther}>
        <div style={{marginBottom: "48px"}}>
          <NumberStatisticsComponent title={'已设计数'} num={279} unit={'个'} />
        </div>
        <NumberStatisticsComponent title={'完成率'} num={35.76} unit={'%'} />
      </div>
    </div>
  );
};

export default ProjectStatisticsCompoent;
