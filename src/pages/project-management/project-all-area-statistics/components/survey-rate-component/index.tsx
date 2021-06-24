import React from 'react';
import styles from './index.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import { useRef } from 'react';
import { useRequest } from 'ahooks';
import { getSurveyRate } from '@/services/project-management/project-all-area-statistics';
import moment from 'moment';
import { useEffect } from 'react';
import { handleRate } from '@/utils/utils';

const SurveyRateComponent: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { data = [] } = useRequest(() => getSurveyRate(), {
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      initChart();
    },
  });

  const dateData = [...data].reverse().map((item: any) => {
    return moment(item.date).format('MM-DD');
  });

  const rateData = [...data].reverse().map((item: any) => {
    return item.surveyRate;
  });

  let myChart: any = null;

  const options = {
    grid: {
      top: 20,
      bottom: 40,
      right: 30,
      left: 60,
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const { dataIndex } = params[0];
        const copyData = [...data].reverse();
        const thisTime = moment(copyData[dataIndex].date).format('YYYY-MM-DD');
        const thisRate = copyData[dataIndex].surveyRate ?? 0;
        const thisNumber = copyData[dataIndex].totalQty ?? 0;

        return `
          <span style="font-size: 14px; font-weight: 600; color: #505050">${thisTime}</span><br />
          <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #4DA944;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">项目总数：${thisNumber}</span><br />
          <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #0076FF;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">勘察率: ${handleRate(thisRate)}%</span>
        `;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        lineStyle: {
          color: '#505050',
        },
      },
      data: dateData,
    },
    yAxis: {
      type: 'value',
      splitNumber: 5,
      axisLabel: {
        formatter: `{value}%`,
        lineStyle: {
          color: '#505050',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#E9E9E9',
          type: 'dashed',
        },
      },
      min: 0,
      max: 100,
    },
    series: [
      {
        data: rateData,
        type: 'line',
        color: '#4DA944',
      },
    ],
  };

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement);
      myChart.setOption(options);
    }
  };

  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize();
      }, 100);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!divRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize);
        return;
      } else {
        resize();
      }
    });

    () => {
      window.removeEventListener('resize', resize);
    };
  });

  // useMount(() => {
  //   initChart();
  // });

  return (
    <div className={styles.surveyRateComponent}>
      <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
    </div>
  );
};

export default SurveyRateComponent;
