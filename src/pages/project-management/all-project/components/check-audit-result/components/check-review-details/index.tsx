import { getReviewDetails } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Table, Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
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

  const { data: detailsData } = useRequest(() => getReviewDetails(projectId, true))

  const previewEvent = () => {
    // console.log(111)
  }

  const checkDetailEvent = () => {}

  const hasMapTableColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '序号',
      width: 180,
    },
    {
      dataIndex: 'nodeCountIndex',
      index: 'nodeCountIndex',
      title: '版本',
      width: 180,
    },
    {
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      title: '订单净价',
      width: 80,
    },
    {
      dataIndex: 'area',
      index: 'area',
      title: '区域',
      width: 80,
    },
    {
      dataIndex: 'demandCompany',
      index: 'demandCompany',
      title: '需求公司',
      width: 140,
    },
    {
      dataIndex: 'measurementUnit',
      index: 'measurementUnit',
      title: '计量单位',
      width: 80,
    },
    {
      dataIndex: 'howToCreate',
      index: 'howToCreate',
      title: '创建方式',
      width: 80,
      render: (text: any, record: any) => {
        return record.howToCreateText
      },
    },
  ]

  // console.log(detailsData, '1')

  return (
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
              // dataSource={hasMapTableShowData}
              bordered={true}
              rowKey={'id'}
              pagination={false}
              // rowSelection={{
              //   type: 'checkbox',
              //   columnWidth: '38px',
              //   selectedRowKeys: mapTableSelectArray,
              //   ...hasMapSelection,
              // }}
              columns={hasMapTableColumns}
            />
          </TabPane>
          <TabPane tab="设计校核" key="jh"></TabPane>
          <TabPane tab="设计审核" key="sh"></TabPane>
          <TabPane tab="设计审定" key="sd"></TabPane>
          <TabPane tab="外审" key="ws"></TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}

export default ReviewDetailsModal
