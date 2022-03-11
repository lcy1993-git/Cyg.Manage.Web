import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { importCustomMap } from '@/services/system-config/custom-map'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { useState } from 'react'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'

interface UploadDrawingProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
}

const ImportCustomMap: React.FC<UploadDrawingProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent } = props
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false)
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const saveMapEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values

        setRequestLoading(true)
        return importCustomMap(file)
      })
      .then(
        () => {
          return Promise.resolve()
        },
        () => {
          return Promise.reject()
        }
      )
      .finally(() => {
        changeFinishEvent?.()
        setUploadFileFalse()
        setRequestLoading(true)
      })
  }

  const onSave = () => {
    form.validateFields().then((value) => {
      if (requestLoading) {
        setState(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  const downTempEvent = () => {}

  return (
    <Modal
      maskClosable={false}
      title="导入地图源配置文件"
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
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传地图源配置文件' }]}
        >
          <FileUpload
            accept=".xlsx,xls"
            uploadFileBtn
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileFn={saveMapEvent}
          />
        </CyFormItem>

        <span
          style={{ fontSize: '12px', color: '#3c6ef3', cursor: 'pointer' }}
          onClick={() => downTempEvent()}
        >
          点击下载文件模板
        </span>
      </Form>
    </Modal>
  )
}

export default ImportCustomMap
