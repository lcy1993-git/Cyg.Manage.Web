import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getComponentDetail,
  addComponentItem,
  updateComponentItem,
  deleteComponentItem,
} from '@/services/resource-config/component';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
// import ComponentForm from './components/add-edit-form';

const { Search } = Input;

const CableWell: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getComponentDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="选择资源" width="200px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/ResourceLib/GetList"
            titleKey="libName"
            valueKey="id"
            placeholder="请选择"
            onChange={(value: any) => searchByLib(value)}
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="组件" width="220px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/Component/GetDeviceCategory"
            titleKey="name"
            valueKey="value"
            placeholder="请选择"
            onChange={(value: any) => searchByLib(value)}
          />
        </TableSearch>
      </div>
    );
  };

  //选择资源库传libId
  const searchByLib = (value: any) => {
    // console.log(value);
    setResourceLibId(value);
    search();
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
      dataIndex: 'cableWellId',
      index: 'cableWellId',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'cableWellName',
      index: 'cableWellName',
      title: '名称',
      width: 240,
    },
    {
      dataIndex: 'shortName',
      index: 'shortName',
      title: '简称',
      width: 200,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 220,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 140,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'width',
      index: 'width',
      title: '宽度(mm)',
      width: 180,
    },

    {
      dataIndex: 'depth',
      index: 'depth',
      title: '井深',
      width: 180,
    },
    {
      dataIndex: 'pavement',
      index: 'pavement',
      title: '特征',
      width: 180,
    },
    {
      dataIndex: 'size',
      index: 'size',
      title: '尺寸',
      width: 180,
    },
    {
      dataIndex: 'coverMode',
      index: 'coverMode',
      title: '盖板模式',
      width: 180,
    },
    {
      dataIndex: 'grooveStructure',
      index: 'grooveStructure',
      title: '沟体结构',
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
      width: 180,
    },
  ];

  //添加
  const addEvent = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库！');
      return;
    }
    setAddFormVisible(true);
  };

  const sureAddMaterial = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          cableWellId: '',
          cableWellName: '',
          shortName: '',
          typicalCode: '',
          type: '',
          unit: '',
          width: 0,
          depth: 0,
          isConfined: 0,
          isSwitchingPipe: 0,
          feature: '',
          pavement: '',
          size: '',
          coverMode: '',
          grooveStructure: '',
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: '',
        },
        value,
      );
      await addComponentItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  //编辑
  const editEvent = async () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const ResourceLibData = await run(resourceLibId, editDataId);

    editForm.setFieldsValue(ResourceLibData);
  };

  const sureEditMaterial = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          id: editData.id,
          componentName: editData.componentName,
          componentSpec: editData.componentSpec,
          typicalCode: editData.typicalCode,
          unit: editData.unit,
          deviceCategory: editData.deviceCategory,
          componentType: editData.componentType,
          kvLevel: editData.kvLevel,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        values,
      );
      await updateComponentItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
        >
          <Button className="mr7">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
        <TableImportButton
          buttonTitle="导入组件"
          modalTitle="导入组件"
          className={styles.importBtn}
          importUrl="/Material/Import"
        />
        <Button className={styles.importBtn} onClick={() => openDetail()}>
          组件明细
        </Button>
        <Button className={styles.importBtn} onClick={() => openAttribute()}>
          组件属性
        </Button>
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteComponentItem(editDataId);
    refresh();
    message.success('删除成功');
  };

  //展示组件明细
  const openDetail = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库');
      return;
    }
    setDetailVisible(true);
  };

  //展示组件属性
  const openAttribute = () => {
    if (!resourceLibId) {
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
        url="/Component/GetPageList"
        tableTitle="组件列表"
        getSelectData={(data) => setTableSelectRow(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: resourceLibId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="添加-组件"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <ComponentForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        title="编辑-组件"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMaterial()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <Spin spinning={loading}>
            <ComponentForm resourceLibId={resourceLibId} />
          </Spin>
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

export default CableWell;
