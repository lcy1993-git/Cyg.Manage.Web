import { addProject, getEngineerInfo } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, useState } from 'react'
import CreateProjectForm from '../create-project-form'

interface AddProjectProps {
  engineerId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  areaId: string
  company: string
  changeFinishEvent: () => void
  companyName?: string
}

const AddProjectModal: React.FC<AddProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [form] = Form.useForm()

  const { engineerId, areaId, company, changeFinishEvent, companyName } = props
  const { data: engineerInfo } = useRequest(() => getEngineerInfo(engineerId), {
    ready: !!engineerId,
    refreshDeps: [engineerId],
  })

  const addProjectEvent = () => {
    form.validateFields().then(async (value) => {
      try {
        await addProject({
          engineerId,
          ...value,
          totalInvest: value.totalInvest ? value.totalInvest : 0,
          disclosureRange: value.disclosureRange ? value.disclosureRange : 0,
        })

        message.success('项目新增成功')
        setState(false)

        form.resetFields()
        changeFinishEvent?.()
      } catch (msg) {
        console.error(msg)
      } finally {
        setRequestLoading(false)
      }
    })
  }

  const modalCloseEvent = () => {
    setState(false)
    form.resetFields()
  }

  return (
    <Modal
      maskClosable={false}
      title="新增项目"
      centered
      width={780}
      visible={state as boolean}
      bodyStyle={{ height: '780px', overflowY: 'auto' }}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => modalCloseEvent()}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={requestLoading}
          onClick={() => addProjectEvent()}
        >
          保存
        </Button>,
      ]}
      onOk={() => addProjectEvent()}
      onCancel={() => modalCloseEvent()}
    >
      <Form form={form} preserve={false}>
        <CreateProjectForm
          companyName={companyName}
          areaId={areaId}
          company={company}
          form={form}
          engineerStart={moment(engineerInfo?.startTime)}
          engineerEnd={moment(engineerInfo?.endTime)}
          status={1}
          isEdit={true}
          isAdd={true}
        />
      </Form>
    </Modal>
  )
}

export default AddProjectModal
