import {
  editProject,
  editQGCProject,
  getProjectInfo,
} from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, message, Modal, Spin } from 'antd'
import moment, { Moment } from 'moment'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CreateProjectForm from '../create-project-form'
import EditProjectForm from '../edit-project-form'
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
  canEditQgc?: boolean
}

const EditProjectModal: React.FC<EditProjectProps> = (props) => {
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
    companyName,
    status,
    startTime,
    endTime,
    pointVisible,
    setInheritState,
    canEditQgc,
  } = props
  const {
    data: projectInfo,
    run,
    loading,
  } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
    onSuccess: (res) => {
      let obj = {}
      try {
        //@ts-ignore
        obj = JSON.parse(projectInfo?.projectExt)
      } catch (error) {}
      form.setFieldsValue({
        ...projectInfo,
        ...obj,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        powerSupply: projectInfo?.powerSupply ? projectInfo?.powerSupply : '无',
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
    if (state && warehouseInfo && libData) {
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, warehouseInfo, libData])

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        // console.log(canEditQgc, '全过程')
        if (canEditQgc) {
          // qgc项目

          await editQGCProject({
            id: projectId,
            ...value,
            totalInvest: value.totalInvest ? value.totalInvest : 0,
            disclosureRange: value.disclosureRange ? value.disclosureRange : 0,
            pileRange: value.pileRange ? value.pileRange : 0,
          })
        } else {
          await editProject({
            id: projectId,
            ...value,
            totalInvest: value.totalInvest ? value.totalInvest : 0,
            disclosureRange: value.disclosureRange ? value.disclosureRange : 0,
            pileRange: value.pileRange ? value.pileRange : 0,
          })
        }
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
      bodyStyle={{ height: '780px', overflowY: 'auto' }}
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
          {canEditQgc ? (
            <EditProjectForm
              pointVisible={pointVisible}
              areaId={areaId}
              company={company}
              companyName={companyName}
              status={status}
              projectId={projectId}
              engineerStart={startTime}
              canEditStage={projectInfo?.canEditStage}
              isEdit={true}
              engineerEnd={endTime}
              form={form}
              getWarehouseData={setWarehouseInfo}
              getLibData={setLibData}
              isDisabled={true}
              // onLoadingFinish={() => setLoading(true)}
            />
          ) : (
            <CreateProjectForm
              pointVisible={pointVisible}
              areaId={areaId}
              company={company}
              companyName={companyName}
              status={status}
              projectId={projectId}
              engineerStart={startTime}
              canEditStage={projectInfo?.canEditStage}
              isEdit={true}
              engineerEnd={endTime}
              form={form}
              getWarehouseData={setWarehouseInfo}
              getLibData={setLibData}
              // onLoadingFinish={() => setLoading(true)}
            />
          )}
        </Spin>
      </Form>
    </Modal>
  )
}

export default EditProjectModal
