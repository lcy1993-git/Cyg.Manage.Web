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
  const [libData, setLibData] = useState<any[]>([])
  const [warehouseInfo, setWarehouseInfo] = useState<any[]>([])
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
      const handleDisclosureRange = dataSourceType === 0 ? disclosureRange : undefined
      const handlePileRange = dataSourceType === 0 ? pileRange : undefined

      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,

        inventoryOverviewId:
          libData.findIndex((item: any) => item.value === projectInfo?.libId) === -1
            ? undefined
            : projectInfo?.inventoryOverviewId,
        libId:
          libData.findIndex((item: any) => item.value === projectInfo?.libId) === -1
            ? undefined
            : projectInfo?.libId,

        warehouseId:
          warehouseInfo.findIndex((item: any) => item.value === projectInfo?.warehouseId) === -1
            ? 'none'
            : projectInfo?.warehouseId,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        disclosureRange: handleDisclosureRange,
        pileRange: handlePileRange,
        dataSourceType: 0,
        stage: isNumber(projectInfo?.stage) && projectInfo ? projectInfo?.stage + 1 : 1,
      })
    },
  })

  useEffect(() => {
    if (state && warehouseInfo && libData) {
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, warehouseInfo, libData])

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
          getWarehouseData={setWarehouseInfo}
          getLibData={setLibData}
          engineerEnd={endTime}
          form={form}
        />
      </Form>
    </Modal>
  )
}

export default ProjectInheritModal
