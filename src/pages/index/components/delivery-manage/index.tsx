import BarChart from '@/components/bar-chart';
import { CaretDownOutlined } from '@ant-design/icons';
import { Select, DatePicker, Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ChartBox from '../chart-box';
import ChartTab from '../chart-tab';
import * as echarts from 'echarts/lib/echarts';
const { Option } = Select;

import styles from './index.less';
import { useRequest } from 'ahooks';
import { getConsigns, AreaInfo } from '@/services/index';
import { useMemo } from 'react';
import { Moment } from 'moment';
import moment from 'moment';
import borderStylesHTML from '../../utils/borderStylesHTML';


const { RangePicker } = DatePicker;

interface DeliveyManageProps {
  componentProps?: string[];
  currentAreaInfo: AreaInfo;
}

const DeliveryManage: React.FC<DeliveyManageProps> = (props) => {
  const { componentProps = ['person', 'department', 'company'], currentAreaInfo } = props;
  const [startTime, setStartTime] = useState<Moment | string | null>(null);
  const [endTime, setEndTime] = useState<Moment | null | string>(null);

  const [activeKey, setActiveKey] = useState<string>();

  const tabData = [
    {
      id: 'person',
      name: '员工',
      value: '1',
    },
    {
      id: 'department',
      name: '部组',
      value: '2',
    },
    {
      id: 'company',
      name: '公司',
      value: '3',
    },
  ];

  const showTabData = useMemo(() => {
    const filterData = tabData.filter((item) => componentProps.includes(item.id));
    if (filterData && filterData.length > 0) {
      setActiveKey(filterData[0].id);
    }
    return filterData;
  }, [JSON.stringify(componentProps)]);

  const type = useMemo(() => {
    const dataIndex = tabData.findIndex((item) => item.id === activeKey);
    if (dataIndex > -1) {
      return tabData[dataIndex].value;
    }
    return undefined;
  }, [activeKey]);

  const { data: consignsData, run, loading } = useRequest(
    () =>
      getConsigns({
        type: type!,
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
        startTime: startTime,
        endTime: endTime,
      }),
    {
      ready: !!type,
      refreshDeps: [type, currentAreaInfo],
    },
  );

  const option = useMemo(() => {
    if (consignsData) {
      const dataArray = consignsData?.map((item) => item.key);
      const valueArray = consignsData?.map((item) => item.value);

      return {
        grid: {
          left: 60,
          bottom: 30,
          top: 20,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderColor: '#000',
          formatter(params: any){
            const { name, value } = params[0];
            
            return borderStylesHTML + `<span style="color: #2AFE97">${name}</span><br />
            <span style="color: #2AFE97">项目数量：</span><span style="color: #FFF">${value}</span>
            `
            
          }
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#74AC91',
            },
          },
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
        yAxis: {
          type: 'category',
          data: dataArray,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#74AC91',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#74AC91',
            },
            fontSize: 10,
            align: 'right',
            formatter: function (params: any) {
              let newParamsName = '';
              let paramsNameNumber = params.length;
              if (params.length > 12) {
                params = params.substring(0, 9) + '...';
              }
              let provideNumber = 4; //一行显示几个字
              let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = '';
                  let start = p * provideNumber;
                  let end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              
              return newParamsName;
            },
          },
        },
        series: [
          {
            data: valueArray,
            // type: 'pie',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function () {
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: '#00481E', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#2AFE97', // 100% 处的颜色
                    },
                  ]);
                },
              },
            },
          },
        ],
      };
    }
    return undefined;
  }, [JSON.stringify(consignsData)]);

  const reset = () => {
    setStartTime(null);
    setEndTime(null);
  };

  useEffect(() => {
    run();
  }, [JSON.stringify(startTime), JSON.stringify(endTime)]);

  return (
    <ChartBox title="交付统计">
      <Spin delay={300} spinning={loading}>
      <div className={styles.deliveryMange}>
        <div className={styles.deliveryManageStatisticCondition}>
          <div className={styles.deliverySelect}>
            <Select bordered={false} defaultValue="number" suffixIcon={<CaretDownOutlined />}>
              <Option value="number">项目数量</Option>
              {/* <Option value="designFee">设计费</Option> */}
            </Select>
          </div>
          <div className={styles.deliveryTab}>
            <ChartTab
              data={showTabData}
              onChange={(value) => setActiveKey(value)}
              defaultValue={activeKey}
            />
          </div>
        </div>
        <div className={styles.deliveryChart}>
          {type && option && <BarChart options={option} />}
        </div>
        <div className={styles.deliveryTime}>
          <span className={styles.deliveryChooseTimeLabel}>选择日期</span>
          <div className={styles.delivertChooseTime}>
            <RangePicker
              format="YYYY-MM-DD"
              allowClear={false}
              value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
              onChange={(dates, dateStrings) => {
                setStartTime(dateStrings[0]);
                setEndTime(dateStrings[1]);
              }}
              bordered={false}
              renderExtraFooter={() => [
                <Button key="clearDate" onClick={() => reset()}>
                  清除日期
                </Button>,
              ]}
            />
          </div>
        </div>
      </div>
      </Spin>
    </ChartBox>
  );
};

export default DeliveryManage;
