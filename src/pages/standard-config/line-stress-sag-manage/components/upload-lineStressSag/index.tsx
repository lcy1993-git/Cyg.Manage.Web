import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface UploadLineStreeSagProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource?: 'project' | 'resource' | 'upload'
}

const UploadLineStressSag: React.FC<UploadLineStreeSagProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { securityKey = '', requestSource = 'upload', changeFinishEvent } = props
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        return uploadLineStressSag(
          file,
          { libId: '', securityKey },
          requestSource,
          '/Upload/LineStressSag'
        )
      })
      .then(
        () => {
          message.success('导入成功')
          setIsImportFlag(true)
          return Promise.resolve()
        },
        (res) => {
          message.error(res.message)
          return Promise.reject()
        }
      )
      .finally(() => {
        changeFinishEvent?.()
        setUploadFileFalse()
      })
  }

  const onSave = () => {
    form.validateFields().then(() => {
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
      title="导入应力弧垂表-图纸"
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
          rules={[{ required: true, message: '请上传应力弧垂表图纸文件' }]}
        >
          <FileUpload
            accept=".zip"
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileBtn
            uploadFileFn={saveLineStreesSagEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default UploadLineStressSag
