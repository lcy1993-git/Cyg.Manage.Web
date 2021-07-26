import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

// import UrlSelect from '@/components/url-select';
import { ImportOutlined } from '@ant-design/icons';
import ImportInventory from './components/import-form';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import InventoryTable from './components/inventory-table';
import HasMapModal from './components/has-map-modal';
import moment from 'moment';

const { Search } = Input;

// interface SelectParams {
//   value: string | number;
//   label: string;
// }

const Inventroy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [inventoryId, setInventoryId] = useState<string>('');
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false);

  const [inventoryTableModalVisible, setInventoryTableModalVisible] = useState<boolean>(false);
  const [hasMapModalVisible, setHasMapModalVisible] = useState<boolean>(false);

  const [versionNo, setVersionNo] = useState<string>('');
  const [invName, setInvName] = useState<string>('');

  // const [nowSelectedInv, setNowSelectedInv] = useState<string>('');
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  // const { data: inventoryData = [], loading } = useRequest(() => getInventoryOverviewList());

  // const handleInvData = useMemo(() => {
  //   return inventoryData.map((item) => {
  //     return {
  //       value: item.id,
  //       title:
  //         item.name === item.version
  //           ? `${item.provinceName}_${item.resourceLibName}_${item.year}_${item.name}`
  //           : `${item.name}_${item.version}`,
  //     };
  //   });
  // }, [JSON.stringify(inventoryData)]);

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="协议库存" width="278px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入协议库存信息"
          />
        </TableSearch>
      </div>
    );
  };

  //选择协议库存传InvId
  // const searchByInv = (value: any) => {
  //   const currentVal = handleInvData.filter((item: any) => {
  //     if (value === item.value) {
  //       return item.title;
  //     }
  //   });

  //   setNowSelectedInv(currentVal[0]?.title);

  //   setInventoryId(value);
  //   if (tableRef && tableRef.current) {
  //     // @ts-ignore
  //     tableRef.current.searchByParams({
  //       inventoryOverviewId: value,
  //       demandCompany: searchKeyWord,
  //       keyWord: searchKeyWord,
  //     });
  //   }
  // };

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

  // const date =[
  //   {
  //     dataIndex: 'version',
  //     index: 'version',
  //     title: '版本号',
  //     width: 180,
  //   },
  //   {
  //     dataIndex: 'versionName',
  //     index: 'versionName',
  //     title: '版本名称',
  //     width: 180,
  //   },
  //   {
  //     dataIndex: 'supplier',
  //     index: 'supplier',
  //     title: '供应商',
  //     width: 400,
  //   },
  //   {
  //     dataIndex: 'isEnd0702',
  //     index: 'isEnd0702',
  //     title: '是否终止0702',
  //     width: 220,
  //   },
  //   {
  //     dataIndex: 'specialClass',
  //     index: 'specialClass',
  //     title: '特殊类',
  //     width: 140,
  //   },
  //   {
  //     dataIndex: 'presentation',
  //     index: 'presentation',
  //     title: '提报要求',
  //     width: 180,
  //   },
  //   {
  //     dataIndex: 'specificationsId',
  //     index: 'specificationsId',
  //     title: '技术规范ID',
  //     width: 180,
  //   },

  //   {
  //     dataIndex: 'materialCode',
  //     index: 'materialCode',
  //     title: '物料编号',
  //     width: 180,
  //   },
  //   {
  //     dataIndex: 'materialName',
  //     index: 'materialName',
  //     title: '物料描述',
  //     width: 500,
  //   },
  //   {
  //     dataIndex: 'orderPrice',
  //     index: 'orderPrice',
  //     title: '订单净价',
  //     width: 180,
  //   },
  //   {
  //     dataIndex: 'priceUnit',
  //     index: 'priceUnit',
  //     title: '价格单位',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'area',
  //     index: 'area',
  //     title: '区域',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'demandCompany',
  //     index: 'demandCompany',
  //     title: '需求公司',
  //     width: 480,
  //   },
  //   {
  //     dataIndex: 'targetNumber',
  //     index: 'targetNumber',
  //     title: '目标数量',
  //     width: 120,
  //   },
  //   {
  //     dataIndex: 'measurementUnit',
  //     index: 'measurementUnit',
  //     title: '计量单位',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'taxCode',
  //     index: 'taxCode',
  //     title: '税码',
  //     width: 120,
  //   },
  //   {
  //     dataIndex: 'documentDateText',
  //     index: 'documentDateText',
  //     title: '凭证日期',
  //     width: 260,
  //   },
  //   {
  //     dataIndex: 'effectiveStartDateText',
  //     index: 'effectiveStartDateText',
  //     title: '有效起始日期',
  //     width: 260,
  //   },
  //   {
  //     dataIndex: 'effectiveEndDateText',
  //     index: 'effectiveEndDateText',
  //     title: '有效截止日期',
  //     width: 260,
  //   },
  //   {
  //     dataIndex: 'biddingBatchNum',
  //     index: 'biddingBatchNum',
  //     title: '招标采购批次编号',
  //     width: 220,
  //   },
  //   {
  //     dataIndex: 'gradeNum',
  //     index: 'gradeNum',
  //     title: '标号',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'packageNum',
  //     index: 'packageNum',
  //     title: '包号',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'lawContractNum',
  //     index: 'lawContractNum',
  //     title: '经法合同号',
  //     width: 200,
  //   },
  //   {
  //     dataIndex: 'contractIdentification',
  //     index: 'contractIdentification',
  //     title: '合同标识(电子商务)',
  //     width: 260,
  //   },
  //   {
  //     dataIndex: 'specialRemark',
  //     index: 'specialRemark',
  //     title: '特殊物料备注',
  //     width: 200,
  //   },
  //   {
  //     dataIndex: 'category',
  //     index: 'category',
  //     title: '大类描述',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'division',
  //     index: 'division',
  //     title: '中类描述',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'type',
  //     index: 'type',
  //     title: '小类描述',
  //     width: 160,
  //   },
  //   {
  //     dataIndex: 'group',
  //     index: 'group',
  //     title: '物料组',
  //     width: 160,
  //   },
  // ]

  const columns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 280,
    },
    {
      dataIndex: 'province',
      index: 'province',
      title: '区域',
      width: 180,
      render: (text: any, record: any) => {
        return record.provinceName;
      },
    },
    {
      dataIndex: 'creator',
      index: 'creator',
      title: '创建人',
      width: 320,
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 180,
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
  ];

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('inventory-create') && (
          <Button className="mr7" type="primary" onClick={() => importInventoryEvent()}>
            <ImportOutlined />
            新建
          </Button>
        )}
        {buttonJurisdictionArray?.includes('inventory-check') && (
          <Button className={styles.importBtn} onClick={() => checkInventoryEvent()}>
            查看
          </Button>
        )}

        {buttonJurisdictionArray?.includes('inventory-mapping-manage') && (
          <Button className={styles.importBtn} onClick={() => openMapManageEvent()}>
            映射管理
          </Button>
        )}
      </div>
    );
  };

  //创建映射
  const openMapManageEvent = () => {
    setHasMapModalVisible(true);
  };

  //导入
  const importInventoryEvent = () => {
    setImportFormVisible(true);
  };

  const uploadFinishEvent = () => {
    refresh();
  };

  //查看协议库存
  const checkInventoryEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.info('请先选择协议库存');
      return;
    }
    setVersionNo(tableSelectRows[0].version);
    setInvName(tableSelectRows[0].name);
    setInventoryId(tableSelectRows[0].id);
    setInventoryTableModalVisible(true);
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetInventoryOverviewPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="协议库存管理"
        type="radio"
        extractParams={{
          inventoryOverviewId: inventoryId,
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        width="98%"
        bodyStyle={{ height: '790px', overflowY: 'auto' }}
        visible={inventoryTableModalVisible}
        footer=""
        centered
        onCancel={() => setInventoryTableModalVisible(false)}
      >
        <InventoryTable inventoryId={inventoryId} versionNo={versionNo} invName={invName} />
      </Modal>

      <Modal
        maskClosable={false}
        width="80%"
        title="关联映射管理"
        bodyStyle={{ height: 'auto', overflowY: 'auto' }}
        visible={hasMapModalVisible}
        footer=""
        onCancel={() => setHasMapModalVisible(false)}
      >
        <HasMapModal />
      </Modal>
      {/* 
      {addMapVisible && (
        <CreateMap
          visible={addMapVisible}
          inventoryOverviewId={inventoryId}
          onChange={setAddMapVisible}
        />
      )} */}
      {importFormVisible && (
        <ImportInventory
          requestSource="resource"
          visible={importFormVisible}
          changeFinishEvent={() => uploadFinishEvent()}
          onChange={setImportFormVisible}
        />
      )}
    </PageCommonWrap>
  );
};

export default Inventroy;
