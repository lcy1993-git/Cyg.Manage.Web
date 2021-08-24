import React, { useRef } from 'react';
import TreeTable from '@/components/tree-table/index';

import PageCommonWrap from '@/components/page-common-wrap';

const CompanyManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  const companyTableColumns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      width: 320,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      index: 'phone',
      width: 180,
    },
    {
      title: '联系邮箱',
      dataIndex: 'email',
      index: 'email',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      index: 'address',
    },
  ];

  return (
    <PageCommonWrap>
      <TreeTable
        ref={tableRef}
        tableTitle="协作单位"
        columns={companyTableColumns}
        url="/Company/GetSubordinateTreeList"
      />
    </PageCommonWrap>
  );
};

export default CompanyManage;
