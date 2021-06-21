import React from 'react';
import styles from './index.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import { useRef } from 'react';
import { useMount } from 'ahooks';

const SurveyRateComponent: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  let myChart: any = null;

  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
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
