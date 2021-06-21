import React from 'react';
import styles from './index.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import { useRef } from 'react';
import { useMount } from 'ahooks';
import { useRequest } from 'ahooks';
import { getSurveyRate } from '@/services/project-management/project-all-area-statistics';
import moment from 'moment';

const SurveyRateComponent: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { data = [] } = useRequest(() => getSurveyRate());

  const weekDate = data.map((item: any) => {
    return moment(item.date);
  });

  console.log(data);

  let myChart: any = null;

  const options = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      splitNumber: 5,
      axisLabel: {
        formatter: `{value}%`,
      },
    },
    series: [
      {
        data: data.map((item: any) => item.surveyRate),
        type: 'line',
        smooth: true,
      },
    ],
  };

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement);
      myChart.setOption(options);
    }
  };

  useMount(() => {
    initChart();
  });

  return (
    <div className={styles.surveyRateComponent}>
      <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
    </div>
  );
};

export default SurveyRateComponent;
