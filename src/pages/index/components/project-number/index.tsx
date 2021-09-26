import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import ChartBox from '../chart-box';

import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';

import styles from './index.less';
import useRequest from '@ahooksjs/use-request';
import { getProjectNumberData } from '@/services/index';

const { Option } = Select;

interface ProjectNumberProps {}

const ProjectNumber: React.FC<ProjectNumberProps> = (props) => {
  const [searchType, setSearchType] = useState<string>('0');
  const divRef = useRef<HTMLDivElement>(null);

  const { data = [] } = useRequest(() => getProjectNumberData({}), { refreshDeps: [searchType] });

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
          <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #0076FF;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">勘察率: ${handleRate(
            thisRate,
          )}%</span>
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

  return (
    <ChartBox title="项目数量">
      <div className={styles.typeSelect}>
        <Select
          bordered={false}
          defaultValue={searchType}
          suffixIcon={<CaretDownOutlined />}
          onChange={(v) => setSearchType(v)}
        >
          <Option value="0">全部</Option>
          <Option value="14">待安排</Option>
          <Option value="1">未来勘察</Option>
          <Option value="2">勘察中</Option>
          <Option value="3">已勘察</Option>
          <Option value="4">设计中</Option>
          <Option value="14">已设计</Option>
        </Select>
      </div>
      <div className={styles.chartContent}>
        <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
      </div>
    </ChartBox>
  );
};

export default ProjectNumber;
