/* eslint-disable prefer-object-spread */
import { useControllableValue } from 'ahooks'
import { Form, message } from 'antd'
import { Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import ArrangeForm from '../arrange-form'
import { saveArrange } from '@/services/project-management/all-project'
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
        {/* <Tabs defaultActiveKey="1" onChange={(key) => setTabActiveKey(key)}> */}
        {/* <TabPane tab="项目安排" key="1"> */}
        <ArrangeForm
          defaultType={defaultSelectType}
          allotCompanyId={allotCompanyId}
          getCompanyInfo={getCompanyInfo}
          getRemark={setAllotInfo}
          onChange={(value) => setSelectType(value)}
          dataSourceType={dataSourceType}
          groupId={groupId}
        />
        {/* </TabPane> */}
        {/* {(selectType === '2' || selectType === '4') && (
            <TabPane tab="外审安排" key="2">
              {tabActiveKey === '2' ? (
                <SelectAddListForm
                  onSetPassArrangeStatus={(flag) => setIsPassArrangePeople(flag)}
                  onChange={(people) => setArrangePeople(people)}
                />
              ) : null}
            </TabPane>
          )}
          {(selectType === '1' || selectType === '3') && (
            <TabPane tab="外审安排" disabled key="2"></TabPane>
          )} */}
        {/* </Tabs> */}
      </Form>
    </Modal>
  )
}

export default ArrangeModal
