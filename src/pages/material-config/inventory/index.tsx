import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, Modal, Form, message, Spin } from 'antd';
import React, { useState, useMemo } from 'react';
import styles from './index.less';

import { useRequest } from 'ahooks';
import { getInventoryOverviewList } from '@/services/material-config/inventory';
import UrlSelect from '@/components/url-select';
import CheckMapping from './components/check-mapping-form';
import CreateMap from './components/create-map';
import { ImportOutlined } from '@ant-design/icons';
import ImportInventory from './components/import-form';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

// interface SelectParams {
//   value: string | number;
//   label: string;
// }

const Inventroy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [inventoryId, setInventoryId] = useState<string>('');
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [companyWord, setCompanyWord] = useState<string>('');
  const [checkMappingVisible, setCheckMappingVisible] = useState<boolean>(false);
  const [addMapVisible, setAddMapVisible] = useState<boolean>(false);
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false);

  const [nowSelectedInv, setNowSelectedInv] = useState<string>('');
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [checkForm] = Form.useForm();

  const { data: inventoryData = [], loading } = useRequest(() => getInventoryOverviewList());

  const handleInvData = useMemo(() => {
    return inventoryData.map((item) => {
      return {
        value: item.id,
        title:
          item.name === item.version
            ? `${item.provinceName}_${item.resourceLibName}_${item.year}_${item.name}`
            : `${item.name}_${item.version}`,
      };
    });
  }, [JSON.stringify(inventoryData)]);

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
        <TableSearch marginLeft="20px" label="选择协议库存" width="440px">
          <UrlSelect
            showSearch
            defaultData={handleInvData}
            titleKey="title"
            valueKey="value"
            value={inventoryId}
            placeholder="请选择"
            onChange={(value: any) => searchByInv(value)}
          />
        </TableSearch>
      </div>
    );
  };

  //选择协议库存传InvId
  const searchByInv = (value: any) => {
    const currentVal = handleInvData.filter((item: any) => {
      if (value === item.value) {
        return item.title;
      }
    });

    setNowSelectedInv(currentVal[0].title);

    setInventoryId(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        inventoryOverviewId: value,
        demandCompany: searchKeyWord,
        keyWord: searchKeyWord,
      });
    }
  };

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
    return nowSelectedInv ? (
      <div style={{ paddingTop: '2px', fontSize: '13px' }}>{` -${nowSelectedInv}`}</div>
    ) : null;
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('inventory-import') && (
          <Button className="mr7" onClick={() => importInventoryEvent()}>
            <ImportOutlined />
            导入
          </Button>
        )}

        {buttonJurisdictionArray?.includes('inventory-create-mapping') && (
          <Button className={styles.importBtn} onClick={() => createMappingEvent()}>
            编辑映射
          </Button>
        )}

        {buttonJurisdictionArray?.includes('inventory-check-mapping') && (
          <Button className={styles.importBtn} onClick={() => checkMappingEvent()}>
            查看映射关系
          </Button>
        )}
      </div>
    );
  };

  //创建映射
  const createMappingEvent = () => {
    if (!inventoryId) {
      message.warning('请先选择协议库存');
      return;
    }
    setAddMapVisible(true);
  };

  //导入
  const importInventoryEvent = () => {
    setImportFormVisible(true);
  };

  const uploadFinishEvent = () => {
    refresh();
  };

  //查看映射
  const checkMappingEvent = () => {
    if (!inventoryId) {
      message.warning('请先选择协议库存');
      return;
    }
    setInventoryId(inventoryId);
    setCheckMappingVisible(true);
  };

  return (
    <PageCommonWrap>
      <div className={styles.InvTable}>
        <GeneralTable
          scroll={{ x: 3500, y: 577 }}
          size="middle"
          ref={tableRef}
          titleSlot={titleSlotElement}
          buttonLeftContentSlot={searchComponent}
          buttonRightContentSlot={tableElement}
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
      </div>

      {checkMappingVisible && (
        <Modal
          maskClosable={false}
          footer=""
          title="查看映射关系"
          width="95%"
          visible={checkMappingVisible}
          okText="确认"
          centered
          onCancel={() => setCheckMappingVisible(false)}
          cancelText="取消"
          bodyStyle={{ height: '820px', overflowY: 'auto' }}
          destroyOnClose
        >
          <Form form={checkForm} preserve={false}>
            <Spin spinning={loading}>
              <CheckMapping inventoryOverviewId={inventoryId} currentInv={handleInvData} />
            </Spin>
          </Form>
        </Modal>
      )}
      {addMapVisible && (
        <CreateMap
          visible={addMapVisible}
          inventoryOverviewId={inventoryId}
          onChange={setAddMapVisible}
        />
      )}
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
