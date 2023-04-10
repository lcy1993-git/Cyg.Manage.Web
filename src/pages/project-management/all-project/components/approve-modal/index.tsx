import { useControllableValue, useUpdateEffect } from 'ahooks'
import { Form, Input, message, Modal, Radio } from 'antd'
import React, { Dispatch, useState } from 'react'
import { SetStateAction } from 'react'
import CyFormItem from '@/components/cy-form-item'
import { approveProject } from '@/services/project-management/all-project'
import { useGetSelectData } from '@/utils/hooks'
// import styles from './index.less';

interface ReportApproveParams {
  projectIds: string[] | string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ApproveModal: React.FC<ReportApproveParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [isPass, setIsPass] = useState<boolean>(true)
  const [isSaveAccount, setIsSaveAccount] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { projectIds, finishEvent } = props
  const { data: approveUser = [] } = useGetSelectData({
    url: '/ProjectApproveGroup/GetApproveUsers',
  })
  //   const [defaultUser, setDefaultUser] = useState<string>('')
  useUpdateEffect(() => {
    form.setFieldsValue({
      approveUserId: approveUser[0].value,
    })
  }, [approveUser])

  const approveEvent = async () => {
    form.validateFields().then(async (values) => {
      const submitInfo = {
        projectIds: projectIds,
        isApproved: isPass,
        isReserveIdentity: isSaveAccount,
        ...values,
      }
      await approveProject(submitInfo)
    })
    message.success('审批完成')
    finishEvent?.()
    setState(false)
  }

  return (
    <Modal
      maskClosable={false}
      title="立项审核"
      width="40%"
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => approveEvent()}
      cancelText="取消"
      okText="确认"
    >
      <Form form={form}>
        {/* <CyFormItem label="立项审批是否通过" labelWidth={124}> */}
        <div style={{ paddingBottom: '20px' }}>立项审批是否通过</div>
        <Radio.Group onChange={(e) => setIsPass(e.target.value)} value={isPass}>
          <Radio value={true} style={{ paddingRight: '240px' }}>
            通过
          </Radio>
          <Radio value={false}>退回</Radio>
        </Radio.Group>
        {/* </CyFormItem> */}
        {isPass ? (
          <>
            <div style={{ padding: '20px 0' }}>保留项目至当前账号或指派回申请人账号</div>
            <Radio.Group onChange={(e) => setIsSaveAccount(e.target.value)} value={isSaveAccount}>
              <Radio value={true} style={{ paddingRight: '240px' }}>
                保留
              </Radio>
              <Radio value={false}>指回</Radio>
            </Radio.Group>
          </>
        ) : (
          <div style={{ paddingTop: '20px' }}>
            <CyFormItem label="备注" name="remark">
              <Input.TextArea maxLength={100} showCount />
            </CyFormItem>
          </div>
        )}
      </Form>
    </Modal>
  )
}

export default ApproveModal
