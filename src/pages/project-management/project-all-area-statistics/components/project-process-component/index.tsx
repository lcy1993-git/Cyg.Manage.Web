import React from 'react';
import ProcessTable from '../process-table';
import RateComponent from '../rate-component';
import styles from './index.less';

interface ProjectProcessComponentProps {
  companyId: string
}

const ProjectProcessComponent: React.FC<ProjectProcessComponentProps> = (props) => {
  const {companyId} = props;
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
      title: '项目名称',
      dataIndex: 'name',
      index: 'name',
      ellipsis: true
    },
    {
      title: '设计院',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true
    },
    {
      title: '计划天数',
      dataIndex: 'planDays',
      index: 'planDays',
      width: 100,
      render: (text: any, record: any) => {
        if(!record.empty) {
          return `${record.planDays}天`;
        }
      }
    },
    {
      title: '项目进度',
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
      <ProcessTable columns={tableColumns} extraParams={{companyId}} url="/ProjectStatistics/GetProgressRateByProject" />
    </div>
  );
};

export default ProjectProcessComponent;
