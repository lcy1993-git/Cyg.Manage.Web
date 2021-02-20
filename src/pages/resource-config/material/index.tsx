import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getResourceLibDetail,
  addResourceLibItem,
  updateResourceLibItem,
} from '@/services/resource-config/resource-lib';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
import MaterialForm from './component/add-edit-form';

const { Search } = Input;

const Material: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false);
  const [cableTerminalVisible, setCableTerminalVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getResourceLibDetail, {
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
        <TableSearch marginLeft="20px" label="选择资源" width="300px">
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
      dataIndex: 'materialId',
      index: 'materialId',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '类型',
      width: 180,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '名称',
      width: 320,
    },
    {
      dataIndex: 'spec',
      index: 'spec',
      title: '规格型号',
      width: 320,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'pieceWeight',
      index: 'pieceWeight',
      title: '单重(kg)',
      width: 180,
    },
    {
      dataIndex: 'unitPrice',
      index: 'uniunitPricet',
      title: '单价(元)',
      width: 180,
    },

    {
      dataIndex: 'materialType',
      index: 'materialType',
      title: '类别',
      width: 180,
    },

    {
      dataIndex: 'usage',
      index: 'usage',
      title: '用途',
      width: 320,
    },

    {
      dataIndex: 'inspection',
      index: 'inspection',
      title: '物料(运检)',
      width: 240,
    },

    {
      dataIndex: 'code',
      index: 'code',
      title: '物资编号',
      width: 220,
    },
    {
      dataIndex: 'supplySide',
      index: 'supplySide',
      title: '供给方',
      width: 150,
    },
    {
      dataIndex: 'transportationType',
      index: 'transportationType',
      title: '运输类型',
      width: 240,
    },
    {
      dataIndex: 'statisticType',
      index: 'statisticType',
      title: '统计类型',
      width: 240,
    },
    {
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 240,
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
      title: '描述',
      width: 320,
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
          materialId: '',
          category: '',
          materialName: '',
          spec: '',
          unit: '',
          pieceWeight: 0,
          unitPrice: 0,
          materialType: '',
          usage: '',
          inspection: '',
          description: '',
          code: '',
          supplySide: '',
          transportationType: '',
          statisticType: '',
          kvLevel: '',
          forProject: '',
          forDesign: '',
          remark: '',
        },
        value,
      );
      await addResourceLibItem(submitInfo);
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
    const ResourceLibData = await run(editDataId);

    editForm.setFieldsValue(ResourceLibData);
  };

  const sureEditResourceLib = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libName: editData.libName,
          version: editData.version,
          remark: editData.remark,
        },
        values,
      );
      await updateResourceLibItem(submitInfo);
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
        <Button className="mr7" onClick={() => editEvent()}>
          <DeleteOutlined />
          删除
        </Button>
        <TableImportButton
          buttonTitle="导入物料"
          modalTitle="导入物料"
          className={styles.importBtn}
          importUrl="/Material/Import"
        />
        <Button className={styles.importBtn} onClick={() => openWireAttribute()}>
          导线属性
        </Button>
        <Button className={styles.importBtn} onClick={() => openCableTerminal()}>
          电缆终端头映射
        </Button>
      </div>
    );
  };

  //展示导线属性
  const openWireAttribute = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库');
      return;
    }
    setAttributeVisible(true);
  };

  //展示电缆终端头映射
  const openCableTerminal = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库');
      return;
    }
    setCableTerminalVisible(true);
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
        url="/Material/GetPageList"
        tableTitle="物料列表"
        getSelectData={(data) => setTableSelectRow(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: resourceLibId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="添加-物料"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Form form={addForm}>
          <MaterialForm resourceLibId={resourceLibId} />
        </Form>
      </Modal>
      <Modal
        title="编辑-物料"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditResourceLib()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <Spin spinning={loading}>
            <MaterialForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        footer=""
        title="导线属性"
        width="680px"
        visible={attributeVisible}
        onCancel={() => setAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        11
      </Modal>

      <Modal
        footer=""
        title="电缆终端头映射"
        width="680px"
        visible={cableTerminalVisible}
        onCancel={() => setCableTerminalVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        11
      </Modal>
    </PageCommonWrap>
  );
};

export default Material;
