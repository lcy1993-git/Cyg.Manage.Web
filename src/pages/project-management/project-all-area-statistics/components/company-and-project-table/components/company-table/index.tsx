import { useSize } from 'ahooks';
import { Table } from 'antd';
import uuid from 'node-uuid';
import React from 'react';
import { useMemo } from 'react';
import { useRef } from 'react';
import ShowChangeComponent from '../show-change-component';

import styles from './index.less';

interface CompanyTableProps {
  dataSource?: any[];
}

const CompanyTable: React.FC<CompanyTableProps> = (props) => {
  //   const { dataSource = [] } = props;
  const dataSource = [
    {
      name: '成都深瑞同华软件有限公司',
      waitArrange: 10,
      addArrange: 0,
      waitSurvey: 12,
      addSurvey: 5,
      surveing: 10,
      addSurveing: -5,
      designing: 10,
      addDesigning: 5,
      hasDesigning: 5,
      addHasDesigning: 10,
      total: 100,
      addTotal: 10,
      rate: 60,
      controlTime: '2021-07-30',
    },
    {
      name: '成都深瑞同华软件有限公司',
      waitArrange: 10,
      addArrange: 5,
      waitSurvey: 12,
      addSurvey: 5,
      surveing: 10,
      addSurveing: -5,
      designing: 10,
      addDesigning: 5,
      hasDesigning: 5,
      addHasDesigning: 10,
      total: 100,
      addTotal: 10,
      rate: 60,
      controlTime: '2021-07-30',
    },
  ];
  const tableColumns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      ellipsis: true,
      render: (text: string, record: any) => {
        return <span className="canClick">{record.name}</span>;
      },
    },
    {
      title: '待安排(较昨日变化)',
      dataIndex: 'waitArrange',
      index: 'waitArrange',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent changeNumber={record.addArrange}>
            {record.waitArrange}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '未勘察(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '勘察中(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '已勘察(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '设计中(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '已设计(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '合计(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '综合进度(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
    {
      title: '最近操作时间',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
    },
  ];
  const contentRef = useRef<HTMLDivElement>(null);
  const contentSize = useSize(contentRef);

  const currentPageSize = useMemo(() => {
    if (!contentSize.height) return 0;
    return Math.floor(contentSize.height / 38) - 2;
  }, [contentSize.height]);

  // 拿到数据，如果不满当前高度，就设置很多空数据进去。让总计到最后
  const handleTheShowData = (data: any[]) => {
    // 需要补充空数据
    if (data && data.length > 0 && data.length < currentPageSize) {
      let handleDataSource = [...data];

      if (handleDataSource.length < currentPageSize) {
        const copyObject = { ...handleDataSource[0] };
        const emptyObject = { empty: true };
        Object.keys(copyObject).forEach((item) => {
          emptyObject[item] = '';
        });
        const emptyObjectArray = new Array(currentPageSize - handleDataSource.length).fill(
          emptyObject,
        );

        handleDataSource = [...data, ...emptyObjectArray];
      }

      const afterHanldeItems = handleDataSource.map((item) => {
        return {
          ...item,
          key: uuid.v1(),
        };
      });
      return afterHanldeItems;
    }
    return dataSource;
  };

  const finallyShowData = useMemo(() => {
    return handleTheShowData(dataSource)
  },[dataSource,currentPageSize])

  return (
    <div className={styles.companyTable} ref={contentRef}>
      <Table bordered={true} columns={tableColumns} pagination={false} dataSource={finallyShowData} />
    </div>
  );
};

export default CompanyTable;
