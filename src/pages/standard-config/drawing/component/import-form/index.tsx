import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import FileUpload from '@/components/file-upload'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { drawingCategory, drawingType } from '@/services/resource-config/resource-enum'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface ImportChartProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const ImportChartModal: React.FC<ImportChartProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { libId, securityKey, requestSource, changeFinishEvent } = props
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false)
  const saveImportChartEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        return uploadLineStressSag(file, { libId, securityKey }, requestSource, '/Upload/Chart')
      })
      .then(
        () => {
          message.success('导入成功')
          setIsImportFlag(true)
          return Promise.resolve()
        },
        (res) => {
          const { code, isSuccess, message: msg } = res
          if (msg) {
            message.warn(msg)
          }
          return Promise.reject('导入失败')
        }
      )
      .finally(() => {
        changeFinishEvent?.()
        setUploadFileFalse()
      })
  }

  const onSave = () => {
    form.validateFields().then((value) => {
      if (isImportFlag) {
        setState(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="导入图纸"
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
          labelWidth={80}
          label="类别"
          name="Category"
          required
          rules={[{ required: true, message: '类别不能为空' }]}
        >
          <EnumSelect placeholder="请选择类型" enumList={drawingCategory} valueString />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="类型"
          name="Type"
          required
          rules={[{ required: true, message: '类型不能为空' }]}
        >
          <EnumSelect placeholder="请选择类型" enumList={drawingType} valueString />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传图纸文件' }]}
        >
          <FileUpload
            accept=".dmg"
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileBtn
            uploadFileFn={saveImportChartEvent}
          />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="图纸名称"
          name="chartName"
          required
          rules={[{ required: true, message: '图纸名称不能为空' }]}
        >
          <Input placeholder="请输入图纸名称" />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default ImportChartModal
