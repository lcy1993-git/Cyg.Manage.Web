import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'
import { Input, message, Modal } from 'antd'
import styles from './index.less'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  recordVersionData,
  SaveHistoryData,
} from '@/pages/visualization-results/history-grid/service'
import _ from 'lodash'

export interface ElectricalEquipmentForm {
  name: string
  id: string
  lat: number
  lng: number
  type: string
  remark: string
  length?: number
  level?: number | string
}

interface Props {
  updateHistoryVersion: () => void
}

const RecordHistoryVersion: React.FC<Props> = (props) => {
  const { updateHistoryVersion } = props
  const { UIStatus, dispatch,historyDataSource } = useHistoryGridContext()
  const { recordVersion } = UIStatus

  const [remark, setRemark] = useState<string>('')
  const handleOk = async () => {
    const res = await recordVersionData({
      force: false,
      remark: remark,
    })
    if (res.code === 5000) {
      message.warning(res.message)
      return
    }
    message.success('保存成功')
    setRemark('')
    handleCancel()
  }
  const handleCancel = () => {
    const data = _.cloneDeep(UIStatus)
    data.recordVersion = 'hide'
    dispatch({
      type: 'changeUIStatus',
      payload: data,
    })
  }
  const remarkChange = (e: ChangeEventHandler<HTMLTextAreaElement>) => {
    setRemark(e.target.value)
  }
  const saveVersion = async () => {
    const data = _.cloneDeep(historyDataSource)
    await SaveHistoryData(data)
    message.success('保存成功')
    setRemark('')
    handleCancel()
    updateHistoryVersion()
  }
  useEffect(() => {
    if (recordVersion === 'save') {
      saveVersion()
    }
  }, [recordVersion])
  return (
    <div>
      <Modal
        title="记录版本"
        width={550}
        visible={recordVersion === 'record'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.recordWarning}>
          <ExclamationCircleOutlined
            style={{
              color: '#FFC400',
              fontSize: '22px',
              position: 'relative',
              top: '3px',
            }}
          />{' '}
          &emsp;确认记录当前版本?
        </div>
        <div className={styles.remark}>
          <div style={{ width: '50px' }}>备注</div>
          <Input.TextArea
            style={{ width: '400' }}
            rows={3}
            maxLength={200}
            onChange={remarkChange}
          />
        </div>
      </Modal>
    </div>
  )
}

export default RecordHistoryVersion
