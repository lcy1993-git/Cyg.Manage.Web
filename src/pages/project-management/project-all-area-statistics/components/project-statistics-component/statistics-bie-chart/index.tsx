import AnnularFighure from '@/components/annular-fighure';
import React from 'react';
import styles from './index.less';

interface statusDataParams {
  statusData: any;
}

const StatisticsBieChart: React.FC<statusDataParams> = (props) => {
  const { statusData } = props;
  console.log(statusData);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    color: ['#68b660', '#42d5c8', '#0076ff', '#fbd436', '#f2627b', '#8796ff'],
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        data: [
          { value: 1000, name: '待安排' },
          { value: 735, name: '未勘察' },
          { value: 580, name: '勘查中' },
          { value: 484, name: '已勘察' },
          { value: 300, name: '设计中' },
          { value: 300, name: '已设计' },
        ],
      },
    ],
  };
  return (
    <div className={styles.statisticsBieChart}>
      <AnnularFighure options={option} />
    </div>
  );
};

export default StatisticsBieChart;
