import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { useProjectAllAreaStatisticsStore } from '../../store';
import TitleWindow from '../title-window';
import CompanyTable from './components/company-table';
import ProjectTable from './components/project-table';

import styles from './index.less';

const CompanyAndProjectTable: React.FC = () => {
  const {dataType, companyInfo, setDataType, setCompanyInfo} = useProjectAllAreaStatisticsStore();

  const returnToCompanyType = () => {
    setCompanyInfo({
      companyId: "",
      companyName: ""
    })
    setDataType("company");
  }

  const getTitle = () => {
    if(dataType === 'company') {
      return (
        <span>综合进度</span>
      )
    }
    return (
      <span>
        <span className={styles.returnIcon} onClick={() => returnToCompanyType()}><LeftOutlined /></span>
        <span>项目进度 - {companyInfo.companyName}</span>
      </span>
    )
  }
  return (
    <div className={styles.companyAndProjectTable}>
      <TitleWindow title={getTitle}>
          {
            dataType === 'company' &&
            <CompanyTable />
          }
          {
            dataType === 'project' &&
            <ProjectTable />
          }
      </TitleWindow>
    </div>
  );
};

export default CompanyAndProjectTable;
