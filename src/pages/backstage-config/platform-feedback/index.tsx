import EnumSelect from '@/components/enum-select'
import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { downLoadFileItem } from '@/services/operation-config/company-file'
import {
  Category,
  getFeedbackDetail,
  handleFeedback,
  SourceType,
  Status,
} from '@/services/system-config/platform-feedback'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { DownloadOutlined, FormOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, DatePicker, Form, Input, message, Modal, Space, Spin } from 'antd'
import { isArray } from 'lodash'
import moment, { Moment } from 'moment'
import React, { useRef, useState } from 'react'
import FeedBackFormfrom from './components/deal-form'
import styles from './index.less'

const { Search } = Input

const PlatFormFeedBack: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const [beginDate, setBeginDate] = useState<Moment | null>()
  const [endDate, setEndDate] = useState<Moment | null>()
  const [sourceType, setSourceType] = useState<string | undefined>()
  const [category, setCategory] = useState<string | undefined>()
  const [feedbackStatus, setFeedbackStatus] = useState<string | undefined>()
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [feedbackDetailVisible, setFeedBackDetailVisible] = useState<boolean>(false)

  const {
    data: detailData,
    loading,
    run: getDetailData,
  } = useRequest(getFeedbackDetail, {
    manual: true,
  })

  const [form] = Form.useForm()
  const downFile = async () => {
    if (tableSelectRows?.length === 0) {
      message.error('请选择一条数据下载文件')
      return
    } else if (tableSelectRows?.length > 1) {
      message.error('只能同时下载一个文件')
      return
    } else if (!tableSelectRows[0]?.fileId) {
      message.error('该反馈没有可以下载的文件')
      return
    }
    const res = await downLoadFileItem({ fileId: tableSelectRows[0]?.fileId.match(/\d+/g)[0] })
    const suffix = tableSelectRows[0]?.fileName?.substring(
      tableSelectRows[0]?.fileName.lastIndexOf('.') + 1
    )
    const blob = new Blob([res], {
      type: `application/${suffix}`,
    })
    // for IE
    // @ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // @ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, tableSelectRows[0]?.fileName)
    } else {
      // for Non-IE
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', tableSelectRows[0]?.fileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
    message.success('下载成功')
  }
  const rightButton = () => {
    return (
      <div>
        <Space>
          {buttonJurisdictionArray?.includes('handle-feedback') && (
            <Button type="primary" onClick={() => dealEvent()}>
              <FormOutlined />
              处理
            </Button>
          )}
          <Button type="primary" onClick={() => downFile()}>
            <DownloadOutlined />
            下载
          </Button>
        </Space>
      </div>
    )
  }

  const dealEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看详情')
      return
    }
    setFeedBackDetailVisible(true)

    await getDetailData(tableSelectRows[0].id)
  }

  const leftSearchElement = () => {
    return (
      <div className={styles.searchGroup}>
        <TableSearch width="208px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入标题"
            enterButton
          />
        </TableSearch>

        <TableSearch label="筛选" width="900px" marginLeft="15px">
          <div className={styles.filter}>
            <EnumSelect
              enumList={SourceType}
              value={sourceType}
              className={styles.enumSelect}
              placeholder="来源"
              onChange={(value: any) => setSourceType(value)}
            />
            <EnumSelect
              enumList={Category}
              value={category}
              className={styles.enumSelect}
              placeholder="类别"
              onChange={(value: any) => setCategory(value)}
            />
            <EnumSelect
              enumList={Status}
              value={feedbackStatus}
              className={styles.enumSelect}
              placeholder="状态"
              onChange={(value: any) => setFeedbackStatus(value)}
            />
            <DatePicker
              value={beginDate}
              showTime={{ format: 'HH:mm' }}
              onChange={(value: any) => setBeginDate(value)}
              format="YYYY-MM-DD HH:mm"
              placeholder="开始日期"
            />
            <DatePicker
              value={endDate}
              showTime={{ format: 'HH:mm' }}
              onChange={(value: any) => setEndDate(value)}
              format="YYYY-MM-DD HH:mm"
              placeholder="结束日期"
            />
            <Button type="primary" className="mr7" onClick={() => search()}>
              查询
            </Button>
            <Button className="mr7" onClick={() => resetEvent()}>
              重置
            </Button>
          </div>
        </TableSearch>
      </div>
    )
  }

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search()
    }
  }
  //数据修改刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh()
    }
  }

  //重置搜索条件
  const resetEvent = () => {
    setSearchKeyWord('')
    setBeginDate(null)
    setEndDate(null)
    setCategory(undefined)
    setFeedbackStatus(undefined)
    setSourceType(undefined)
    tableFresh()
  }

  const columns = [
    {
      title: '来源',
      dataIndex: 'sourceType',
      index: 'sourceType',
      width: 150,
      render: (text: any, record: any) => {
        return record.sourceTypeText
      },
    },
    {
      title: '类别',
      dataIndex: 'category',
      index: 'category',
      width: 150,
      render: (text: any, record: any) => {
        return record.categoryText
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      index: 'title',
      width: 180,
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      index: 'companyName',
      width: 240,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      index: 'phone',
      width: 150,
    },
    {
      title: '反馈用户',
      dataIndex: 'createdBy',
      index: 'createdBy',
      width: 200,
      render: (text: any, record: any) => {
        return record.createdByUserName
      },
    },
    {
      title: '附件',
      dataIndex: 'fileName',
      index: 'fileName',
      width: 200,
      render: (text: any, record: any) => {
        return record.fileName
      },
    },
    {
      title: '反馈日期',
      dataIndex: 'createdOn',
      index: 'createdOn',
      width: 200,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD hh:mm')
      },
    },
    {
      title: '状态',
      dataIndex: 'processStatus',
      index: 'processStatus',
      width: 180,
      render: (text: any, record: any) => {
        return record.processStatus ? record.processStatusText : '待处理'
      },
    },
    {
      title: '处理日期',
      dataIndex: 'lastProcessDate',
      index: 'lastProcessDate',
      width: 200,
      render: (text: any, record: any) => {
        return record.lastProcessDate
          ? moment(record.lastProcessDate).format('YYYY-MM-DD hh:mm')
          : null
      },
    },
  ]

  const replyEvent = () => {
    form.validateFields().then(async (values) => {
      const dealData = tableSelectRows[0]
      const dealInfo = Object.assign(
        {
          feedbackId: dealData.id,
          content: dealData.content,
          processStatus: dealData.processStatus,
        },
        values
      )

      await handleFeedback(dealInfo)
      message.success('信息提交成功')
      tableFresh()
      setFeedBackDetailVisible(false)
    })
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearchElement}
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="反馈列表"
        url="/Feedback/GetPagedList"
        columns={columns}
        extractParams={{
          keyWord: searchKeyWord,
          sourceType: sourceType,
          category: category,
          status: feedbackStatus,
          startDate: beginDate,
          endDate: endDate,
        }}
      />
      <Modal
        maskClosable={false}
        title="反馈处理"
        width="650px"
        visible={feedbackDetailVisible}
        onCancel={() => setFeedBackDetailVisible(false)}
        okText="提交"
        onOk={replyEvent}
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Spin spinning={loading}>
          <Form form={form}>
            <FeedBackFormfrom detailData={detailData} />
          </Form>
        </Spin>
      </Modal>
    </PageCommonWrap>
  )
}

export default PlatFormFeedBack
