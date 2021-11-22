import { useControllableValue, useUpdateEffect } from 'ahooks'
import { Form, Input, message, Modal, Radio } from 'antd'
import React, { Dispatch, useState } from 'react'
import { SetStateAction } from 'react'
import CyFormItem from '@/components/cy-form-item'
import { approveProject } from '@/services/project-management/all-project'
import UrlSelect from '@/components/url-select'
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
  const [isPass, setIsPass] = useState<boolean>(false)
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
        projectIds: [projectIds],
        ...values,
      }
      await approveProject(submitInfo)
    })
    message.success('报审成功')
    setState(false)
    finishEvent?.()
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
        <CyFormItem required label="立项审批是否通过" name="isApproved" labelWidth={98}>
          <Radio.Group onChange={(e) => setIsPass(e.target.value)} value={isPass}>
            <Radio value={true}>通过</Radio>
            <Radio value={false}>退回</Radio>
          </Radio.Group>
        </CyFormItem>
        {isPass ? (
          <CyFormItem required label="备注" labelWidth={98} name="remark">
            <Radio.Group onChange={(e) => setIsPass(e.target.value)} value={isPass}>
              <Radio value={true}>通过</Radio>
              <Radio value={false}>退回</Radio>
            </Radio.Group>
          </CyFormItem>
        ) : (
          <CyFormItem required label="备注" labelWidth={98} name="remark">
            <Input.TextArea maxLength={100} showCount />
          </CyFormItem>
        )}
      </Form>
    </Modal>
  )
}

export default ApproveModal
