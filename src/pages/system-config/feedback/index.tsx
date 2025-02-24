import React, { useRef, useState } from 'react'
import { Button, Modal, Form, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import PageCommonWrap from '@/components/page-common-wrap'
import {
  getUserFeedBackDetail,
  addUserFeedBackItem,
  replyTheFeedback,
} from '@/services/personnel-config/feedback'
import UserFeedBackForm from './components/form'
import GeneralTable from '@/components/general-table'
import moment from 'moment'
import { Spin } from 'antd'
import FeedbackDetail from './components/detail'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import styles from './index.less'

const UserFeedBack: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  // const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [clickId, setClickId] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [checkFormVisible, setCheckFormVisible] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [replyForm] = Form.useForm()

  const {
    data: detailData = {},
    run: getDetailData,
    loading,
  } = useRequest(getUserFeedBackDetail, {
    manual: true,
  })

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  //数据修改，局部刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh()
    }
  }

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
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('feedback-check-detail') && (
              <span onClick={() => checkEvent(record.id)} className={styles.feedTitle}>
                {record.title}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('feedback-check-detail') && (
              <span>{record.title}</span>
            )}
          </>
        )
      },
    },
    {
      title: '处理日期',
      dataIndex: 'lastProcessDate',
      index: 'lastProcessDate',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
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
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      },
    },
  ]

  const userFeedBackButton = () => {
    return (
      <>
        {buttonJurisdictionArray?.includes('feedback-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            反馈
          </Button>
        )}
        {/* {buttonJurisdictionArray?.includes('feedback-check-detail') && (
          <Button className="mr7" onClick={() => checkEvent()}>
            <EyeOutlined />
            查看
          </Button>
        )} */}
      </>
    )
  }

  const checkEvent = async (id: string) => {
    setClickId(id)
    await getDetailData(id)
    setCheckFormVisible(true)
  }

  const sureCheckFeedBack = () => {
    const feedbackId = clickId
    replyForm.validateFields().then(async (values) => {
      const { content } = values

      await replyTheFeedback({ feedbackId, content })

      message.success('回复成功')
      setCheckFormVisible(false)
      setClickId('')
      tableFresh()
    })
  }

  const addEvent = async () => {
    setAddFormVisible(true)
  }

  const sureAddCompanyManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          SourceType: 3,
          category: '',
          title: '',
          phone: '',
          describe: '',
        },
        value
      )
      await addUserFeedBackItem(submitInfo)
      tableFresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        noPaging={true}
        requestSource="common"
        ref={tableRef}
        tableTitle="异常反馈"
        columns={feedBackColumns}
        // getSelectData={(data) => setTableSelectRows(data)}
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
          setCheckFormVisible(false)
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
  )
}

export default UserFeedBack
