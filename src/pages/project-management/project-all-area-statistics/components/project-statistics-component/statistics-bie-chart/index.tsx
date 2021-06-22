import AnnularFighure from '@/components/annular-fighure';
import { useSize } from 'ahooks';
import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.less';

interface statusDataParams {
  statusData: any;
}

const StatisticsBieChart: React.FC<statusDataParams> = (props) => {
  const { statusData } = props;
  const windowContentRef = useRef<HTMLDivElement>(null);
  const contentSize = useSize(windowContentRef);
  const option = {
    tooltip: {
      trigger: 'item',
    },
    color: ['#68b660', '#42d5c8', '#0076ff', '#fbd436', '#f2627b', '#8796ff'],
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        // data: statusData?.items?.map((item: any) => {
        //   return { value: item.value, name: item.key };
        // }),
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

  useEffect(() => {
    if (contentSize.width || contentSize.height) {
      const myEvent = new Event('resize');
      window.dispatchEvent(myEvent);
    }
  },[JSON.stringify(contentSize)])

  return (
    <div className={styles.statisticsBieChart} ref={windowContentRef}>
      <AnnularFighure options={option} />
    </div>
  );
};

export default StatisticsBieChart;
