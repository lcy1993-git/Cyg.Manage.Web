import { recordVersionData } from '@/pages/visualization-results/history-grid/service'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Input, message, Modal } from 'antd'
import _ from 'lodash'
import React, { ChangeEventHandler, useEffect, useState } from 'react'
import styles from './index.less'

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
  const { UIStatus, dispatch } = useHistoryGridContext()
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
    dispatch({
      type: 'changeMode',
      payload: 'record',
    })
    const data = _.cloneDeep(UIStatus)
    data.drawing = false
    data.recordVersion = 'hide'
    dispatch({
      type: 'changeUIStatus',
      payload: data,
    })
  }
  const handleCancel = () => {
    setRemark('')
    const data = _.cloneDeep(UIStatus)
    data.recordVersion = 'hide'
    dispatch({
      type: 'changeUIStatus',
      payload: data,
    })
  }
  const remarkChange = (e: ChangeEventHandler<HTMLTextAreaElement>) => {
    // @ts-ignore
    setRemark(e.target.value)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveVersion = async () => {
    setRemark('')
    handleCancel()
    updateHistoryVersion()
  }
  useEffect(() => {
    if (recordVersion === 'save') {
      saveVersion().then()
    }
  }, [recordVersion, saveVersion])
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
            value={remark}
            maxLength={200}
            showCount={true}
            // @ts-ignore
            onChange={remarkChange}
          />
        </div>
      </Modal>
    </div>
  )
}

export default RecordHistoryVersion
