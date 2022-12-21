import { editProject, getProjectInfo } from '@/services/project-management/all-project'
import { useControllableValue } from 'ahooks'
import { Button, Spin } from 'antd'
import { Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import moment, { Moment } from 'moment'
import CreateProjectForm from '../create-project-form'

interface EditProjectProps {
  projectId: string
  visible: boolean
  pointVisible?: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  setInheritState?: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  areaId: string
  company: string
  companyName?: string
  status: number
  startTime?: Moment
  endTime?: Moment
}

const EditProjectModal: React.FC<EditProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [warehouseInfo, setWarehouseInfo] = useState<any[]>([])
  const [form] = Form.useForm()

  const {
    projectId,
    changeFinishEvent,
    areaId,
    company,
    companyName,
    status,
    startTime,
    endTime,
    pointVisible,
    setInheritState,
  } = props

  const {
    data: projectInfo,
    run,
    loading,
  } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        powerSupply: projectInfo?.powerSupply ? projectInfo?.powerSupply : '无',
        warehouseId:
          warehouseInfo.findIndex((item: any) => item.value === projectInfo?.warehouseId) === -1
            ? undefined
            : projectInfo?.warehouseId,
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

  useEffect(() => {
    if (state && warehouseInfo) {
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, warehouseInfo])

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        await editProject({
          id: projectId,
          ...value,
          totalInvest: value.totalInvest ? value.totalInvest : 0,
          disclosureRange:
            value.disclosureRange === undefined || value.disclosureRange === undefined
              ? 0
              : value.disclosureRange,
          pileRange:
            value.pileRange === undefined || value.pileRange === undefined ? 0 : value.pileRange,
        })
        message.success('项目信息更新成功')
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
      title="编辑项目信息"
      centered
      width={800}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button
          key="cancle"
          onClick={() => {
            setInheritState?.(false)
            setState(false)
          }}
        >
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
          保存
        </Button>,
      ]}
      onOk={() => edit()}
      onCancel={() => {
        setInheritState?.(false)
        setState(false)
      }}
    >
      <Form form={form} preserve={false}>
        <Spin spinning={loading}>
          <CreateProjectForm
            pointVisible={pointVisible}
            areaId={areaId}
            company={company}
            companyName={companyName}
            status={status}
            projectId={projectId}
            engineerStart={startTime}
            isEdit={projectInfo?.canEditStage}
            engineerEnd={endTime}
            form={form}
            getWarehouseData={setWarehouseInfo}
            // onLoadingFinish={() => setLoading(true)}
          />
        </Spin>
      </Form>
    </Modal>
  )
}

export default EditProjectModal
