import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { isArray } from 'lodash'
import React from 'react'

interface ModalConfirmProps {
  title?: string
  content?: string
  changeEvent: () => void
  selectData?: any[] | object
  contentSlot?: () => React.ReactNode
  disabled?: boolean
}

const ModalConfirm: React.FC<ModalConfirmProps> = (props) => {
  const {
    title = '删除',
    content = '确定删除选中项吗？',
    changeEvent,
    selectData,
    contentSlot,
    disabled = false,
  } = props

  const confirmEvent = () => {
    if (selectData && isArray(selectData) && selectData.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: contentSlot ? contentSlot?.() : content,
      okText: '确认',
      cancelText: '取消',
      onOk: changeEvent,
    })
  }

  return (
    <>
      <Button className="mr7" onClick={() => confirmEvent()} disabled={disabled}>
        <DeleteOutlined />
        {title}
      </Button>
    </>
  )
}

export default ModalConfirm
