/* eslint-disable prefer-object-spread */
import { useControllableValue } from 'ahooks'
import { Form, message } from 'antd'
import { Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import ArrangeForm from '../arrange-form'
import { saveArrange } from '@/services/project-management/all-project'
import { uploadAuditLog } from '@/utils/utils'
import { baseUrl } from '@/services/common'
interface ArrangeModalProps {
  projectIds: string[]
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent?: () => void
  defaultSelectType?: string
  allotCompanyId?: string
  dataSourceType?: number
  setSourceTypeEvent?: Dispatch<SetStateAction<number | undefined>>
  groupId?: string
}

const ArrangeModal: React.FC<ArrangeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [companyInfo, setCompanyInfo] = useState<any>()
  const [allotInfo, setAllotInfo] = useState<any>()
  const {
    projectIds,
    finishEvent,
    defaultSelectType = '2',
    allotCompanyId,
    dataSourceType,
    setSourceTypeEvent,
    groupId,
  } = props
  const [selectType, setSelectType] = useState<string>('')

  const [form] = Form.useForm()

  const getCompanyInfo = (companyInfo: any) => {
    setCompanyInfo(companyInfo)
  }

  const saveInfo = () => {
    form.validateFields().then(async (values) => {
      if (selectType === '2') {
        const arrangeInfo = {
          allotType: Number(selectType),
          projectIds,
          surveyUser: values.surveyUser,
          designUser: values.designUser,
          costUser: values.costUser,
          designAssessUser1: values.designAssessUser1,
          designAssessUser2: values.designAssessUser2,
          designAssessUser3: values.designAssessUser3,
          designAssessUser4: values.designAssessUser4,
          costAuditUser1: values.costAuditUser1,
          costAuditUser2: values.costAuditUser2,
          costAuditUser3: values.costAuditUser3,
          allotCompanyGroup: values.allotCompanyGroup,
          allotOrganizeUser: values.allotOrganizeUser,
        }

        await saveArrange(arrangeInfo)
      }
      if (selectType === '1') {
        if (companyInfo === undefined) {
          message.error('请输入组织账户')
          return
        }
        const arrangeInfo = Object.assign(
          {
            allotType: selectType,
            projectIds,
            allotOrganizeUser: companyInfo.value,
            remark: allotInfo,
          },
          values
        )
        await saveArrange(arrangeInfo)
      }

      if (selectType === '3') {
        const arrangeInfo = Object.assign(
          {
            allotType: selectType,
            projectIds,
            allotCompanyGroup: '',
          },
          values
        )
        await saveArrange(arrangeInfo)
      }

      if (selectType === '4') {
        const arrangeInfo = Object.assign(
          {
            allotType: selectType,
            projectIds,
            surveyUser: '',
            designUser: '',
            designAssessUser1: '',
            designAssessUser2: '',
            designAssessUser3: '',
            designAssessUser4: '',
          },
          values
        )
        await saveArrange(arrangeInfo)
      }
      uploadAuditLog([
        {
          auditType: 2,
          eventType: 8,
          eventDetailType: '项目安排',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/Porject/AllotOuterAudit`,
        },
      ])
      message.success('操作成功！')
      finishEvent?.()
      form.resetFields()
      setState(false)
    })
  }

  const closeModalEvent = () => {
    setState(false)
    form.resetFields()
  }

  return (
    <Modal
      maskClosable={false}
      width={680}
      visible={state as boolean}
      title="项目安排"
      okText="提交"
      centered
      destroyOnClose
      onOk={() => saveInfo()}
      onCancel={() => {
        closeModalEvent()
        setSourceTypeEvent?.(undefined)
      }}
    >
      <Form form={form} preserve={false}>
        <ArrangeForm
          defaultType={defaultSelectType}
          allotCompanyId={allotCompanyId}
          getCompanyInfo={getCompanyInfo}
          getRemark={setAllotInfo}
          onChange={(value) => setSelectType(value)}
          dataSourceType={dataSourceType}
          groupId={groupId}
        />
      </Form>
    </Modal>
  )
}

export default ArrangeModal
