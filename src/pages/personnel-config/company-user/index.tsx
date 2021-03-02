import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message, Input, Switch, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import CompanyUserForm from './components/add-edit-form';
import { isArray } from 'lodash';
import {
  getCompanyUserDetail,
  addCompanyUserItem,
  BatchAddCompanyUserItem,
  updateCompanyUserItem,
  updateItemStatus,
  resetItemPwd,
} from '@/services/personnel-config/company-user';
import { getTreeSelectData } from '@/services/operation-config/company-group';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import ResetPasswordForm from './components/reset-form';
import moment from 'moment';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import BatchAddCompanyUser from './components/batch-add-form';

const { Search } = Input;

const CompanyUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [batchAddFormVisible, setBatchAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run, loading } = useRequest(getCompanyUserDetail, {
    manual: true,
  });

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  });

  const rightButton = () => {
    return (
      <div>
        <Button type="primary" className="mr7" onClick={() => batchAddEvent()}>
          <PlusOutlined />
          批量添加
        </Button>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        <Button onClick={() => resetEvent()}>
          <ReloadOutlined />
          重置密码
        </Button>
      </div>
    );
  };

  //数据修改刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  const resetEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择一条数据进行编辑');
      return;
    }
    setResetFormVisible(true);
  };

  //重置密码
  const resetPwd = async () => {
    editForm.validateFields().then(async (values) => {
      const editData = tableSelectRows[0];
      const editDataId = editData.id;
      const newPassword = Object.assign({ id: editDataId, pwd: values.pwd });

      await resetItemPwd(newPassword);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setResetFormVisible(false);
    });
  };

  const addEvent = async () => {
    await getSelectTreeData();
    setAddFormVisible(true);
  };

  const sureAddCompanyUserItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          pwd: '',
          groupIds: [],
          email: '',
          nickName: '',
          name: '',
          userStatus: 1,
        },
        value,
      );
      await addCompanyUserItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const batchAddEvent = async () => {
    await getSelectTreeData();
    setBatchAddFormVisible(true);
  };

  const sureBatchAddCompanyUser = () => {};
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }

    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await getSelectTreeData();
    setEditFormVisible(true);

    const ManageUserData = await run(editDataId);
    editForm.setFieldsValue(ManageUserData);
  };

  const sureEditCompanyUser = () => {
    const editData = data!;
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          email: editData.email,
          nickName: editData.nickName,
          userStatus: editData.userStatus,
        },
        values,
      );
      await updateCompanyUserItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  //数据改变状态
  const updateStatus = async (record: any) => {
    await updateItemStatus(record);
    refresh();
    message.success('状态修改成功');
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
      width: 150,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      index: 'nickName',
      width: 180,
    },
    {
      title: '真实姓名',
      dataIndex: 'name',
      index: 'name',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: 200,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      index: 'email',
      width: 200,
    },
    {
      title: '部组',
      dataIndex: 'comapnyGroups',
      index: 'comapnyGroups',
      width: 200,
      render: (text: any, record: any) => {
        return record.comapnyGroups ? record.comapnyGroups[0] : '';
      },
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      index: 'userStatus',
      width: 100,
      render: (text: any, record: any) => {
        return record.userStatus === 1 ? (
          <Switch defaultChecked onChange={() => updateStatus(record.id)} />
        ) : (
          <Switch onChange={() => updateStatus(record.id)} />
        );
      },
    },
    {
      title: '授权端口',
      dataIndex: 'authorizeClient',
      index: 'authorizeClient',
      width: 240,
      render: (text: any, record: any) => {
        return record.authorizeClient ? <span>{record.authorizeClientTexts}</span> : null;
      },
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      index: 'lastLoginIp',
      width: 180,
    },
    {
      title: '最后登录日期',
      dataIndex: 'lastLoginDate',
      index: 'lastLoginDate',
      width: 160,
      render: (text: any, record: any) => {
        return record.lastLoginDate ? moment(record.lastLoginDate).format('YYYY-MM-DD') : null;
      },
    },
  ];

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const leftSearch = () => {
    return (
      <div className={styles.search}>
        <TableSearch label="关键词" width="208px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入关键词"
            enterButton
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect enumList={BelongManageEnum} needAll defaultValue="" />
        </TableSearch>
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearch}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="公司用户"
        url="/CompanyUser/GetPagedList"
        columns={columns}
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="添加-公司用户"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyUserItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <CompanyUserForm treeData={selectTreeData} type="add" />
        </Form>
      </Modal>
      <Modal
        title="批量添加-公司用户"
        width="680px"
        visible={batchAddFormVisible}
        okText="确认"
        onOk={() => sureBatchAddCompanyUser()}
        onCancel={() => setBatchAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <BatchAddCompanyUser treeData={selectTreeData} />
        </Form>
      </Modal>
      <Modal
        title="编辑-公司用户"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyUser()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <Spin spinning={loading}>
            <CompanyUserForm treeData={selectTreeData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        title="重置密码"
        width="680px"
        visible={resetFormVisible}
        okText="确认"
        onOk={() => resetPwd()}
        onCancel={() => setResetFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <ResetPasswordForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyUser;
