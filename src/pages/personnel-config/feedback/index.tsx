import React, { useRef, useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PageCommonWrap from '@/components/page-common-wrap';
import {
  getUserFeedBackDetail,
  addUserFeedBackItem,
  getFeedBackList,
} from '@/services/personnel-config/feedback';
import { isArray } from 'lodash';
import UserFeedBackForm from '../feedback/form';
import GeneralTable from '@/components/general-table';

const UserFeedBack: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [checkFormVisible, setCheckFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  //   const { data, run } = useRequest(getUserFeedBackDetail, {
  //     manual: true,
  //   });

  const { data } = useRequest(getFeedBackList, {
    manual: true,
  });
  console.log(data);

  //数据修改，局部刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const feedBackColumns = [
    {
      title: '类别',
      dataIndex: 'categoryText',
      index: 'categoryText',
      width: 120,
    },
    {
      title: '标题',
      dataIndex: 'title',
      index: 'title',
    },
    {
      title: '处理日期',
      dataIndex: 'lastProcessData',
      index: 'lastProcessData',
    },
    {
      title: '状态',
      dataIndex: 'processStatus',
      index: 'processStatus',
    },
    {
      title: '反馈日期',
      dataIndex: 'createdOn',
      index: 'createdOn',
    },
  ];

  const userFeedBackButton = () => {
    return (
      <>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          反馈
        </Button>
        <Button className="mr7" onClick={() => checkEvent()}>
          <EyeOutlined />
          查看
        </Button>
      </>
    );
  };

  const checkEvent = () => {
    setCheckFormVisible(true);
  };

  const sureCheckFeedBack = async () => {};

  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddCompanyManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          category: '',
          title: '',
          phone: '',
          describe: '',
        },
        value,
      );
      console.log(submitInfo);

      await addUserFeedBackItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        tableTitle="用户反馈"
        columns={feedBackColumns}
        getSelectData={(data) => setTableSelectRow(data)}
        buttonRightContentSlot={userFeedBackButton}
        url="/Feedback/GetList"
      />
      <Modal
        title="添加-反馈"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <UserFeedBackForm />
        </Form>
      </Modal>
      <Modal
        title="查看-公司"
        width="680px"
        visible={checkFormVisible}
        okText="确认"
        onOk={() => sureCheckFeedBack()}
        onCancel={() => setCheckFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <UserFeedBackForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default UserFeedBack;
