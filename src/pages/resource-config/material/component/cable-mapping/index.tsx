import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useRef, useState } from 'react';

interface WareHouseDetailParams {
  libId: string;
  materialIds?: string[];
}

const { Search } = Input;

const CableMapping: React.FC<WareHouseDetailParams> = (props) => {
  const { libId, materialIds } = props;

  const tableRef = useRef<HTMLDivElement>(null);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const columns = [
    {
      title: '电缆物料编码',
      dataIndex: 'lineMaterialID',
      index: 'lineMaterialID',
      width: 200,
    },
    {
      title: '物料名称',
      dataIndex: 'lineMaterialName',
      index: 'lineMaterialName',
      width: 220,
    },
    {
      title: '规格型号',
      dataIndex: 'lineMaterialSpec',
      index: 'lineMaterialSpec',
      width: 220,
    },
    {
      title: '电缆终端物料编码',
      dataIndex: 'headMaterialID',
      index: 'headMaterialID',
      width: 220,
    },
    {
      title: '物料名称',
      dataIndex: 'headMaterialName',
      index: 'headMaterialName',
      width: 240,
    },
    {
      title: '规格型号',
      dataIndex: 'headMaterialSpec',
      index: 'headMaterialSpec',
      width: 240,
    },
    {
      title: '是否可下户',
      dataIndex: 'isOutDoors',
      index: 'isOutDoors',
      width: 180,
    },
  ];

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search();
    }
  };

  const tableLeftSlot = (
    <TableSearch label="关键词" width="230px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="物料编码/名称/型号"
        allowClear
      />
    </TableSearch>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        ref={tableRef}
        url="/Material/GetCableHeadMapList"
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

export default CableMapping;
