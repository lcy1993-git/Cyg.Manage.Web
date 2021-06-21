import AnnularFighure from '@/components/annular-fighure';
import React from 'react';
import styles from './index.less';

const StatisticsBieChart: React.FC = () => {
  const option = {
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
            ]
        }
    ]
};
  return (
    <div className={styles.statisticsBieChart}>
      <AnnularFighure options={option} />
    </div>
  );
};

export default StatisticsBieChart;
