import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { importSchemeOrChartTemp } from '@/services/station-house'
import { handleDecrypto } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface ImportSchemeProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  url: string
  title: string
  accept: string
}

const ImportScheme: React.FC<ImportSchemeProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, title, url, accept } = props
  const [, setRequestLoading] = useState(false)

  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const saveImportAllEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        setRequestLoading(true)
        return importSchemeOrChartTemp(file, url)
      })

      .then((res) => {
        const decryRes = handleDecrypto(res)
        if (decryRes && decryRes.code === 200) {
          setIsImportFlag(true)
          message.success('导入成功')
          changeFinishEvent?.()
          return Promise.resolve()
        } else {
          decryRes && message.error(decryRes?.message)
          return Promise.reject()
        }
      })
      .finally(() => {
        setUploadFileFalse()
        setRequestLoading(false)
      })
  }

  const onSave = () => {
    form.validateFields().then(() => {
      if (isImportFlag) {
        setState(false)
        setIsImportFlag(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  return (
    <>
      <Modal
        maskClosable={false}
        title={title}
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={onSave}>
            确定
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
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <FileUpload
              accept={accept}
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileBtn
              uploadFileFn={saveImportAllEvent}
            />
          </CyFormItem>
        </Form>
      </Modal>
    </>
  )
}

export default ImportScheme
