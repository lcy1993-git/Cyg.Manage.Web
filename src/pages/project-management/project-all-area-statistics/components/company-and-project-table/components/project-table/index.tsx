import { useRequest, useSize } from 'ahooks';
import { useProjectAllAreaStatisticsStore } from '@/pages/project-management/project-all-area-statistics/store';
import React from 'react';

import styles from './index.less';
import { getStatisticsListByProject } from '@/services/project-management/project-statistics-v2';
import moment from 'moment';
import RateComponent from '../../../rate-component';
import { useRef } from 'react';
import { useMemo } from 'react';
import uuid from 'node-uuid';
import { Table } from 'antd';
import { isNumber } from 'lodash';

const ProjectTable: React.FC = () => {
  const { companyInfo } = useProjectAllAreaStatisticsStore();

  const { data: dataSource = [], loading } = useRequest(
    () => getStatisticsListByProject(companyInfo.companyId!),
    {
      ready: !!companyInfo.companyId,
    },
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const contentSize = useSize(contentRef);

  const currentPageSize = useMemo(() => {
    if (!contentSize.height) return 0;
    return Math.floor(contentSize.height / 38) - 1;
  }, [contentSize.height]);

  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      index: 'index',
      width: 60,
      ellipsis: true,
      render: (text: string, record: any) => {      
        return <>{record.name && <span>{record.index + 1}</span>}</>;
      },
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      index: 'name',
      ellipsis: true,
      width: 220,
    },
    {
      title: '计划天数',
      dataIndex: 'planDays',
      index: 'planDays',
      ellipsis: true,
      width: 100,
      render: (text: string, record: any) => {
        return <>{record.planDays && <span>{record.planDays}天</span>}</>;
      },
    },
    {
      title: '当前阶段',
      dataIndex: 'statusText',
      index: 'statusText',
      ellipsis: true,
      width: 100,
    },
    {
      title: '项目进度',
      dataIndex: 'progressRate',
      index: 'progressRate',
      ellipsis: true,
      render: (text: string, record: any) => {
        return <>{record.progressRate && <RateComponent rate={record.progressRate} />}</>;
      },
    },
    {
      title: '超期情况',
      dataIndex: 'overdueDays',
      index: 'overdueDays',
      ellipsis: true,
      width: 120,
      render: (text: string, record: any) => {
        if(record.overdueDays && record.overdueDays > 0) {
          return (
            <span>已逾期{record.overdueDays}天</span>
          )
        }
        if(isNumber(record.overdueDays) && record.overdueDays <= 0) {
          return (
            <span>-</span>
          )
        }
        return (
          <span></span>
        );
      },
    },
    {
      title: '最近操作时间',
      dataIndex: 'lastOperationTime',
      index: 'lastOperationTime',
      ellipsis: true,
      width: 100,
      render: (text: string, record: any) => {
        return (
          <>
            {record.lastOperationTime && (
              <span>{moment(record.lastOperationTime).format('YYYY-MM-DD')}</span>
            )}
          </>
        );
      },
    },
  ];

  // 拿到数据，如果不满当前高度，就设置很多空数据进去。
  const handleTheShowData = (data: any[]) => {
    let handleDataSource = [...data];
    // 需要补充空数据
    if (data && data.length > 0 && data.length < currentPageSize) {


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
    }
    return handleDataSource.map((item, index) => {
      return {
        ...item,
        key: uuid.v1(),
        index,
      };
    });
  };

  const finallyShowData = useMemo(() => {
    return {
      data: handleTheShowData(dataSource),
      contentHeight: currentPageSize * 38,
      isOverflow: dataSource && dataSource.length > currentPageSize,
    };
  }, [dataSource, currentPageSize]);

  return (
    <div className={styles.projectTable} ref={contentRef}>
      <Table
        bordered={true}
        columns={tableColumns}
        pagination={false}
        loading={loading}
        dataSource={finallyShowData.data}
        scroll={finallyShowData.isOverflow ? { y: finallyShowData.contentHeight } : undefined}
      />
    </div>
  );
};

export default ProjectTable;
