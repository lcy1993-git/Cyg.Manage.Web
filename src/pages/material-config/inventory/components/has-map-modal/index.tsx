import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, Modal, Form, message, Spin } from 'antd';
import React, { useState, useMemo } from 'react';
import styles from './index.less';

import { useRequest } from 'ahooks';
import { getInventoryOverviewList } from '@/services/material-config/inventory';
// import UrlSelect from '@/components/url-select';

import { ImportOutlined } from '@ant-design/icons';

import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

// interface HasMapModalParams {
//   inventoryId: string;
//   versionNo?: string;
//   invName?: string;
// }

const HasMapModal: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [companyWord, setCompanyWord] = useState<string>('');

  //   const { inventoryId, invName, versionNo } = props;

//   const searchComponent = () => {
//     return (
//       <div className={styles.searchArea}>
//         <TableSearch label="搜索" width="230px">
//           <Search
//             value={searchKeyWord}
//             onChange={(e) => setSearchKeyWord(e.target.value)}
//             onSearch={() => search()}
//             enterButton
//             placeholder="物料编号/物料描述"
//           />
//         </TableSearch>
//         <TableSearch marginLeft="20px" label="" width="230px">
//           <Search
//             value={companyWord}
//             onChange={(e) => setCompanyWord(e.target.value)}
//             onSearch={() => search()}
//             enterButton
//             placeholder="需求公司"
//           />
//         </TableSearch>
//       </div>
//     );
//   };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const columns = [
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本号',
      width: 180,
    },
    {
      dataIndex: 'versionName',
      index: 'versionName',
      title: '版本名称',
      width: 180,
    },
    {
      dataIndex: 'supplier',
      index: 'supplier',
      title: '供应商',
      width: 400,
    },
    {
      dataIndex: 'isEnd0702',
      index: 'isEnd0702',
      title: '是否终止0702',
      width: 220,
    },
    {
      dataIndex: 'specialClass',
      index: 'specialClass',
      title: '特殊类',
      width: 140,
    },
    {
      dataIndex: 'presentation',
      index: 'presentation',
      title: '提报要求',
      width: 180,
    },
  ];

  return (
    <GeneralTable
      ref={tableRef}
    //   buttonLeftContentSlot={searchComponent}
      needCommonButton={true}
      columns={columns}
      requestSource="resource"
      url="/Inventory/GetMappingInventoryOverviewPageList"
      getSelectData={(data) => setTableSelectRow(data)}
      tableTitle="已映射列表"
      type="radio"
      extractParams={{
        keyWord: searchKeyWord,
      }}
    />
  );
};

export default HasMapModal;
