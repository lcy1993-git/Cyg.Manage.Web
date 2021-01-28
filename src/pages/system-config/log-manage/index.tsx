import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message, Input, Row, Col } from 'antd';
import React, { useRef, useState } from 'react';
// import ManageUserForm from './components/form';
import { isArray } from 'lodash';
import {
  updateManageUserItem,
  addManageUserItem,
  getManageUserDetail,
  updateItemStatus,
  ItemDetailData,
} from '@/services/personnel-config/manage-user';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';

const { Search } = Input;

const ManageUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run } = useRequest(getManageUserDetail, {
    manual: true,
  });

  //   const handleData = [
  //     {
  //       id: '1',
  //       userName: '艾格尼',
  //       nickName: '火鸟',
  //       name: '鲁邦',
  //       phone: '166883322',
  //       email: 'JKL@jsx.com',
  //       companyName: '双蛇',
  //       province: '龙堡',
  //       userStatus: 1,
  //       lastLoginIp: '10.1.1.0',
  //       lastLoginDate: '2077-1-1',
  //       roleType: '1',
  //       roleName: 'SuperAdmin',
  //     },
  //     {
  //       id: '2',
  //       userName: '拉拉菲尔',
  //       nickName: '阿卜',
  //       name: '卓一',
  //       phone: '146783322',
  //       email: 'HJK@tsx.com',
  //       companyName: '恒辉',
  //       province: '森都',
  //       userStatus: 2,
  //       lastLoginIp: '10.3.10.0',
  //       lastLoginDate: '1984-1-1',
  //       roleType: '2',
  //       roleName: 'Admin',
  //     },
  //   ];
  const rightButton = () => {
    return (
      <div>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          查询
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          重置
        </Button>
        <Button type="primary" onClick={() => resetEvent()}>
          <EyeOutlined />
          详情
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

  //
  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddManageUserItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          userName: '',
          pwd: '',
          roleId: '',
          province: '',
          companyId: '',
          email: '',
          nickName: '',
          name: '',
          userStatus: 1,
        },
        value,
      );
      await addManageUserItem(submitInfo);
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

  const sureEditManageUser = () => {
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
        },
        values,
      );
      await updateManageUserItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const columns = [
    {
      title: '应用程序',
      dataIndex: 'application',
      index: 'application',
      width: 240,
    },
    {
      title: '跟踪编号',
      dataIndex: 'traceId',
      index: 'traceId',
      width: 240,
    },
    {
      title: '日志级别',
      dataIndex: 'logLevel',
      index: 'logLevel',
    },
    {
      title: 'Api',
      dataIndex: 'reqQueryString',
      index: 'reqQueryString',
    },
    {
      title: '内容',
      dataIndex: 'resContent',
      index: 'resContent',
    },
    {
      title: '执行日期',
      dataIndex: 'executeDate',
      index: 'executeDate',
    },
    {
      title: '耗时',
      dataIndex: 'timeCost',
      index: 'timeCost',
    },
  ];
  const leftSearch = () => {
    return (
      <Form>
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
      </Form>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        otherSlot={leftSearch}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="日志管理"
        url="/Log/GetPagedList"
        columns={columns}
      />
      <Modal
        title="添加-管理用户"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddManageUserItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        {/* <Form form={addForm}>
          <LogManageForm />
        </Form> */}
      </Modal>
    </PageCommonWrap>
  );
};

export default ManageUser;
