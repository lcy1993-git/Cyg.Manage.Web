import { useGetMinAndMaxTime } from '@/utils/hooks';
import { flatten } from '@/utils/utils';
import React, { useMemo } from 'react';
import uuid from 'node-uuid';
import moment from "moment";

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
        endTime: '2022-06-25',
      },
      {
        name: '项目三',
        id: 'projectThree',
        startTime: '2021-03-17',
        endTime: '2022-05-30',
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

const weekObject = {
  0: "日",
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六"
}

const GanttComponentView: React.FC<GanttComponentViewProps> = (props) => {
  const flattenData = useMemo(() => {
    return flatten<DataSourceItem>(testData);
  }, [JSON.stringify(testData)]);

  const timeData = useGetMinAndMaxTime(flattenData);
  // 获取到了所有时间中的最大时间和最小时间
  const timeArray = useMemo(() => {
    const minTime = moment(timeData.minStartTime);
    const maxTime = moment(timeData.maxEndTime);
    const diffMonths = maxTime.diff(minTime, "months");
    // 获取最小时间所处月份的第一天
    const minMonthStartTime = moment(minTime).startOf("month");

    const finalyTimeData = [...new Array(diffMonths).keys()].map((item) => {
      return moment(minMonthStartTime).add(item, "month").format("YYYY-MM-DD")
    }).map((item) =>  {
      return {
        startTime: item,
        days: moment(item).daysInMonth(),
        endTime: moment(item).endOf("month").format("YYYY-MM-DD"),
        key: uuid.v1(),
        month: moment(item).format("YYYY-MM")
      }
    })

    return finalyTimeData
  }, [JSON.stringify(timeData)])

  const calendarElement = timeArray?.map((item) => {
    return (
      <div key={item.key} className={styles.ganttComponentMonth}>
        <div className={styles.ganttComponentMonthContent}>
          {item.month}
        </div>
        <div className={styles.ganttComponentMonthDayContent}>
          {
          [...new Array(item.days).keys()].map((ite) => {
            return (
              <div key={`${item.key}_day${ite}`} className={styles.ganttCalendarItem}>{ite + 1}</div>
            )
          })
        }
        </div>
        <div className={styles.ganttComponentMonthDayAndWeekContent}>
          {
          [...new Array(item.days).keys()].map((ite) => {
            return (
              <div key={`${item.key}_week${ite}`} className={styles.ganttCalendarItem}>{
                weekObject[moment(item.startTime).add(ite, "days").day()]
              }</div>
            )
          })
        }
        </div>
        
      </div>
    )
  })

  return (
    <div className={styles.ganttComponentView}>
      <div className={styles.ganttComponentButton}>
        <div className={styles.ganttComponentButtonLeft}>
        
        </div>
        <div className={styles.ganttComponentButtonRight}>
        
        </div>
      </div>
      <div className={styles.ganttComponentViewContent}>
        <div className={styles.ganttComponentViewLeft}>
        
        </div>
        <div className={styles.ganttComponentViewRight}>
          <div className={styles.ganttComponentCalendarContent}>
            {calendarElement}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttComponentView;
