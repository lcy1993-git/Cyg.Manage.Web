import React, { Key, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import { useSize } from 'ahooks';
import { Table, Input, DatePicker, Space, Button } from 'antd';
import { DeleteOutlined, DownloadOutlined, SortAscendingOutlined } from '@ant-design/icons/lib/icons';
const { Search } = Input;
import { optionConfig } from '@/pages/adminIndex/report/child/reportDetail/optionCofig';
import {Moment} from "moment";
interface Props {
  options: string | Key;
  title: string;
}

const ReportDetail: React.FC<Props> = (props) => {
  const { options,title } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<{ tab: string; key: string }[]>([]);
  const [optionData, setOptionData] = useState<object>({});
  const [active, setActive] = useState<string>('1');
  const chartSize = useSize(chartRef);
  let myChart: any = null;
  const columns = [
    {
      title: '时间',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '端口',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '设备IP',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '事件结果',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '用户名',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '事件ID ',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const initChart = () => {
    if (chartRef && chartRef.current) {
      myChart = echarts.init((chartRef.current as unknown) as HTMLDivElement);
      myChart.setOption(optionData,true);
    }
  };
  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize();
      }, 100);
    }
  };
  const onSearch = (val:string) => {
  };
  const onChange = (val:Moment) => {
  };
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!chartRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize);
        return;
      } else {
        resize();
      }
    });
    window.removeEventListener('resize', resize);
  });
  useEffect(() => {
    if (!!options) {
      setTabs(optionConfig[options]);
      setActive(optionConfig[options][0].key)
    }
  }, [JSON.stringify(chartSize),options]);
  useEffect(()=>{
    if (options === undefined) return
    let res = optionConfig[options].find((item: { key: string; })=> item.key === active)
    if (!!res && res?.options){
      setOptionData(res.options)
    }
  },[active,options])
  useEffect(()=>{
    initChart()
  },[optionData])
  return (
    <div className={styles.reportDetailBox}>
      <div className={styles.reportDetailTitle}>
        <div className={styles.leftSideTitleBorder}>{title}</div>
      </div>
      <div className={styles.reportDetailBg}>
        <div className={styles.reportTabs}>
          {tabs.map((item) => {
            return (
              <div
                className={styles.reportTabsItemTitle}
                style={{ background: active === item.key ? '#fff' : '' }}
                onClick={() => setActive(item.key)}
              >
                <p style={{ color: active === item.key ? '#1F1F1F' : '#696969' }}>{item.tab}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.exportButton}>
          <Button icon={<DownloadOutlined />} type={'primary'}>导出</Button>
        </div>
        <div className={styles.chartBox}>
         <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.tableBox}>
          <div className={styles.tableBoxTool}>
            <Search
              placeholder="请输入用户名或事件ID进行查询"
              style={{ width: '300px' }}
              onSearch={onSearch}
              enterButton
            />
            <div>
              <Space>
                <DatePicker onChange={onChange} />
                <Button icon={<DeleteOutlined />}>删除</Button>
                <Button icon={<SortAscendingOutlined />}>排序</Button>
              </Space>
            </div>
          </div>
          <Table
            columns={columns}
            rowSelection={{
              type: 'checkbox',
              onChange:(vals)=>{
                console.log(vals)
              }
            }}
            bordered
            pagination={false}
            size={'small'}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
