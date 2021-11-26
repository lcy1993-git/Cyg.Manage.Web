import {
  getHistoriesById,
  recordVersionData,
} from '@/pages/visualization-results/history-grid/service'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Input, message, Modal } from 'antd'
import _ from 'lodash'
import React, { ChangeEventHandler, useEffect, useState } from 'react'
import styles from './index.less'
import { useMount } from 'ahooks'

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
  const { UIStatus, dispatch, historyDataSource, currentGridData } = useHistoryGridContext()
  const { recordVersion } = UIStatus
  const [remark, setRemark] = useState<string>('')
  const [change, setChange] = useState<boolean>(false)
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
    dispatch({
      type: 'changeMode',
      payload: 'record',
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
    if (recordVersion === 'record') {
      compareNoChange()
    }
  }, [recordVersion, saveVersion])
  const compareNoChange = async () => {
    const data = await getHistoriesById(currentGridData?.id as string)
    data['id'] = currentGridData?.id
    setChange(JSON.stringify(data) !== JSON.stringify(historyDataSource))
  }
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
          &emsp;
          <span style={{ display: !change ? 'inline-block' : 'none' }}>
            检测到当前版本无数据变化，
          </span>
          确认记录当前版本?
        </div>
        <div className={styles.remark}>
          <div style={{ width: '50px' }}>备注</div>
          <Input.TextArea
            style={{ width: '400' }}
            rows={3}
            value={remark}
            maxLength={200}
            // @ts-ignore
            onChange={remarkChange}
          />
        </div>
      </Modal>
    </div>
  )
}

export default RecordHistoryVersion
