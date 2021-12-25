import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect } from 'react'

interface ModalConfirmProps {
  title?: string
  content?: string
  changeEvent: () => void
  selectData?: any[] | object
  contentSlot?: () => React.ReactNode
}

const ModalConfirm: React.FC<ModalConfirmProps> = (props) => {
  const {
    title = '删除',
    content = '确定删除选中项吗？',
    changeEvent,
    selectData,
    contentSlot,
  } = props

  const confirmEvent = () => {
    if (selectData && isArray(selectData) && selectData.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }
    Modal.confirm({
      title: '提示',
      bodyStyle: { padding: 0 },
      icon: <ExclamationCircleOutlined />,
      content: contentSlot ? contentSlot?.() : content,
      okText: '确认',
      cancelText: '取消',
      onOk: changeEvent,
    })
  }

  return (
    <>
      <Button className="mr7" onClick={() => confirmEvent()}>
        <DeleteOutlined />
        {title}
      </Button>
    </>
  )
}

export default ModalConfirm
