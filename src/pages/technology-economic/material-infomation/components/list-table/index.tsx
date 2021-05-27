import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined, AccountBookOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Switch, Form, Popconfirm, message } from 'antd';
import React, { useState, useMemo, useCallback, useReducer } from 'react';
// import DictionaryForm from '../add-edit-form';
// import QuotaDetails from '../quota-details';


import { useRequest } from 'ahooks';
import {
  getDictionaryDetail,
  addDictionaryItem,
  updateDictionaryItemStatus,
  updateDictionaryItem,
  deleteDictionaryItem,
} from '@/services/system-config/dictyionary-manage';
import { isArray } from 'lodash';
import styles from './index.less';
const { Search } = Input;

interface RouteListItem {
  name: string;
  id: string;
}

interface State {
  routeList: RouteListItem[];
}

// const reducer = (state: State, action: any) => {
//   switch (action.code) {
//     case 'add':
//       return { routeList: [...state.routeList, { id: action.id, name: action.name }] };
//     case 'edit':
//       const routeList = [...state.routeList];
//       const currentDataIndex = routeList.findIndex((item) => item.id === action.id);
//       if (currentDataIndex !== routeList.length) {
//         routeList.splice(currentDataIndex + 1, routeList.length);
//       }
//       return { routeList: routeList };
//     default:
//       throw new Error('传入值不对');
//   }
// };

const columns = [
  {
    dataIndex: 'id',
    index: 'id',
    title: '编号',
    width: 120,
    // render: (text: string, record: any) => {
    //   return (
    //     <span
    //       className={styles.dictionaryKeyCell}
    //       onClick={() => keyCellClickEvent(record.id, record.key)}
    //     >
    //       {record.key}
    //     </span>
    //   );
    // },
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '名称',
    width: 360,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '类型',
    width: 180,
  },
  {
    dataIndex: 'releaseDate',
    index: 'releaseDate',
    title: '发行日期',
    width: 80,
  },
  {
    dataIndex: 'remark',
    index: 'remark',
    title: '描述',
  },
];

const QuotaLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [selectIds, setSelectIds] = useState<string[]>([]);

  const { data1, run } = useRequest(getDictionaryDetail, {
    manual: true,
  });

  const tableData = [
    {
      calculation: 0,
      catalogueId: "1369223437942743044",
      content: null,
      id: "1369223437951131650",
      laborCost: 0,
      libId: "1357588635508068352",
      machineryFee: 0,
      materialFee: 0,
      name: "人工施工土方 挖土方 坚土 深2m以内",
      price: 13.56,
      quotaId: "PT1-4",
      unit: "m³",
      valence: 13.56,
    },
    {
      calculation: 0,
      catalogueId: "1369223437942743044",
      content: null,
      id: "1369223437951131651",
      laborCost: 0,
      libId: "1357588635508068352",
      machineryFee: 0,
      materialFee: 0,
      name: "222",
      price: 13.56,
      quotaId: "PT1-4",
      unit: "m³",
      valence: 13.56,
    },
  ];

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

  // const searchByParams = (params: object) => {
  //   if (tableRef && tableRef.current) {
  //     // @ts-ignore
  //     tableRef.current.searchByParams(params);
  //   }
  // };

  const tableSelectEvent = (data: any) => {
    setTableSelectRow(data);
    setSelectIds(data.map((item: any) => item.id));
  };

  return (
    <>
      <GeneralTable
        ref={tableRef}
        hasFooter={false}
        // titleSlot={titleSlotElement}
        buttonLeftContentSlot={searchComponent}
        // buttonRightContentSlot={tableElement}
        needCommonButton={false}
        columns={columns}
        url="/Dictionary/GetPagedList"
        // tableTitle="定额库管理"
        getSelectData={tableSelectEvent}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
    </>
  );
};

export default QuotaLibrary;
