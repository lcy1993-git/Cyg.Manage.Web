import PageCommonWrap from '@/components/page-common-wrap';
import React, { useRef, useState } from 'react';
import { Button, Switch, Modal, Form, Popconfirm, message, Spin } from 'antd';
import TreeTable from '@/components/tree-table/index';
import {
  TreeDataItem,
  addFunctionModuleItem,
  updateFunctionModuleItem,
  getFunctionModuleDetail,
} from '@/services/system-config/function-module';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import FunctionModuleForm from './components/form';

import {
  updateFunctionItemStatus,
  getTreeSelectData,
  delectFunctionItem,
} from '@/services/system-config/function-module';
import { isArray } from 'lodash';
import { useRequest } from 'ahooks';

const FunctionModule: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading: editDataLoading } = useRequest(getFunctionModuleDetail, {
    manual: true,
  });

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  });

  const updateStatus = async (record: TreeDataItem) => {
    const { id } = record;
    await updateFunctionItemStatus(id);
    tableFresh();
    message.success('状态修改成功');
  };

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const functionTableColumns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      index: 'name',
    },
    {
      title: '请求地址',
      dataIndex: 'url',
      index: 'url',
    },
    {
      title: '数据类型',
      dataIndex: 'categoryText',
      index: 'categoryText',
      width: 140,
    },
    {
      title: '授权码',
      dataIndex: 'authCode',
      index: 'authCode',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      index: 'sort',
      width: 100,
    },
    {
      title: '状态',
      render: (record: TreeDataItem) => {
        const isChecked = !record.isDisable;
        return <Switch checked={isChecked} onChange={() => updateStatus(record)} />;
      },
      width: 100,
    },
  ];

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await delectFunctionItem(editDataId);
    tableFresh();
    message.success('删除成功');
  };

  const sureAddFunctionModule = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          parentId: '',
          category: '',
          authCode: '',
          url: '',
          sort: 1,
          isDisable: false,
        },
        value,
      );
      await addFunctionModuleItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const sureEditFunctionModule = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          authCode: editData.authCode,
          category: editData.category,
          icon: editData.icon,
          id: editData.id,
          isDisable: editData.isDisable,
          name: editData.name,
          parentId: editData.parentId,
          sort: editData.sort,
          url: editData.url,
        },
        values,
      );
      await updateFunctionModuleItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const functionModuleButton = () => {
    return (
      <>
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
          <Button className="mr33">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
      </>
    );
  };

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const functionModuleData = await run(editDataId);
    await getSelectTreeData();

    editForm.setFieldsValue({
      ...functionModuleData,
      category: String(functionModuleData.category),
    });
  };

  const addEvent = async () => {
    await getSelectTreeData();
    setAddFormVisible(true);
  };

  return (
    <PageCommonWrap>
      <TreeTable
        ref={tableRef}
        tableTitle="模块列表"
        rightButtonSlot={functionModuleButton}
        getSelectData={(data) => setTableSelectRow(data)}
        columns={functionTableColumns}
        url="/Module/GetTreeList"
      />
      <Modal
        maskClosable={false}
        title="添加-模块"
        width="680px"
        visible={addFormVisible}
        destroyOnClose
        okText="确认"
        onOk={() => sureAddFunctionModule()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm} preserve={false}>
          <FunctionModuleForm treeData={selectTreeData} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-模块"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditFunctionModule()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={editDataLoading}>
            <FunctionModuleForm treeData={selectTreeData} />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default FunctionModule;
