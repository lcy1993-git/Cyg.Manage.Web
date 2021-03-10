import React, { useRef, useState } from 'react';
import GeneralTable from '@/components/general-table';

import PageCommonWrap from '@/components/page-common-wrap';

interface DifferTableParams {
  categoryId: string;
}

const DifferTable: React.FC<DifferTableParams> = (props) => {
  const { categoryId } = props;
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);

  const columns = [
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
    <GeneralTable
      ref={tableRef}
      needCommonButton={true}
      columns={columns}
      requestSource="resource"
      url="/SourceCompare/GetCompareCategoryPageList"
      tableTitle="差异明细"
      type="radio"
      getSelectData={(data) => setTableSelectRow(data)}
      extractParams={{
        categoryId: categoryId,
      }}
    />
  );
};

export default DifferTable;
