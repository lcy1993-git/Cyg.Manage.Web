import React, { useRef } from 'react';
import GeneralTable from '@/components/general-table';

import PageCommonWrap from '@/components/page-common-wrap';

const DifferTable: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  const companyTableColumns = [
    {
      title: '条目',
      dataIndex: 'id',
      index: 'id',
      width: 320,
    },
    {
      title: '资源类型',
      dataIndex: 'sourceTypeText',
      index: 'sourceTypeText',
      width: 180,
    },
    {
      title: '差异类别',
      dataIndex: 'email',
      index: 'email',
    },
    {
      title: '差异名称',
      dataIndex: 'discrepancyName',
      index: 'discrepancyName',
    },
    {
      title: '差异描述',
      dataIndex: 'discrepancyDescribe',
      index: 'discrepancyDescribe',
    },
    {
      title: '之前为',
      dataIndex: 'wasBefore',
      index: 'wasBefore',
    },
    {
      title: '之后为',
      dataIndex: 'wasAfter',
      index: 'wasAfter',
    },
  ];

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        tableTitle="差异明细"
        columns={companyTableColumns}
        url="/Company/GetSubordinateTreeList"
      />
    </PageCommonWrap>
  );
};

export default DifferTable;
