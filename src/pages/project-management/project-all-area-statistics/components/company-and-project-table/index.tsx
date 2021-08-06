import React from 'react';
import TitleWindow from '../title-window';
import CompanyTable from './components/company-table';

import styles from './index.less';

const CompanyAndProjectTable: React.FC = () => {
  return (
    <div className={styles.companyAndProjectTable}>
      <TitleWindow title="综合进度">
        <CompanyTable />
      </TitleWindow>
    </div>
  );
};

export default CompanyAndProjectTable;
