import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, Modal, Form, message, Spin } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getInventoryOverviewList } from '@/services/material-config/inventory';
// import { divide, isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
// import CreatMappingForm from './components/create-mapping-form';
import CheckMapping from './components/check-mapping-form';

const { Search } = Input;

const Inventroy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [inventoryId, setInventoryId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [checkMappingVisible, setCheckMappingVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [checkForm] = Form.useForm();

  const { data: inventoryData = [] } = useRequest(() => getInventoryOverviewList());

  const handleInvData = useMemo(() => {
    return inventoryData.map((item) => {
      return {
        value: item.id,
        title: `${item.provinceName}_${item.resourceLibName}_${item.year}_${item.name}`,
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
            placeholder="关键词"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="需求公司"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="选择协议库存" width="440px">
          <UrlSelect
            allowClear
            showSearch
            defaultData={handleInvData}
            titleKey="title"
            valueKey="value"
            placeholder="请选择"
            onChange={(value: any) => searchByInv(value)}
          />
        </TableSearch>
      </div>
    );
  };

  //选择协议库存传InvId
  const searchByInv = (value: any) => {
    console.log(value);
    setInventoryId(value);
    search();
  };

  useEffect(() => {
    searchByInv(inventoryId);
  }, [inventoryId]);

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
      width: 320,
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
      width: 320,
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
      width: 280,
    },
    {
      dataIndex: 'targetNumber',
      index: 'targetNumber',
      title: '目标数量',
      width: 160,
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
      width: 160,
    },
    {
      dataIndex: 'documentDateText',
      index: 'documentDateText',
      title: '凭证日期',
      width: 200,
    },
    {
      dataIndex: 'effectiveStartDateText',
      index: 'effectiveStartDateText',
      title: '有效起始日期',
      width: 200,
    },
    {
      dataIndex: 'effectiveEndDateText',
      index: 'effectiveEndDateText',
      title: '有效截止日期',
      width: 200,
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

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <TableImportButton
          buttonTitle="导入"
          modalTitle="导入"
          className={styles.importBtn}
          importUrl="/ElectricalEquipment/Import"
        />
        <Button className={styles.importBtn} onClick={() => creatMappingEvent()}>
          创建映射
        </Button>
        <Button className={styles.importBtn} onClick={() => checkMappingEvent()}>
          查看映射关系
        </Button>
      </div>
    );
  };

  //创建映射
  const creatMappingEvent = () => {
    if (!inventoryId) {
      message.warning('请先选择协议库存');
      return;
    }
    setCheckMappingVisible(true);
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
      <GeneralTable
        scroll={{ x: 3500 }}
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetPageList"
        tableTitle="协议库存列表"
        getSelectData={(data) => setTableSelectRow(data)}
        type="radio"
        extractParams={{
          inventoryOverviewId: inventoryId,
          demandCompany: searchKeyWord,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="创建映射"
        width="90%"
        visible={addFormVisible}
        okText="确认"
        // onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          {/* <ElectricalEquipmentForm inventoryId={inventoryId} type="add" /> */}
        </Form>
      </Modal>
      <Modal
        footer=""
        title="查看映射关系"
        width="90%"
        visible={checkMappingVisible}
        okText="确认"
        onCancel={() => setCheckMappingVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
      >
        <Form form={checkForm}>
          <Spin spinning>
            <CheckMapping inventoryOverviewId={inventoryId} currentInv={handleInvData} />
          </Spin>
        </Form>
      </Modal>
      
    </PageCommonWrap>
  );
};

export default Inventroy;
