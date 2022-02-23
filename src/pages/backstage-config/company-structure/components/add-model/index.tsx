import CyFormItem from '@/components/cy-form-item'
import DataSelect from '@/components/data-select'
import {
  addCompany,
  getCompanyStructureTreeList,
} from '@/services/backstage-config/company-structure'
import { useGetSelectData } from '@/utils/hooks'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, Modal, TreeSelect } from 'antd'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'

interface AddModelParams {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const AddModel: React.FC<AddModelParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { finishEvent } = props
  const [requestLoading, setRequestLoading] = useState(false)
  const [form] = Form.useForm()

  const handleDataFunction = (data: any, hierarchy: number): any => {
    return {
      value: data.id,
      title: data.text,
      disabled: hierarchy >= 5,
      children:
        data.children && data.children.length > 0
          ? data.children.map((item: any) => handleDataFunction(item, hierarchy + 1))
          : [],
    }
  }

  const { data } = useRequest(() => getCompanyStructureTreeList({ keyWord: '' }), {})

  const { data: childList } = useGetSelectData({
    url: '/CompanyTree/GetUnassignedList',
    titleKey: 'value',
    valueKey: 'key',
    method: 'post',
  })

  const handleData = useMemo(() => {
    return data ? data.map((item) => handleDataFunction(item, 1)) : []
  }, [data])

  const modalCloseEvent = () => {
    setState(false)
    form.resetFields()
  }

  const addEvent = () => {
    form.validateFields().then(async (values) => {
      try {
        await addCompany(values)
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
        <Button key="save" type="primary" loading={requestLoading} onClick={() => addEvent()}>
          保存
        </Button>,
      ]}
      onOk={() => addEvent()}
      onCancel={() => modalCloseEvent()}
    >
      <Form form={form} preserve={false}>
        <CyFormItem label="上级公司" name="parentId" required>
          <TreeSelect placeholder="公司A名称" treeData={handleData} treeDefaultExpandAll={true} />
        </CyFormItem>
        <CyFormItem label="添加公司" name="companyId" required>
          <DataSelect style={{ width: '100%' }} options={childList} placeholder="公司B名称" />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default AddModel
