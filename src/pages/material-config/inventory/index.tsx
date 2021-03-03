import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getInventoryOverviewList } from '@/services/material-config/inventory';
import { divide, isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
// import CreatMappingForm from './components/create-mapping-form';

const { Search } = Input;

const Inventroy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [inventoryId, setInventoryId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: inventoryData = [] } = useRequest(() => getInventoryOverviewList());

  const handleInvData = useMemo(() => {
    console.log(inventoryData);
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
        <TableSearch marginLeft="20px" label="搜索" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="需求公司"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="选择协议库存" width="400px">
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

  //选择资源库传libId
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
      dataIndex: 'componentId',
      index: 'componentId',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'componentName',
      index: 'componentName',
      title: '名称',
      width: 240,
    },
    {
      dataIndex: 'componentSpec',
      index: 'componentName',
      title: '规格型号',
      width: 320,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 220,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'deviceCategory',
      index: 'deviceCategory',
      title: '设备类别',
      width: 180,
    },
    {
      dataIndex: 'componentType',
      index: 'componentType',
      title: '组件分类',
      width: 180,
    },

    {
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 180,
    },
    {
      dataIndex: 'forProject',
      index: 'forProject',
      title: '所属工程',
      width: 240,
    },
    {
      dataIndex: 'forDesign',
      index: 'forDesign',
      title: '所属设计',
      width: 240,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 220,
    },
  ];

  //添加
  const addEvent = () => {
    if (!inventoryId) {
      message.warning('请先选择资源库！');
      return;
    }
    setAddFormVisible(true);
  };

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
      message.warning('请先选择资源库');
      return;
    }
    setDetailVisible(true);
  };

  //查看映射
  const checkMappingEvent = () => {
    if (!inventoryId) {
      message.warning('请先选择资源库');
      return;
    }
    setAttributeVisible(true);
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
        url="/Inventory/GetPageList"
        tableTitle="协议库存列表"
        getSelectData={(data) => setTableSelectRow(data)}
        type="radio"
        extractParams={{
          inventoryOverviewId: inventoryId,
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
        title="协议库存物料映射全表查看"
        width="9"
        visible={editFormVisible}
        okText="确认"
        // onOk={() => sureEditMaterial()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          {/* <Spin spinning={loading}> */}
          {/* <ElectricalEquipmentForm inventoryId={inventoryId} /> */}
          {/* </Spin> */}
        </Form>
      </Modal>

      <Modal
        footer=""
        title="组件明细"
        width="680px"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        11
      </Modal>

      <Modal
        footer=""
        title="组件属性"
        width="680px"
        visible={attributeVisible}
        onCancel={() => setAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        11
      </Modal>
    </PageCommonWrap>
  );
};

export default Inventroy;
