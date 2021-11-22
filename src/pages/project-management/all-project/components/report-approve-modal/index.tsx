import { useControllableValue, useUpdateEffect } from 'ahooks'
import { Form, Input, message, Modal } from 'antd'
import React, { Dispatch } from 'react'
import { SetStateAction } from 'react'
import CyFormItem from '@/components/cy-form-item'
import { reportProjectApprove } from '@/services/project-management/all-project'
import UrlSelect from '@/components/url-select'
import { useGetSelectData } from '@/utils/hooks'
// import styles from './index.less';

interface ReportApproveParams {
  projectIds: string[] | string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ReportApproveModal: React.FC<ReportApproveParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
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
      await reportProjectApprove(submitInfo)
    })
    message.success('报审成功')
    setState(false)
    finishEvent?.()
  }

  return (
    <Modal
      maskClosable={false}
      title="立项报审"
      width="40%"
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => approveEvent()}
      cancelText="取消"
      okText="确认"
    >
      <Form form={form}>
        <CyFormItem required label="审核人" name="approveUserId" labelWidth={98}>
          <UrlSelect
            disabled
            defaultData={approveUser}
            titlekey="label"
            valuekey="value"
            placeholder="请选择审核人"
          />
        </CyFormItem>
        <CyFormItem required label="备注" labelWidth={98} name="remark">
          <Input.TextArea maxLength={100} showCount />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default ReportApproveModal
