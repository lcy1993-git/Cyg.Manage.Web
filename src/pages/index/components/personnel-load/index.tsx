import BarChart from '@/components/bar-chart';
import React from 'react';
import * as echarts from 'echarts/lib/echarts';
import ChartBox from '../chart-box';
import ChartTab from '../chart-tab';
import styles from './index.less';
import { useState, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { getBurdens, AreaInfo } from '@/services/index';
import { useHistory } from 'react-router-dom';

interface Props {
  componentProps?: string[];
  currentAreaInfo: AreaInfo;
}

const PersonnelLoad: React.FC<Props> = (props) => {
  const { componentProps = ['person', 'department', 'company'], currentAreaInfo } = props;
  const [activeKey, setActiveKey] = useState<string>('person');
  const history = useHistory();
  const tabData = [
    {
      id: 'person',
      name: '员工',
      value: '1',
      title: '员工负荷',
    },
    {
      id: 'department',
      name: '部组',
      value: '2',
      title: '部组负荷',
    },
    {
      id: 'company',
      name: '公司',
      value: '3',
      title: '公司负荷',
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

  const title = useMemo(() => {
    const dataIndex = tabData.findIndex((item) => item.id === activeKey);
    if (dataIndex > -1) {
      return tabData[dataIndex].title;
    }
    return tabData[0].title;
  }, [activeKey]);

  const { data: burdensData } = useRequest(
    () =>
      getBurdens({
        type: type!,
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
      }),
    {
      ready: !!type,
      refreshDeps: [currentAreaInfo, type],
    },
  );

  const option = useMemo(() => {
    if (!burdensData) return undefined;
    const dataArray = burdensData?.map((item) => item.key);
    const valueArray = burdensData?.map((item) => item.value);
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
        position: function (pt: any) {
          return [pt[0] - 122, pt[1] - 62];
        },
        formatter: function (params: any) {
          const [name] = params;
        //   const test = () => {
        //     history.push('/project-management/all-project');
        //   };
          return `${name.name}<br />
                    项目数量:${name.value}
                    <div>所有项目列表：<span onClick={history.push('/project-management/all-project')}>跳转</span></div>
                    `;
        },
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
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     start: 0,
      //     end: 20,
      //     yAxisIndex: [0, 1],
      //     maxValueSpan: 5
      //   },
      //   {
      //     // show: false,
      //     type: "slider",
      //     borderColor: "#1a8755",
      //     backgroundColor: "#1e3933",
      //     width: 15,
      //     start: 0,
      //     end: 20,
      //     yAxisIndex: [0, 1]
      //   }
      // ]
    };
  }, [JSON.stringify(burdensData)]);

  return (
    <ChartBox title={title}>
      <div className={styles.personnelLoad}>
        <div className={styles.personnelLoadCondition}>
          <div className="flex1"></div>
          <div className={styles.personnelLoadTab}>
            <ChartTab
              onChange={(value) => setActiveKey(value)}
              data={showTabData}
              defaultValue={activeKey}
            />
          </div>
        </div>
        <div className={styles.personnelLoadChart}>
          {type && option && <BarChart options={option} />}
        </div>
      </div>
    </ChartBox>
  );
};

export default PersonnelLoad;
