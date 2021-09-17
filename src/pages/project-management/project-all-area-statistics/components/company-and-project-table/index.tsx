import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
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
      <TableSearch width="320px" label="我的公司" paddingTop="20px" marginLeft="20px">
        <UrlSelect
          style={{ width: '240px', marginLeft: '15px' }}
          showSearch
          url="/CompanyShare/GetList"
          titlekey="text"
          valuekey="value"
          placeholder="请选择"
          extraParams={{ companyId: companyId }}
          // onChange={(value: any) => searchBySelectProvince(value)}
        />
      </TableSearch>
      <TitleWindow title={getTitle}>
        {dataType === 'company' && <CompanyTable />}
        {dataType === 'project' && <ProjectTable />}
      </TitleWindow>
    </div>
  );
};

export default CompanyAndProjectTable;
