import React from 'react';
import ProcessTable from '../process-table';
import RateComponent from '../rate-component';
import styles from './index.less';

const ComprehensiveProcessComponent: React.FC = () => {
  const tableColumns = [
    {
      title: '序号',
      width: 60,
      dataIndex: 'index',
      index: 'index',
      render: (text: any, record: any) => {
        if(!record.empty) {
          return `${record.index}`;
        }
      }
    },
    {
      title: '设计院',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true
    },
    {
      title: '项目数',
      dataIndex: 'projectQty',
      index: 'projectQty',
      width: 80,
    },
    {
      title: '勘察率',
      dataIndex: 'surveyRate',
      index: 'surveyRate',
      width: 80,
      render: (text: any, record: any) => {
        if(!record.empty) {
          return `${record.surveyRate}%`;
        }
      }
    },
    {
      title: '综合进度',
      dataIndex: 'value',
      index: 'value',
      width: 340,
      render: (text: any, record: any) => {
        if(!record.empty) {
          return (
            <RateComponent rate={record.value} />
          )
        }
      }
    },
  ];

  return (
    <div className={styles.comprehensiveProcessComponent}>
      <ProcessTable columns={tableColumns} url="/ProjectStatistics/GetProgressRateByCompany" />
    </div>
  );
};

export default ComprehensiveProcessComponent;
