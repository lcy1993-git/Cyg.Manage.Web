import { getFileStream, getReviewDetails } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { message, Modal, Table, Tabs } from 'antd'
import Item from 'antd/lib/list/Item'
import { Image } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import styles from './index.less'
import { divide } from '@umijs/deps/compiled/lodash'
interface ReviewDetailsProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  projectId: string
}

const { TabPane } = Tabs
const ReviewDetailsModal: React.FC<ReviewDetailsProps> = (props) => {
  const { projectId } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [checkScreenShotVisible, setCheckScreenShotVisible] = useState<boolean>(false)
  const [imageData, setImageData] = useState<any>()
  const { data: detailsData } = useRequest(() => getReviewDetails(projectId, true))

  const detailColumns = [
    {
      title: '序号',
      width: 50,
      render: (text: any, record: any, index: number) => `${index + 1}`,
      align: 'center' as 'center',
    },
    {
      dataIndex: 'nodeCountIndex',
      index: 'nodeCountIndex',
      title: '版本',
      width: 80,
    },
    {
      dataIndex: 'expectExecutorNickName',
      index: 'expectExecutorNickName',
      title: '评审人',
      width: 150,
    },
    {
      dataIndex: 'executionTime',
      index: 'executionTime',
      title: '时间',
      width: 220,
    },
    {
      dataIndex: 'opinionContent',
      index: 'opinionContent',
      title: '批注意见',
      // width: 240,
    },
    {
      dataIndex: 'screenshots',
      index: 'screenshots',
      title: '截图',
      width: 120,
      render: (text: any, record: any) => {
        return record?.screenshots ? (
          <span
            className={styles.checkTitle}
            onClick={() => screenShotsEvent(record?.screenshots, record.extension)}
          >
            查看
          </span>
        ) : (
          <span
            className={styles.noScreenShots}
            onClick={() => screenShotsEvent(record?.screenshots, record.extension)}
          >
            查看
          </span>
        )
      },
    },
  ]

  //截图展示
  const screenShotsEvent = async (url: string, extension: string) => {
    // setScreenShotUrl(url)

    // await getFileStream({ url, extension }).then((res) => {
    //   setImageData(res)
    // })
    setImageData(url)
    setCheckScreenShotVisible(true)
  }
  // console.log(imageData, '333')

  const getCurrentTabData = (tabType: number) => {
    return detailsData
      ?.map((item: any) => {
        if (item.auditSubType === tabType) {
          return item.steps
        }
      })
      .filter(Boolean)
      .flat(1)
  }

  //列表数据处理
  const handleData = (data: any) => {
    return data
      ?.map((item: any) => {
        return item.reviewOpinions.length > 0
          ? item.reviewOpinions?.map((ite: any) => {
              return {
                nodeCountIndex: item.nodeCountIndex,
                expectExecutorNickName: item.expectExecutorNickName,
                executionTime: moment(item.executionTime).format('YYYY-MM-DD-HH-MM-SS'),
                opinionContent: ite.opinionContent,
                screenshots: ite.resource.screenShotFile.url,
                extension: ite.resource.screenShotFile.extension,
              }
            })
          : null
      })
      .filter(Boolean)
      .flat(1)
  }

  const handlerUpload = async (url: string, extension: string) => {
    const res = await getFileStream({ url, extension })
    // const suffix = fileName?.substring(fileName.lastIndexOf('.') + 1)

    const blob = new Blob([res], {
      type: `image/jpeg`,
    })
    // for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, '11')
    } else {
      // for Non-IE
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', '11')
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
    message.success('下载成功')
  }

  return (
    <>
      <Modal
        maskClosable={false}
        title="查看评审详情"
        bodyStyle={{ padding: '0px', height: '650px' }}
        destroyOnClose
        width="70%"
        visible={state as boolean}
        okText="确定"
        cancelText="取消"
        onCancel={() => setState(false)}
        footer={false}
      >
        <div className={styles.reviewDetailsTab}>
          <Tabs className="normalTabs" type="card">
            <TabPane tab="设计校对" key="jd">
              <Table
                size="middle"
                // locale={{
                //   emptyText: <EmptyTip className="pt20 pb20" />,
                // }}
                dataSource={handleData(getCurrentTabData(1))}
                bordered={true}
                pagination={false}
                columns={detailColumns}
              />
            </TabPane>
            <TabPane tab="设计校核" key="jh">
              <Table
                size="middle"
                // locale={{
                //   emptyText: <EmptyTip className="pt20 pb20" />,
                // }}
                dataSource={handleData(getCurrentTabData(2))}
                bordered={true}
                pagination={false}
                columns={detailColumns}
              />
            </TabPane>
            <TabPane tab="设计审核" key="sh">
              <Table
                size="middle"
                // locale={{
                //   emptyText: <EmptyTip className="pt20 pb20" />,
                // }}
                dataSource={handleData(getCurrentTabData(3))}
                bordered={true}
                pagination={false}
                columns={detailColumns}
              />
            </TabPane>
            <TabPane tab="设计审定" key="sd">
              <Table
                size="middle"
                // locale={{
                //   emptyText: <EmptyTip className="pt20 pb20" />,
                // }}
                dataSource={handleData(getCurrentTabData(4))}
                bordered={true}
                pagination={false}
                columns={detailColumns}
              />
            </TabPane>
            <TabPane tab="外审" key="ws">
              <Table
                size="middle"
                // locale={{
                //   emptyText: <EmptyTip className="pt20 pb20" />,
                // }}
                dataSource={handleData(getCurrentTabData(0))}
                bordered={true}
                pagination={false}
                columns={detailColumns}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
      <Modal
        title="截图查看"
        maskClosable={false}
        visible={checkScreenShotVisible}
        onCancel={() => setCheckScreenShotVisible(false)}
        footer=""
        width="650px"
      >
        <img src={imageData} alt="" width="500px" height="500px" />
        {/* <Image width={200} src={screenShotUrl} /> */}
      </Modal>
    </>
  )
}

export default ReviewDetailsModal
