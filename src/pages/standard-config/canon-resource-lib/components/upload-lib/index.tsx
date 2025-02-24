import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { newUploadLineStressSag } from '@/services/resource-config/drawing'
import { handleDecrypto } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface SaveImportLibProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const SaveImportLib: React.FC<SaveImportLibProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { libId = '', requestSource, changeFinishEvent } = props
  // const [setRequestLoading] = useState(false)
  const [falseData, setFalseData] = useState<string>('')
  const [importTipsVisible, setImportTipsVisible] = useState<boolean>(false)
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const saveImportLibEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values

        // setRequestLoading(true)
        return newUploadLineStressSag(file, { libId }, requestSource, '/ResourceLib/SaveImport')
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
            setIsImportFlag(true)
            message.success('导入成功')
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
        // setRequestLoading(false)
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
        title="导入资源库"
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
            rules={[{ required: true, message: '请上传资源库文件' }]}
          >
            <FileUpload
              accept=".zip"
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileBtn
              uploadFileFn={saveImportLibEvent}
            />
          </CyFormItem>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        width="650px"
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

export default SaveImportLib
