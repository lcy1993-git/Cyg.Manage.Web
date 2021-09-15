import type { Dispatch, SetStateAction } from 'react';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, {useEffect, useState} from 'react';

const { Search } = Input;

interface Props {
  catalogueId: string;
  scrolly: number;
  setResourceItem: Dispatch<SetStateAction<any>>;
  url: string;
  rowKey: any;
  columns: any[];
  requestSource?: "project" | "common" | "resource" | "tecEco" | "tecEco1" | undefined;
  cruxKey?: string | null;
  params?: Record<string, any>
}

const ListTable: React.FC<Props> = ({catalogueId,requestSource = 'tecEco', scrolly, setResourceItem, url,params, rowKey, columns, cruxKey="quotaItem"}) => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const searchComponent = () => {
    return (
      <TableSearch label="搜索" width="300px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="关键字"
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
  useEffect(()=>{
    if (catalogueId){
      search()
    }
  },[catalogueId])
  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        rowKey={rowKey}
        needCommonButton={false}
        columns={columns}
        noPaging={false}
        requestSource={requestSource}
        url={url}
        // tableTitle="定额库管理"
        getSelectData={tableSelectEvent}
        type="radio"
        scroll={{y: scrolly}}
        extractParams={{
          keyWord: searchKeyWord,
          id: catalogueId,
          ...params
        }}
        cruxKey={cruxKey === null ? '' : cruxKey}
        requestConditions={catalogueId}
        // onRow={record=> {
        //   return {
        //     onClick: event => {
        //       // setSelectedRowKeys(record)
        //     }
        //   }
        // }}
      />
    </>
  );
};

export default ListTable;
