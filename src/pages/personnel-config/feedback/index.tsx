import React, { useRef, useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PageCommonWrap from '@/components/page-common-wrap';
import {
  getUserFeedBackDetail,
  addUserFeedBackItem,
  replyTheFeedback,
} from '@/services/personnel-config/feedback';
import UserFeedBackForm from './components/form';
import GeneralTable from '@/components/general-table';
import moment from 'moment';
import { Spin } from 'antd';
import FeedbackDetail from './components/detail';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const UserFeedBack: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [checkFormVisible, setCheckFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [replyForm] = Form.useForm();

  const { data: detailData = {}, run: getDetailData, loading } = useRequest(getUserFeedBackDetail, {
    manual: true,
  });

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

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
      width: 140,
    },
    {
      title: '处理日期',
      dataIndex: 'lastProcessDate',
      index: 'lastProcessDate',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'processStatusText',
      index: 'processStatusText',
      width: 170,
    },
    {
      title: '反馈日期',
      dataIndex: 'createdOn',
      index: 'createdOn',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>;
      },
    },
  ];

  const userFeedBackButton = () => {
    return (
      <>
        {
          buttonJurisdictionArray?.includes("feedback-add") &&
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            反馈
          </Button>
        }
        {
          buttonJurisdictionArray?.includes("feedback-check-detail") &&
          <Button className="mr7" onClick={() => checkEvent()}>
            <EyeOutlined />
            查看
          </Button>
        }

      </>
    );
  };

  const checkEvent = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.error('请至少选择一条数据');
      return;
    }
    await getDetailData(tableSelectRows[0].id);
    setCheckFormVisible(true);
  };

  const sureCheckFeedBack = () => {
    replyForm.validateFields().then(async (values) => {
      if (tableSelectRows && tableSelectRows.length === 0) {
        message.error('请至少选择一条数据');
        return;
      }

      const { content } = values;

      const feedbackId = tableSelectRows[0].id;

      await replyTheFeedback({ feedbackId, content });

      message.success('回复成功');
      setCheckFormVisible(false);
      tableFresh();
    });
  };

  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddCompanyManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          SourceType: 1,
          category: '',
          title: '',
          phone: '',
          describe: '',
        },
        value,
      );
      await addUserFeedBackItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        noPaging={true}
        requestSource="common"
        ref={tableRef}
        tableTitle="用户反馈"
        columns={feedBackColumns}
        getSelectData={(data) => setTableSelectRow(data)}
        buttonRightContentSlot={userFeedBackButton}
        url="/Feedback/GetList"
      />
      <Modal
      maskClosable={false}
        title="添加-反馈"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <UserFeedBackForm />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="回复-反馈"
        width="680px"
        visible={checkFormVisible}
        okText="确认"
        onOk={() => sureCheckFeedBack()}
        onCancel={() => {
          setCheckFormVisible(false);
        }}
        cancelText="取消"
        destroyOnClose
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Spin spinning={loading}>
          <Form form={replyForm} preserve={false}>
            <FeedbackDetail detailInfo={detailData} />
          </Form>
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default UserFeedBack;
