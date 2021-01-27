import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message, Input, Row, Col } from 'antd';
import React, { useRef, useState } from 'react';
import ManageUserForm from './components/form';
import { isArray } from 'lodash';
import {
  updateRoleManageItem,
  addRoleManageItem,
  getRoleManageDetail,
} from '@/services/jurisdiction-config/role-manage/role-manage';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user/manage-user';

const { Search } = Input;

const ManageUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run } = useRequest(getRoleManageDetail, {
    manual: true,
  });

  const handleData = [
    // {
    //   userName: '艾格尼',
    //   nickName: '火鸟',
    //   name: '鲁邦',
    //   phone: '166883322',
    //   email: 'JKL@jsx.com',
    //   companyName: '双蛇',
    //   province: '龙堡',
    //   userStatus: 1,
    //   lastLoginIp: '10.1.1.0',
    //   lastLoginDate: '2077-1-1',
    //   roleType: '1',
    //   roleName: 'SuperAdmin',
    // },
    {
      id: '1',
      userName: '拉拉菲尔',
      nickName: '阿卜',
      name: '卓一',
      phone: '146783322',
      email: 'HJK@tsx.com',
      companyName: '恒辉',
      province: '森都',
      userStatus: 2,
      lastLoginIp: '10.3.10.0',
      lastLoginDate: '1984-1-1',
      roleType: '2',
      roleName: 'Admin',
    },
  ];
  const rightButton = () => {
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
        <Button onClick={() => resetEvent()}>
          <ReloadOutlined />
          重置密码
        </Button>
      </div>
    );
  };

  //数据修改刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const resetEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    setResetFormVisible(true);
  };

  //重置密码
  const resetPwd = () => {};

  //
  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddRoleManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          roleName: '',
          roleType: '',
          remark: '',
        },
        value,
      );
      await addRoleManageItem(submitInfo);
      tableFresh();
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
    // const editDataId = editData.id;

    // const RoleManageData = await run(editDataId);
    editForm.setFieldsValue(editData);

    setEditFormVisible(true);
  };

  const sureEditRoleManage = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请先选择一条数据进行编辑');
      return;
    }
    const editData = data!;
    console.log(data);

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          roleName: editData.roleName,
          remark: editData.remark,
        },
        values,
      );
      await updateRoleManageItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };
  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
      width: 240,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      index: 'nickName',
      width: 240,
    },
    {
      title: '真实姓名',
      dataIndex: 'name',
      index: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      index: 'email',
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      index: 'companyName',
    },
    {
      title: '区域',
      dataIndex: 'provinceName',
      index: 'provinceName',
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      index: 'userStatus',
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      index: 'lastLoginIp',
    },
    {
      title: '最后登录日期',
      dataIndex: 'lastLoginDate',
      index: 'lastLoginDate',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      index: 'roleType',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      index: 'roleName',
    },
  ];
  const leftSearch = () => {
    return (
      <Row gutter={16}>
        <Col span={4}>
          <Form.Item label="关键词">
            <Search placeholder="请输入关键词" enterButton />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item label="状态">
            <EnumSelect enumList={BelongManageEnum} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        dataSource={handleData}
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        otherSlot={leftSearch}
        getSelectData={(handleData) => setTableSelectRow(handleData)}
        tableTitle="角色管理"
        url="/ManageUser/GetPagedList"
        columns={columns}
      />
      <Modal
        title="添加-管理用户"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddRoleManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <ManageUserForm type="add" />
        </Form>
      </Modal>
      <Modal
        title="编辑-管理用户"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditRoleManage()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <ManageUserForm />
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
          <ManageUserForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default ManageUser;
