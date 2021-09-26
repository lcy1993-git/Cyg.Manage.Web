import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useRef, useState } from 'react';

interface WareHouseDetailParams {
  overviewId: string;
}

const { Search } = Input;

const WareHouseDetail: React.FC<WareHouseDetailParams> = (props) => {
  const { overviewId } = props;

  const tableRef = useRef<HTMLDivElement>(null);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      index: 'id',
      width: 200,
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      index: 'companyName',
      width: 380,
    },
    {
      title: '物料编号',
      dataIndex: 'materialCode',
      index: 'materialCode',
      width: 220,
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      index: 'materialName',
      width: 220,
    },
    {
      title: '可用数量',
      dataIndex: 'number',
      index: 'number',
      width: 150,
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 120,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      index: 'unitPrice',
      width: 150,
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      index: 'totalPrice',
      width: 150,
    },
    {
      title: '批次',
      dataIndex: 'batchNum',
      index: 'batchNum',
      width: 150,
    },
    {
      title: '是否可利用',
      dataIndex: 'isUsed',
      index: 'isUsed',
      width: 150,
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
    <TableSearch width="230px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="关键词"
      />
    </TableSearch>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        ref={tableRef}
        url="/WareHouse/GetMaterialPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        tableTitle="查看利库物料"
        extractParams={{
          overviewID: overviewId,
          keyWord: searchKeyWord,
        }}
      />
    </div>
  );
};

export default WareHouseDetail;
