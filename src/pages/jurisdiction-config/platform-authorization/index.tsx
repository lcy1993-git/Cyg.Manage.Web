import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input, Modal, Form, Popconfirm, message, Switch } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, PlusOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';
import '@/assets/icon/iconfont.css';
import { useBoolean, useRequest } from 'ahooks';
import {
  getAuthorizationDetail,
  updateAuthorizationItem,
  updateAuthorizationItemStatus,
  deleteAuthorizationItem,
  addAuthorizationItem,
  getAuthorizationTreeList,
  updateAuthorizationModules,
} from '@/services/jurisdiction-config/platform-authorization';
import { isArray } from 'lodash';
import AuthorizationForm from './components/add-edit-form';
import CheckboxTreeTable from '@/components/checkbox-tree-table';
import SuperManageAuthorization from './components/super-manage-authorization';

const { Search } = Input;

const PlatformAuthorization: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [distributeFormVisible, setDistributeFormVisible] = useState<boolean>(false);
  const [
    authorizationFormVisible,
    { setFalse: authorizationFormHide, setTrue: authorizationFormShow },
  ] = useBoolean(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [apportionForm] = Form.useForm();

  const { data, run } = useRequest(getAuthorizationDetail, {
    manual: true,
  });

  const { data: MoudleTreeData = [], run: getModuleTreeData } = useRequest(
    getAuthorizationTreeList,
    {
      manual: true,
    },
  );
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isDisable;
        return <Switch checked={isChecked} onChange={() => updateStatus(record)} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
    },
  ];

  const updateStatus = async (record: any) => {
    const { id } = record;

    await updateAuthorizationItemStatus(id);
    tableFresh();
    message.success('状态修改成功');
  };

  const searchElement = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onSearch={() => search({ keyWord: searchKeyWord })}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          placeholder="模板名称"
          enterButton
        />
      </TableSearch>
    );
  };

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const search = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search(params);
    }
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteAuthorizationItem(editDataId);
    tableFresh();
    message.success('删除成功');
  };

  const distributeEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setDistributeFormVisible(true);
    await getModuleTreeData(editDataId);
  };

  //保存分配功能
  const sureDistribute = async () => {
    apportionForm.validateFields().then(async (values) => {
      const templateId = tableSelectRows[0].id;
      const { moduleIds } = values;

      await updateAuthorizationModules({ templateId, moduleIds });
      setDistributeFormVisible(false);
      tableFresh();
      message.success('功能分配成功');
    });
  };

  //授权
  const authorizationEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    authorizationFormShow();
  };

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          isDisable: false,
          remark: '',
        },
        value,
      );
      await addAuthorizationItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const AuthorizationData = await run(editDataId);

    editForm.setFieldsValue(AuthorizationData);
  };

  const sureEditAuthorization = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          isDisable: editData.isDisable,
          remark: editData.remark,
        },
        values,
      );
      await updateAuthorizationItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const buttonElement = () => {
    return (
      <div>
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
          // disabled
        >
          <Button className="mr7">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
        <Button className="mr7" onClick={() => distributeEvent()}>
          <ApartmentOutlined />
          分配功能模块
        </Button>
        <Button className="mr7" onClick={() => authorizationEvent()}>
          <i className="iconfont iconshouquan" />
          授权
        </Button>
      </div>
    );
  };

  const cancelAuthorization = () => {
    authorizationFormHide();
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        getSelectData={(data) => setTableSelectRow(data)}
        url="/AuthTemplate/GetPagedList"
        columns={columns}
        tableTitle="授权管理"
      />
      <Modal
        title="添加-模板"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <AuthorizationForm />
        </Form>
      </Modal>
      <Modal
        title="编辑-模板"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <AuthorizationForm />
        </Form>
      </Modal>
      <Modal
        title="分配功能模块"
        width="80%"
        visible={distributeFormVisible}
        okText="确认"
        onOk={() => sureDistribute()}
        onCancel={() => setDistributeFormVisible(false)}
        cancelText="取消"
      >
        <Form form={apportionForm}>
          <Form.Item name="moduleIds">
            <CheckboxTreeTable treeData={MoudleTreeData} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="授权"
        width="90%"
        visible={authorizationFormVisible}
        destroyOnClose={true}
        footer={false}
        onCancel={() => cancelAuthorization()}
        bodyStyle={{ paddingTop: '10px' }}
      >
        <SuperManageAuthorization
          extractParams={{
            templateId:
              isArray(tableSelectRows) && tableSelectRows.length > 0 ? tableSelectRows[0].id : '',
          }}
        />
      </Modal>
    </PageCommonWrap>
  );
};

export default PlatformAuthorization;
