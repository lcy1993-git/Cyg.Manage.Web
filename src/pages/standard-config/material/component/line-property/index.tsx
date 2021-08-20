import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useRef, useState } from 'react';

interface WareHouseDetailParams {
  libId: string;
  materialIds?: string[];
}

const { Search } = Input;

const LineProperty: React.FC<WareHouseDetailParams> = (props) => {
  const { libId, materialIds } = props;

  const tableRef = useRef<HTMLDivElement>(null);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const columns = [
    {
      title: '物料编码',
      dataIndex: 'materialId',
      index: 'materialId',
      width: 200,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      index: 'materialName',
      width: 220,
    },
    {
      title: '截面积(mm²)',
      dataIndex: 'crossSectionArea',
      index: 'crossSectionArea',
      width: 220,
    },
    {
      title: '是否可下户',
      dataIndex: 'isUsedHousehold',
      index: 'isUsedHousehold',
      width: 220,
      render: (text: any, record: any) => {
        return record.isUsedHousehold === true ? '是' : '否';
      },
    },
  ];

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search();
    }
  };

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  const tableLeftSlot = (
    <TableSearch label="物料" width="248px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="请输入物料编码/名称"
        allowClear
      />
    </TableSearch>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        ref={tableRef}
        url="/Material/GetLinePropertyList"
        columns={columns}
        type="radio"
        requestSource="resource"
        extractParams={{
          libId: libId,
          materialIds: materialIds,
          keyWord: searchKeyWord,
        }}
      />
    </div>
  );
};

export default LineProperty;
