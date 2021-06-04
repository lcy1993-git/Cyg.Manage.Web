import { Dispatch, SetStateAction } from 'react';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useState } from 'react';

import styles from './index.less';
const { Search } = Input;

interface Props {
  catalogueId: string;
  scrolly: number;
  setResourceItem: Dispatch<SetStateAction<any>>;
  url: string;
  rowKey: any;
}

interface RouteListItem {
  name: string;
  id: string;
}

const columns = [
  {
    dataIndex: 'id',
    index: 'id',
    title: '定额编号',
    width: 180,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.id
    }
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '定额名称',
    width: 460,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.name
    }
  },
  {
    dataIndex: 'unit',
    index: 'unit',
    title: '单位',
    width: 60,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.unit
    }
  },
  {
    dataIndex: 'basePrice',
    index: 'basePrice',
    title: '基价(元)',
    width: 100,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.basePrice
    }
  },
  {
    dataIndex: 'laborCost',
    index: 'laborCost',
    title: '人工费(元)',
    width: 120,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.laborCost
    }
  },
  {
    dataIndex: 'materialCost',
    index: 'materialCost',
    title: '材料费(元)',
    width: 120,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.materialCost
    }
  },
  {
    dataIndex: 'machineryCost',
    index: 'machineryCost',
    title: '机械费(元)',
    width: 120,
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.machineryCost
    }
  },
  {
    dataIndex: 'scaffoldType',
    index: 'scaffoldType',
    title: '脚手架',
    ellipsis: true,
    render(v: any, record: any){
      return record?.quotaItem?.scaffoldType
    }
  },
];

const QuotaLibrary: React.FC<Props> = ({catalogueId, scrolly, setResourceItem, url, rowKey}) => {

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');




  const searchComponent = () => {
    return (
      <TableSearch label="搜索" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="键名"
        />
      </TableSearch>
    );
  };

  const tableSearchEvent = () => {
    search();
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const tableSelectEvent = (data: any) => {    
    setResourceItem(Array.isArray(data) ? data[0] : {});
  };

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        rowKey={rowKey}
        needCommonButton={false}
        columns={columns}
        noPaging={false}
        requestSource="tecEco"
        url={url}
        // tableTitle="定额库管理"
        getSelectData={tableSelectEvent}
        type="radio"
        scroll={{y: scrolly}}
        extractParams={{
          keyWord: searchKeyWord,
          id: catalogueId
        }}
        cruxKey="quotaItem"
        requestConditions={catalogueId}
      />
    </>
  );
};

export default QuotaLibrary;
