import { getProjectInfo, inheritProject } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import { isNumber } from 'lodash'
import moment, { Moment } from 'moment'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CreateProjectForm from '../create-project-form'

interface ProjectInheritModalProps {
  projectId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  areaId: string
  company: string
  companyName?: string
  status: number
  startTime?: Moment
  endTime?: Moment
  engineerId: string
  pointVisible?: boolean
}

const ProjectInheritModal: React.FC<ProjectInheritModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [form] = Form.useForm()

  const {
    projectId,
    changeFinishEvent,
    areaId,
    company,
    companyName,
    startTime,
    endTime,
    engineerId,
    // pointVisible,
  } = props

  const { data: projectInfo, run } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
    onSuccess: () => {
      const { dataSourceType, disclosureRange, pileRange } = projectInfo!
      const handleDisclosureRange =
        dataSourceType === 2 ? '“免勘察”项目，免设置此条目' : disclosureRange
      const handlePileRange = dataSourceType === 2 ? '“免勘察”项目，免设置此条目' : pileRange
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        disclosureRange: handleDisclosureRange,
        pileRange: handlePileRange,
        dataSourceType: projectInfo?.dataSourceType === 1 ? 0 : projectInfo?.dataSourceType,
        stage: isNumber(projectInfo?.stage) && projectInfo ? projectInfo?.stage + 1 : 1,
      })
    },
  })

  useEffect(() => {
    if (state) {
      run()
    }
  }, [state])

  const sureProjectInheritEvent = () => {
    // TODO 做保存接口
    form.validateFields().then(async (value) => {
      try {
        await inheritProject({
          inheritProjectId: projectId,
          engineerId,
          ...value,
          totalInvest: value.totalInvest ? value.totalInvest : 0,
          disclosureRange:
            value.disclosureRange === '“免勘察”项目，免设置此条目' ||
            value.disclosureRange === '“导入”项目，免设置此条目'
              ? 0
              : value.disclosureRange,
          pileRange:
            value.pileRange === '“免勘察”项目，免设置此条目' ||
            value.pileRange === '“导入”项目，免设置此条目'
              ? 0
              : value.pileRange,
        })
        message.success('项目已开始进行继承')
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
      title="项目继承"
      centered
      width={800}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={requestLoading}
          onClick={() => sureProjectInheritEvent()}
        >
          保存
        </Button>,
      ]}
      onOk={() => sureProjectInheritEvent()}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CreateProjectForm
          isInherit={true}
          areaId={areaId}
          company={company}
          companyName={companyName}
          status={1}
          projectId={projectId}
          engineerStart={startTime}
          engineerEnd={endTime}
          form={form}
        />
      </Form>
    </Modal>
  )
}

export default ProjectInheritModal
