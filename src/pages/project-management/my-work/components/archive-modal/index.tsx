import { useControllableValue } from 'ahooks'
import { Button, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import { LayerTypes } from '@/services/backstage-config/visual-config'
import EnumSelect from '@/components/enum-select'
import { archiveToHistoryGrid } from '@/services/plan-manage/plan-manage'

interface ArchiveProps {
  projectId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ArchiveModal: React.FC<ArchiveProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [lineId, setLineId] = useState<string>()
  const [layerType, setLayerType] = useState<number>()

  const { projectId, finishEvent } = props

  const archiveEvent = async () => {
    await archiveToHistoryGrid({
      lineId: lineId,
      layerType: layerType,
      projectId: projectId,
    })
    message.success('归档成功')
    setState(false)
    finishEvent?.()
  }

  return (
    <Modal
      maskClosable={false}
      title="网架归档"
      width={650}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => archiveEvent()}>
          确定
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <CyFormItem
        labelWidth={92}
        align="right"
        label="图层"
        required
        rules={[{ required: true, message: '请选择图层' }]}
      >
        <EnumSelect
          enumList={LayerTypes}
          value={layerType}
          placeholder="请选择图层"
          onChange={(value: any) => setLayerType(value)}
        />
      </CyFormItem>
      <CyFormItem
        labelWidth={92}
        align="right"
        label="主线路"
        required
        rules={[{ required: true, message: '请选择历史网架主线路' }]}
      >
        <UrlSelect
          titlekey="name"
          valuekey="id"
          url="/Line/GetLineItems"
          placeholder="请选择主线路"
          requestSource="grid"
          value={lineId}
          onChange={(value: any) => {
            setLineId(value)
          }}
          allowClear
        />
      </CyFormItem>
    </Modal>
  )
}

export default ArchiveModal
