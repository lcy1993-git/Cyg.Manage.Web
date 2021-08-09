import { getProjectQtyOfDay } from '@/services/project-management/project-statistics-v2';
import { useRequest } from 'ahooks';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import * as echarts from 'echarts/lib/echarts';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useProjectAllAreaStatisticsStore } from '../../store';
import { ProjectStatus } from '../daily-change-project-statistics';
import TabsWindow from '../tabs-window';

const tabs = ['合计', '待安排', '未勘察', '勘察中', '已勘察', '设计中', '已设计'] as const;
type TabsUnion = typeof tabs[number];

const DailyChangeStatistics: React.FC = () => {
  const [tab, setTab] = useState<TabsUnion | string>('合计');

  const { dataType } = useProjectAllAreaStatisticsStore();

  const divRef = useRef<HTMLDivElement>(null);

  // ! 待完善
  const { data = [] } = useRequest(() => getProjectQtyOfDay('', ProjectStatus[tab]), {
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      initChart();
    },
    refreshDeps: [dataType, tab],
  });

  const dateData = [...data].reverse().map((item: any) => {
    return moment(item.key).format('M月D日');
  });

  const numberData = [...data].reverse().map((item: any) => {
    return item.value;
  });

  let myChart: any = null;

  const options = useMemo(
    () => ({
      grid: {
        top: 25,
        bottom: 40,
        right: 30,
        left: 60,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { dataIndex } = params[0];
          const copyData = [...data].reverse();
          const thisTime = moment(copyData[dataIndex].key).format('M月D日');
          const thisNumber = copyData[dataIndex].value ?? 0;

          return `
          <span style="font-size: 14px; font-weight: 600; color: #505050">${thisTime}</span><br />
          <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #4DA944;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">数据：${thisNumber}</span><br />
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
          formatter: `{value}`,
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
        minInterval: 1,
      },
      series: [
        {
          data: numberData,
          type: 'line',
          color: '#4DA944',
        },
      ],
    }),
    [data, numberData, dateData],
  );

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init(divRef.current as unknown as HTMLDivElement);
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
      } else {
        resize();
      }
    });

    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  return (
    <div style={{ height: '100%' }}>
      <TabsWindow
        value={tab}
        onChange={setTab}
        tabsArray={tabs.map((t) => ({ name: t, value: t }))}
      >
        <div style={{ height: '100%' }} ref={divRef}></div>
      </TabsWindow>
    </div>
  );
};

export default DailyChangeStatistics;
