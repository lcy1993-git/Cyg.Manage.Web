import { LeftOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useProjectAllAreaStatisticsStore } from '../../store';
import TitleWindow from '../title-window';
import CompanyTable from './components/company-table';
import ProjectTable from './components/project-table';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';

import styles from './index.less';
import { useGetSelectData } from '@/utils/hooks';

const CompanyAndProjectTable: React.FC = () => {
  const {
    dataType,
    companyInfo,
    projectShareCompanyId,
    setDataType,
    setCompanyInfo,
    setProjectShareCompanyId,
  } = useProjectAllAreaStatisticsStore();
  const { companyId = '' } = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
  const { data: companyData = [] } = useGetSelectData({
    url: '/ProjectStatistics/GetCompanyList',
  });

  const handleCompanyData = useMemo(() => {
    if (companyData) {
      return companyData.map((item: any) => {
        if (item.value === companyId) {
          return { label: '我的公司', value: item.value };
        }
        return item;
      });
    }
    return;
  }, [companyData]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId);

  useEffect(() => {
    setProjectShareCompanyId(companyId);
  }, [selectedCompanyId]);

  const returnToCompanyType = () => {
    setCompanyInfo({
      companyId: '',
      companyName: '',
    });
    setProjectShareCompanyId(projectShareCompanyId);
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
          defaultData={handleCompanyData}
          titlekey="label"
          valuekey="value"
          placeholder="请选择"
          defaultValue={companyId}
          onChange={(value: any) => {
            dataType === 'project' ? returnToCompanyType() : '';
            // setSelectedCompanyId(value);
            setProjectShareCompanyId(value);
          }}
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
