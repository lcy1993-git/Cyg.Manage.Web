import { LeftOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useProjectAllAreaStatisticsStore } from '../../store';
import TitleWindow from '../title-window';
import CompanyTable from './components/company-table';
import ProjectTable from './components/project-table';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';

import styles from './index.less';

const CompanyAndProjectTable: React.FC = () => {
  const { dataType, companyInfo, setDataType, setCompanyInfo } = useProjectAllAreaStatisticsStore();
  const { companyId = '' } = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId);

  console.log();

  const returnToCompanyType = () => {
    setCompanyInfo({
      companyId: '',
      companyName: '',
    });
    setDataType('company');
  };

  const getTitle = () => {
    if (dataType === 'company') {
      return <span>综合进度</span>;
    }
    return (
      <span>
        <span className={styles.returnIcon} onClick={() => returnToCompanyType()}>
          <LeftOutlined />
        </span>
        <span>项目进度 - {companyInfo.companyName}</span>
      </span>
    );
  };

  return (
    <div className={styles.companyAndProjectTable}>
      <TableSearch width="320px" paddingTop="20px">
        <UrlSelect
          style={{ width: '240px', marginLeft: '15px' }}
          showSearch
          url="/ProjectStatistics/GetCompanyList"
          titlekey="text"
          valuekey="value"
          placeholder="请选择"
          defaultValue={companyId}
          onChange={(value: any) => setSelectedCompanyId(value)}
        />
      </TableSearch>
      <TitleWindow title={getTitle}>
        {dataType === 'company' && <CompanyTable companyId={selectedCompanyId} />}
        {dataType === 'project' && <ProjectTable companyId={selectedCompanyId} />}
      </TitleWindow>
    </div>
  );
};

export default CompanyAndProjectTable;
