import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { useBoolean, useControllableValue } from 'ahooks'
import React, { useState } from 'react'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'
import { Form, message, Modal, Button } from 'antd'
import { useOverHeadStore } from '../../context'

interface ImportChartProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const ImportOverheadModal: React.FC<ImportChartProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { libId, requestSource } = props
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { setIsRefresh } = useOverHeadStore()

  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false)
  const saveImportOverHeadEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        return uploadLineStressSag(file, { libId }, requestSource, '/PoleType/SaveImport')
      })
      .then(
        () => {
          message.success('导入成功')
          setIsImportFlag(true)
          setState(false)
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
        setIsRefresh?.(true)
        setUploadFileFalse()
      })
  }

  const onSave = () => {
    form.validateFields().then((value) => {
      if (isImportFlag) {
        setState(false)
        setIsRefresh?.(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="680px"
      title="导入(杆型+模块)"
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
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传架空设计文件' }]}
        >
          <FileUpload
            accept=".xlsx"
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileBtn
            uploadFileFn={saveImportOverHeadEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default ImportOverheadModal
