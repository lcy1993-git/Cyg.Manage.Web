import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { newUploadLineStressSag } from '@/services/resource-config/drawing'
import { useBoolean, useControllableValue, useRequest } from 'ahooks'
import React, { useMemo, useState } from 'react'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'
import { Input, Form, message, Modal, Button } from 'antd'
import UrlSelect from '@/components/url-select'
import rule from '../rules'
import { getCityAreas } from '@/services/project-management/all-project'

interface ImportInventoryProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const { TextArea } = Input

const ImportInventory: React.FC<ImportInventoryProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const [province, setProvince] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [msgState, setMsgState] = useState<boolean>(false)
  const [versionName, setVersionName] = useState<string>('')
  const [city, setCity] = useState<any>([])

  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false)
  const [inventoryName, setInventoryName] = useState<string>('')
  const { requestSource, changeFinishEvent } = props
  const [form] = Form.useForm()

  const { data: cityData } = useRequest(() => getCityAreas(), {
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
  })

  const provinceData = useMemo(() => {
    const newProvinceData = city.map((item: any) => {
      return {
        label: item.text,
        value: item.id,
        children: item.children,
      }
    })
    return [{ label: '-全部-', value: '', children: [] }, ...newProvinceData]
  }, [JSON.stringify(city)])

  const saveInventoryEvent = () => {
    setMsgState(false)
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        setRequestLoading(true)

        return newUploadLineStressSag(
          file,
          { province, versionName, inventoryName, remark },
          requestSource,
          '/Inventory/SaveImport'
        )
      })
      .then(
        (res) => {
          message.success('导入成功')
          setRequestLoading(true)
          return Promise.resolve()
        },
        (res) => {
          if (res.code === 500 || res.code === 5000) {
            const { message: msg } = res
            setRequestLoading(false)
            setMsgState(true)
            message.error('上传失败，' + msg)
          }

          setUploadFileFalse()
          return Promise.reject('导入失败')
        }
      )
      .finally(() => {
        // setRequestLoading(true);
      })
  }

  const onSave = () => {
    form.validateFields().then((value) => {
      if (requestLoading) {
        setState(false)
        changeFinishEvent?.()
        return
      }
      if (msgState) {
        message.info('请重新上传完整的文件')
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="600px"
      title="新建"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          labelWidth={100}
          align="right"
          label="协议库存名称"
          name="invName"
          required
          rules={rule.invName}
        >
          <Input
            placeholder="请输入协议库存名称"
            onChange={(e) => setInventoryName(e.target.value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="版本"
          name="version"
          required
          rules={rule.version}
        >
          <Input
            placeholder="请输入协议库存版本"
            onChange={(e) => setVersionName(e.target.value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="区域"
          name="province"
          required
          rules={rule.province}
        >
          <UrlSelect
            showSearch
            titlekey="label"
            valuekey="value"
            defaultData={provinceData}
            placeholder="请选择"
            onChange={(value: any) => setProvince(value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="导入"
          name="file"
          required
          rules={rule.file}
        >
          <FileUpload
            uploadFileBtn
            trigger={triggerUploadFile}
            uploadFileFn={saveInventoryEvent}
            maxCount={1}
            accept=".xlsx"
          />
        </CyFormItem>

        <CyFormItem labelWidth={100} align="right" label="备注" name="remark">
          <TextArea
            showCount
            maxLength={100}
            placeholder="备注说明"
            onChange={(e: any) => setRemark(e.target.value)}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default ImportInventory
