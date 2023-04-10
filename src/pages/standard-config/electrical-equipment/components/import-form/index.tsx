import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { baseUrl } from '@/services/common'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { uploadAuditLog } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { useState } from 'react'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'

interface SaveImportElectricalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const SaveImportElectrical: React.FC<SaveImportElectricalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const { libId = '', requestSource, changeFinishEvent } = props
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()

  const saveImportElectricalEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        return uploadLineStressSag(
          file,
          { libId },
          requestSource,
          '/ElectricalEquipment/SaveImport'
        )
      })
      .then(
        () => {
          message.success('导入成功')
          setIsImportFlag(true)
          uploadAuditLog([
            {
              auditType: 1,
              eventType: 5,
              eventDetailType: '文件上传',
              executionResult: '成功',
              auditLevel: 2,
              serviceAdress: `${baseUrl.upload}/Upload/File`,
            },
          ])
          return Promise.resolve()
        },
        (res) => {
          message.error(res.message)
          uploadAuditLog([
            {
              auditType: 1,
              eventType: 5,
              eventDetailType: '文件上传',
              executionResult: '失败',
              auditLevel: 2,
              serviceAdress: `${baseUrl.upload}/Upload/File`,
            },
          ])
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
      title="导入电气设备"
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
          rules={[{ required: true, message: '请上传电气设备文件' }]}
        >
          <FileUpload
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileBtn
            uploadFileFn={saveImportElectricalEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default SaveImportElectrical
