import { copyProject, getProjectInfo } from '@/services/project-management/all-project'
import { useControllableValue } from 'ahooks'
import { Button } from 'antd'
import { Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useRequest } from 'ahooks'
import moment, { Moment } from 'moment'
import CreateProjectForm from '../create-project-form'

interface CopyProjectModalProps {
  projectId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  areaId: string
  company: string
  engineerId: string
  companyName: string
  startTime?: Moment
  endTime?: Moment
  status: number
}

const CopyProjectModal: React.FC<CopyProjectModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [form] = Form.useForm()

  const {
    projectId,
    changeFinishEvent,
    areaId,
    company,
    status,
    engineerId,
    companyName,
    startTime,
    endTime,
  } = props

  const { data: projectInfo } = useRequest(() => getProjectInfo(projectId), {
    ready: !!projectId,
    refreshDeps: [projectId],
    onSuccess: (res) => {
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.startTime ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        disclosureRange:
          projectInfo?.dataSourceType === 2
            ? undefined
            : projectInfo?.dataSourceType === 1
            ? undefined
            : projectInfo?.disclosureRange,
        pileRange:
          projectInfo?.dataSourceType === 2
            ? undefined
            : projectInfo?.dataSourceType === 1
            ? undefined
            : projectInfo?.pileRange,
      })
    },
  })

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        await copyProject({
          copyProjectId: projectId,
          engineerId: engineerId,
          ...value,
          totalInvest: value.totalInvest ? value.totalInvest : 0,
          disclosureRange:
            value.disclosureRange === undefined || value.disclosureRange === undefined
              ? 0
              : value.disclosureRange,
          pileRange:
            value.pileRange === undefined || value.pileRange === undefined ? 0 : value.pileRange,
        })
        message.success('项目复制成功')
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

  return (
    <Modal
      maskClosable={false}
      centered
      title="复制项目"
      width={800}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
          保存
        </Button>,
      ]}
      onOk={() => edit()}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CreateProjectForm
          companyName={companyName}
          areaId={areaId}
          company={company}
          projectId={projectId}
          form={form}
          status={status}
          engineerStart={startTime}
          engineerEnd={endTime}
        />
      </Form>
    </Modal>
  )
}

export default CopyProjectModal
