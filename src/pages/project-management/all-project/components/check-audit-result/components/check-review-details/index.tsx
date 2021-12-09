import { getFileStream, getReviewDetails } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Table, Tabs } from 'antd'
import Item from 'antd/lib/list/Item'
import { Image } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import styles from './index.less'
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
  const [screenShotUrl, setScreenShotUrl] = useState<string>('')
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
      width: 150,
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
    setScreenShotUrl(url)
    await getFileStream({ url, extension })
    setCheckScreenShotVisible(true)
  }

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
        <Image width={200} src={screenShotUrl} />
      </Modal>
    </>
  )
}

export default ReviewDetailsModal
