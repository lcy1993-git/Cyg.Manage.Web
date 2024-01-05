import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { postSubmitProjectToQGC, stageEnum } from '@/services/project-management/all-project'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useControllableValue } from 'ahooks'
import { Button, Modal, Spin } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface SubmitProjectProps {
  projectId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const SubmitProjectModal: React.FC<SubmitProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [loading, setLoading] = useState<boolean>(false)
  const [stage, setStage] = useState<string>('2')
  const [result, setResult] = useState<{ isSuccess: boolean; info: string }>({
    isSuccess: false,
    info: '',
  })

  //获取阶段是否屏蔽开关
  const stageSelect = localStorage.getItem('stageSelect')

  const { projectId, finishEvent } = props

  const submitEvent = async () => {
    setLoading(true)
    await postSubmitProjectToQGC({ projectId: projectId, stage: Number(stage) })
      .then(() => {
        setResult({ isSuccess: true, info: '配网返回：项目提交成功' })
        setLoading(false)
        finishEvent?.()
      })
      .catch((err) => {
        setLoading(false)
        setResult({ isSuccess: false, info: err })
      })
  }

  const titleRender = () => {
    return (
      <>
        <ExclamationCircleOutlined className="mr7" style={{ color: '#faad14' }} />
        <span>项目提交</span>
      </>
    )
  }

  return (
    <Modal
      maskClosable={false}
      title={titleRender()}
      width={450}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => submitEvent()}>
          确认
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Spin spinning={loading} tip="项目提交中，请等待...">
        {stageSelect && Number(stageSelect) === 1 ? (
          <CyFormItem
            labelWidth={92}
            align="right"
            label="提交阶段"
            required
            rules={[{ required: true, message: '请选择提交阶段' }]}
          >
            <EnumSelect
              enumList={stageEnum}
              value={stage}
              onChange={(value: any) => setStage(value)}
            />
          </CyFormItem>
        ) : (
          <div className="ml20 mb10">确定将提交项目吗？</div>
        )}

        <div className="ml20" style={{ color: result.isSuccess ? '#0e7b3b' : '#ff4839' }}>
          {result.info}
        </div>
      </Spin>
    </Modal>
  )
}

export default SubmitProjectModal
