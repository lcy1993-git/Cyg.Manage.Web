import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { handleDecrypto } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface SaveImportLineStressSagProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const SaveImportLineStressSag: React.FC<SaveImportLineStressSagProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { libId = '', requestSource, changeFinishEvent } = props
  const [falseData, setFalseData] = useState<string>('')
  const [importTipsVisible, setImportTipsVisible] = useState<boolean>(false)
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  // const [requestLoading, setRequestLoading] = useState(false);
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const [form] = Form.useForm()

  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values

        return uploadLineStressSag(
          file,
          { libId },
          requestSource,
          '/ResourceLib/SaveImportLineStressSag'
        )
      })
      .then(
        (res) => {
          const decryRes = handleDecrypto(res)
          if (decryRes && decryRes.code === 6000) {
            setFalseData(decryRes.message)
            setState(false)
            setImportTipsVisible(true)
            return Promise.resolve()
          } else if (decryRes.code === 200) {
            message.success('导入成功')
            setIsImportFlag(true)
            return Promise.resolve()
          }
          message.error(decryRes.message)
          return Promise.reject()
        },
        (res) => {
          const decryRes = handleDecrypto(res)
          message.error(decryRes.message)
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
    <>
      <Modal
        maskClosable={false}
        title="导入应力弧垂表"
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={onSave}
            // loading={requestLoading}
          >
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
            rules={[{ required: true, message: '请上传应力弧垂表文件' }]}
          >
            <FileUpload
              accept=".zip"
              uploadFileBtn
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileFn={saveLineStreesSagEvent}
            />
          </CyFormItem>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        width="700px"
        title="提示信息"
        visible={importTipsVisible}
        onCancel={() => setImportTipsVisible(false)}
      >
        <div style={{ width: '100%', overflow: 'auto', height: '450px' }}>
          <pre>{falseData}</pre>
        </div>
      </Modal>
    </>
  )
}

export default SaveImportLineStressSag
