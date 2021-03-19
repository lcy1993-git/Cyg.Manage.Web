import { useGetMinAndMaxTime } from '@/utils/hooks';
import { flatten } from '@/utils/utils';
import React, { useMemo } from 'react';

import styles from './index.less';

const testData = [
  {
    name: '工程一',
    id: 'engineerOne',
    startTime: '2021-03-17',
    endTime: '2021-05-01',
    children: [
      {
        name: '项目一',
        id: 'projectOne',
        startTime: '2021-03-17',
        endTime: '2021-03-24',
      },
      {
        name: '项目二',
        id: 'projectTwo',
        startTime: '2021-03-17',
        endTime: '2021-05-25',
      },
      {
        name: '项目三',
        id: 'projectThree',
        startTime: '2021-03-17',
        endTime: '2021-05-30',
      },
    ],
  },
];

interface GanttComponentViewProps {
  dayWidth?: number;
  itemHeight?: number;
  dataSource?: any[];
}

interface DataSourceItem {
  name: string;
  id: string;
  startTime: string;
  endTime: string;
}

const GanttComponentView: React.FC<GanttComponentViewProps> = (props) => {
  const flattenData = useMemo(() => {
    return flatten<DataSourceItem>(testData);
  }, [JSON.stringify(testData)]);

  const timeData = useGetMinAndMaxTime(flattenData);

  console.log(timeData);

  return (
    <div className={styles.ganttComponentView}>
      <div className={styles.ganttComponentButton}>
        <div className={styles.ganttComponentButtonLeft}></div>
        <div className={styles.ganttComponentButtonRight}></div>
      </div>
      <div className={styles.ganttComponentViewContent}>
        <div className={styles.ganttComponentViewLeft}></div>
        <div className={styles.ganttComponentViewRight}></div>
      </div>
    </div>
  );
};

export default GanttComponentView;
