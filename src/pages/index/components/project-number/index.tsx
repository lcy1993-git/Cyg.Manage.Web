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
import { AreaInfo, getProjectNumberData } from '@/services/index';
import moment from 'moment';

const { Option } = Select;

interface ProjectNumberProps {
  componentProps?: string[];
  currentAreaInfo: AreaInfo;
}

const ProjectNumber: React.FC<ProjectNumberProps> = (props) => {
  const [searchType, setSearchType] = useState<string>('0');
  const divRef = useRef<HTMLDivElement>(null);
  const { currentAreaInfo, componentProps = ['14', '1', '2', '3', '4', '19'] } = props;
  const { data = [] } = useRequest(
    () =>
      getProjectNumberData({
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
        category: searchType,
      }),
    { refreshDeps: [searchType, currentAreaInfo], onSuccess: () => {
        initChart();
    } },
  );

  let myChart: any = null;
  
  const getOptions = () => {
      const dateData = data.map((item) => moment(item.key).format("MM月DD日")).reverse();
      const currentDateData = data.map((item) => item.value.qty).reverse();
      console.log(currentDateData)
      const changeDateData = data.map((item) => item.value.qty - item.value.yesterdayQty).reverse();
      return {
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
   
              const thisTime = dateData[dataIndex];
              const currentData = currentDateData[dataIndex] ?? 0;
              const currentChangeData = changeDateData[dataIndex] ?? 0;
      
              return `
                <span style="font-size: 14px; font-weight: 600; color: #505050">${thisTime}</span><br />
                <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #4DA944;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">当前项目数：${currentData}</span><br />
                <span style="display: inline-block; width: 6px;height: 6px;border-radius: 50%; background: #0076FF;vertical-align: middle; margin-right: 6px;"></span><span style="color: #505050">较昨日变化: ${currentChangeData}</span>
              `;
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              lineStyle: {
                color: '#74AC91',
              },
            },
            data: dateData,
          },
          yAxis: {
            type: 'value',
            splitNumber: 5,
            axisLabel: {
              lineStyle: {
                color: '#74AC91',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#355345',
                type: 'dashed',
              },
            },
          },
          series: [
            {
              data: currentDateData,
              type: 'line',
              color: '#4DA944',
            },
          ],
      }
  }

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement);
      const options = getOptions();
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
          {componentProps.includes('14') && <Option value="14">待安排</Option>}
          {componentProps.includes('1') && <Option value="1">未来勘察</Option>}
          {componentProps.includes('2') && <Option value="2">勘察中</Option>}
          {componentProps.includes('3') && <Option value="3">已勘察</Option>}
          {componentProps.includes('4') && <Option value="4">设计中</Option>}
          {componentProps.includes('19') && <Option value="19">已设计</Option>}
        </Select>
      </div>
      <div className={styles.chartContent}>
        <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
      </div>
    </ChartBox>
  );
};

export default ProjectNumber;
