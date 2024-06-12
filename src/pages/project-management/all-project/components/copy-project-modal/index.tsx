import { baseUrl } from '@/services/common'
import { copyProject, getProjectInfo } from '@/services/project-management/all-project'
import { uploadAuditLog } from '@/utils/utils'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, message, Modal, Spin } from 'antd'
import moment, { Moment } from 'moment'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  const [warehouseInfo, setWarehouseInfo] = useState<any[]>([])

  //获取资源库选项
  const [libData, setLibData] = useState<any[]>([])
  const [form] = Form.useForm()

  const {
    projectId,
    changeFinishEvent,
    areaId,
    company,
    engineerId,
    companyName,
    startTime,
    endTime,
  } = props

  //获取现场数据来源是否仅勘察
  const surveyOnly = localStorage.getItem('surveyOnly')

  const {
    data: projectInfo,
    run,
    loading,
  } = useRequest(() => getProjectInfo(projectId), {
    onSuccess: () => {
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.startTime ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        dataSourceType:
          surveyOnly && Number(surveyOnly) === 1 && projectInfo?.dataSourceType !== 0
            ? undefined
            : projectInfo?.dataSourceType,

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
            ? undefined
            : projectInfo?.warehouseId,
        disclosureRange:
          surveyOnly && Number(surveyOnly) === 1 && projectInfo?.dataSourceType !== 0
            ? undefined
            : projectInfo?.dataSourceType === 0
            ? projectInfo?.disclosureRange
            : undefined,
        pileRange:
          surveyOnly && Number(surveyOnly) === 1 && projectInfo?.dataSourceType !== 0
            ? undefined
            : projectInfo?.dataSourceType === 0
            ? projectInfo?.pileRange
            : undefined,
      })
    },
  })

  const edit = () => {
    setRequestLoading(true)
    form
      .validateFields()
      .then(async (value) => {
        try {
          await copyProject({
            copyProjectId: projectId,
            engineerId: engineerId,
            ...value,
            totalInvest: value.totalInvest ? value.totalInvest : 0,
            disclosureRange: value.disclosureRange ? value.disclosureRange : 0,
            pileRange: value.pileRange ? value.pileRange : 0,
          })
          message.success('项目复制成功')
          uploadAuditLog([
            {
              auditType: 2,
              eventType: 9,
              eventDetailType: '项目复制',
              executionResult: '成功',
              auditLevel: 2,
              serviceAdress: `${baseUrl.project}/Porject/Copy`,
            },
          ])
          setState(false)
          setRequestLoading(false)
          form.resetFields()
          changeFinishEvent?.()
        } catch (msg) {
          console.error(msg)
          setRequestLoading(false)
          uploadAuditLog([
            {
              auditType: 2,
              eventType: 9,
              eventDetailType: '项目复制',
              executionResult: '失败',
              auditLevel: 2,
              serviceAdress: `${baseUrl.project}/Porject/Copy`,
            },
          ])
        } finally {
          setRequestLoading(false)
        }
      })
      .catch(() => {
        setRequestLoading(false)
      })
  }

  useEffect(() => {
    if (state && warehouseInfo && libData) {
      if (warehouseInfo.length && libData.length) {
        run()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, warehouseInfo, libData])

  return (
    <Modal
      maskClosable={false}
      centered
      title="复制项目"
      width={800}
      visible={state as boolean}
      bodyStyle={{ height: '780px', overflowY: 'auto' }}
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
        <Spin spinning={loading}>
          <CreateProjectForm
            companyName={companyName}
            areaId={areaId}
            company={company}
            projectId={projectId}
            form={form}
            status={1}
            engineerStart={startTime}
            engineerEnd={endTime}
            isEdit={true}
            getWarehouseData={setWarehouseInfo}
            getLibData={setLibData}
          />
        </Spin>
      </Form>
    </Modal>
  )
}

export default CopyProjectModal
