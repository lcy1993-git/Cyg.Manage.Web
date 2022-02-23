import CyFormItem from '@/components/cy-form-item'
import DataSelect from '@/components/data-select'
import { editCompany } from '@/services/backstage-config/company-structure'
import { useGetSelectData } from '@/utils/hooks'
import { useControllableValue } from 'ahooks'
import { Button, Form, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface EditModelParams {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
  sourceName: string
  sourceCompanyId: string
}

const EditModel: React.FC<EditModelParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { finishEvent, sourceName, sourceCompanyId } = props
  const [requestLoading, setRequestLoading] = useState(false)
  const [form] = Form.useForm()

  const { data: childList } = useGetSelectData({
    url: '/CompanyTree/GetUnassignedList',
    titleKey: 'value',
    valueKey: 'key',
    method: 'post',
  })

  const modalCloseEvent = () => {
    setState(false)
    form.resetFields()
  }

  const editEvent = () => {
    form.validateFields().then(async (values) => {
      try {
        const { companyId } = values
        await editCompany({ sourceCompanyId, targetCompanyId: companyId })
        setRequestLoading(true)
        setState(false)
        finishEvent()
      } catch (error) {
        console.error(error)
      } finally {
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      title="添加公司"
      centered
      width={780}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => modalCloseEvent()}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => editEvent()}>
          保存
        </Button>,
      ]}
      onOk={() => editEvent()}
      onCancel={() => modalCloseEvent()}
    >
      <Form form={form} preserve={false}>
        <CyFormItem label="当前公司">
          <span>{sourceName}</span>
        </CyFormItem>
        <CyFormItem label="修改公司" name="companyId">
          <DataSelect style={{ width: '100%' }} options={childList} placeholder="公司名称" />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default EditModel
