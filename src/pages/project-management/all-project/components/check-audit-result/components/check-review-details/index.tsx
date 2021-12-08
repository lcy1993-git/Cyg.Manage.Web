import { getReviewDetails } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface ReviewDetailsProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  projectId: string
}

const ReviewDetailsModal: React.FC<ReviewDetailsProps> = (props) => {
  const { projectId } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const { data: detailsData } = useRequest(() => getReviewDetails(projectId, true))

  const previewEvent = () => {
    // console.log(111)
  }

  const checkDetailEvent = () => {}

  return (
    <Modal
      maskClosable={false}
      title="查看评审详情"
      bodyStyle={{ padding: '0px 20px', height: '650px' }}
      destroyOnClose
      width="70%"
      visible={state as boolean}
      okText="确定"
      cancelText="取消"
      onCancel={() => setState(false)}
      footer={false}
    />
  )
}

export default ReviewDetailsModal
