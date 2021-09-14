import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message, Input, Switch, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import ManageUserForm from './components/add-edit-form';
import { isArray } from 'lodash';
import {
  updateManageUserItem,
  addManageUserItem,
  getManageUserDetail,
  updateItemStatus,
  resetItemPwd,
} from '@/services/personnel-config/manage-user';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import ResetPasswordForm from './components/reset-form';
import moment from 'moment';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

const ManageUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [status, setStatus] = useState<number>(0);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run, loading } = useRequest(getManageUserDetail, {
    manual: true,
  });

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const rightButton = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('manage-user-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('manage-user-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('reset-manage-password') && (
          <Button onClick={() => resetEvent()}>
            <ReloadOutlined />
            重置密码
          </Button>
        )}
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
      const newPassword = Object.assign({ id: editDataId, pwd: values.newPwd });

      await resetItemPwd(newPassword);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setResetFormVisible(false);
    });
  };

  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddManageUserItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          userName: '',
          pwd: '',
          userType: '',
          companyId: '',
          name: '',
        },
        value,
      );

      await addManageUserItem(submitInfo);
      message.success('添加成功');
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }

    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);

    const ManageUserData = await run(editDataId);

    editForm.setFieldsValue({ ...ManageUserData, userStatus: String(ManageUserData.userStatus) });
  };

  const sureEditManageUser = () => {
    const editData = data!;
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          email: editData.email,
          name: editData.name,
          phone: editData.phone,
        },
        values,
      );
      await updateManageUserItem(submitInfo);
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
      width: 140,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      index: 'name',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: 160,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      index: 'email',
      width: 160,
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      index: 'companyName',
    },

    {
      title: '状态',
      dataIndex: 'userStatus',
      index: 'userStatus',
      width: 80,
      render: (text: any, record: any) => {
        return record.userStatus === 1 ? (
          <Switch defaultChecked onChange={() => updateStatus(record.id)} />
        ) : (
          <Switch onChange={() => updateStatus(record.id)} />
        );
      },
    },

    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      index: 'lastLoginIp',
      width: 140,
    },
    {
      title: '最后登录日期',
      dataIndex: 'lastLoginDate',
      index: 'lastLoginDate',
      width: 140,
      render: (text: any, record: any) => {
        return record.lastLoginDate ? moment(record.lastLoginDate).format('YYYY-MM-DD') : null;
      },
    },
    {
      title: '账号类型',
      dataIndex: 'userType',
      index: 'userType',
      width: 140,
      render: (text: any, record: any) => {
        return record.userType ? record.userTypeText : record.userType;
      },
    },
  ];

  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const leftSearch = () => {
    return (
      <div className={styles.search}>
        <TableSearch label="关键词" width="280px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="输入用户名/昵称/姓名搜索"
            enterButton
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect
            enumList={BelongManageEnum}
            placeholder="-全部-"
            onChange={(value: any) => searchByStatus(value)}
          />
        </TableSearch>
      </div>
    );
  };

  const searchByStatus = (value: any) => {
    setStatus(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        userStatus: value,
      });
    }
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearch}
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="管理员"
        url="/ManageUser/GetPagedList"
        columns={columns}
        extractParams={{
          keyWord: searchKeyWord,
          userStatus: status,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-管理员"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddManageUserItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ManageUserForm type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-管理员"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditManageUser()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <ManageUserForm />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="重置密码"
        width="680px"
        visible={resetFormVisible}
        okText="确认"
        onOk={() => resetPwd()}
        onCancel={() => setResetFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <ResetPasswordForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default ManageUser;
