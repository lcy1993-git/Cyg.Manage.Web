import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

// import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

interface InventoryTableParams {
  inventoryId: string;
  versionNo?: string;
  invName?: string;
}

const InventoryTable: React.FC<InventoryTableParams> = (props) => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [companyWord, setCompanyWord] = useState<string>('');

  const { inventoryId, invName, versionNo } = props;

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="搜索" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="物料编号/物料描述"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="" width="230px">
          <Search
            value={companyWord}
            onChange={(e) => setCompanyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="需求公司"
          />
        </TableSearch>
      </div>
    );
  };

  // 列表刷新
  // const refresh = () => {
  //   if (tableRef && tableRef.current) {
  //     // @ts-ignore
  //     tableRef.current.refresh();
  //   }
  // };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  useEffect(() => {
    if (inventoryId) {
      search();
    }
  }, [inventoryId]);

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
    {
      dataIndex: 'specificationsId',
      index: 'specificationsId',
      title: '技术规范ID',
      width: 180,
    },

    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '物料编号',
      width: 180,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '物料描述',
      width: 500,
    },
    {
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      title: '订单净价',
      width: 180,
    },
    {
      dataIndex: 'priceUnit',
      index: 'priceUnit',
      title: '价格单位',
      width: 160,
    },
    {
      dataIndex: 'area',
      index: 'area',
      title: '区域',
      width: 160,
    },
    {
      dataIndex: 'demandCompany',
      index: 'demandCompany',
      title: '需求公司',
      width: 480,
    },
    {
      dataIndex: 'targetNumber',
      index: 'targetNumber',
      title: '目标数量',
      width: 120,
    },
    {
      dataIndex: 'measurementUnit',
      index: 'measurementUnit',
      title: '计量单位',
      width: 160,
    },
    {
      dataIndex: 'taxCode',
      index: 'taxCode',
      title: '税码',
      width: 120,
    },
    {
      dataIndex: 'documentDateText',
      index: 'documentDateText',
      title: '凭证日期',
      width: 260,
    },
    {
      dataIndex: 'effectiveStartDateText',
      index: 'effectiveStartDateText',
      title: '有效起始日期',
      width: 260,
    },
    {
      dataIndex: 'effectiveEndDateText',
      index: 'effectiveEndDateText',
      title: '有效截止日期',
      width: 260,
    },
    {
      dataIndex: 'biddingBatchNum',
      index: 'biddingBatchNum',
      title: '招标采购批次编号',
      width: 220,
    },
    {
      dataIndex: 'gradeNum',
      index: 'gradeNum',
      title: '标号',
      width: 160,
    },
    {
      dataIndex: 'packageNum',
      index: 'packageNum',
      title: '包号',
      width: 160,
    },
    {
      dataIndex: 'lawContractNum',
      index: 'lawContractNum',
      title: '经法合同号',
      width: 200,
    },
    {
      dataIndex: 'contractIdentification',
      index: 'contractIdentification',
      title: '合同标识(电子商务)',
      width: 260,
    },
    {
      dataIndex: 'specialRemark',
      index: 'specialRemark',
      title: '特殊物料备注',
      width: 200,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '大类描述',
      width: 160,
    },
    {
      dataIndex: 'division',
      index: 'division',
      title: '中类描述',
      width: 160,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '小类描述',
      width: 160,
    },
    {
      dataIndex: 'group',
      index: 'group',
      title: '物料组',
      width: 160,
    },
  ];

  const titleSlotElement = () => {
    return <div style={{ paddingTop: '2px', fontSize: '13px' }}>{` -${invName}_${versionNo}`}</div>;
  };

  return (
    <GeneralTable
      defaultPageSize={20}
      size="middle"
      scroll={{ x: 3000, y: 524 }}
      ref={tableRef}
      titleSlot={titleSlotElement}
      buttonLeftContentSlot={searchComponent}
      needCommonButton={true}
      columns={columns}
      requestSource="resource"
      url="/Inventory/GetPageList"
      tableTitle="协议库存列表"
      type="radio"
      extractParams={{
        inventoryOverviewId: inventoryId,
        demandCompany: companyWord,
        keyWord: searchKeyWord,
      }}
    />
  );
};

export default InventoryTable;
