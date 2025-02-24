import { commonUpload } from '@/services/common'
import { downloadTemplate } from '@/services/technology-economic/common-rate'
import { checkHasUploadFile } from '@/utils/common-rule'
import { ExportOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Form, message, Modal } from 'antd'
import React, { useState } from 'react'
import CyFormItem from '../cy-form-item'
import FileUpload from '../file-upload'

interface TableImportButtonProps extends ButtonProps {
  importUrl: string
  extraParams?: object
  modalTitle?: string
  accept?: string
  name?: string
  labelTitle?: string
  buttonTitle?: string
  requestSource?: 'project' | 'resource' | 'upload' | 'tecEco1' | 'tecEco'
  // postType?: 'body' | 'query'
  setSuccessful?: (e: boolean) => void
  setLoading?: (e: boolean) => void
  template?: boolean
  downType?: number
}

const TableImportButton: React.FC<TableImportButtonProps> = (props) => {
  const {
    importUrl = '',
    accept,
    template,
    downType,
    modalTitle = '导入',
    labelTitle = '导入',
    name = 'file',
    buttonTitle = '导入',
    extraParams,
    requestSource = 'project',
    // postType = 'body',
    setSuccessful,
    setLoading,
    ...rest
  } = props

  const [importModalVisible, setImportModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [downLoading, setDownLoading] = useState<boolean>(false)

  const cancelImport = () => {
    form.resetFields()
    setImportModalVisible(false)
  }
  const downLoad = async () => {
    setDownLoading(true)
    const res = await downloadTemplate(downType)
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    let finallyFileName = `模板.xlsx`
    //for IE
    // @ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //@ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finallyFileName)
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finallyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
    message.success('下载成功')
    setDownLoading(false)
  }
  const sureImport = () => {
    form.validateFields().then(async (values) => {
      setLoading && setLoading(true)
      const { file } = values
      await commonUpload(importUrl, file, name, requestSource, extraParams)
      message.success('导入成功')
      setSuccessful && setSuccessful(true)
      setImportModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <div>
      <Button
        {...rest}
        onClick={() => {
          setImportModalVisible(true)
        }}
      >
        <ExportOutlined />
        <span>{buttonTitle}</span>
      </Button>
      <Modal
        maskClosable={false}
        title={modalTitle}
        visible={importModalVisible}
        cancelText="取消"
        okText="确认"
        onOk={() => sureImport()}
        onCancel={() => cancelImport()}
        destroyOnClose
      >
        <Button
          style={{ display: template ? 'block' : 'none' }}
          className="mr5"
          type="primary"
          loading={downLoading}
          onClick={() => {
            downLoad()
          }}
        >
          下载模板
        </Button>
        <br />
        <Form form={form} preserve={false}>
          <CyFormItem
            label={labelTitle}
            name="file"
            required
            rules={[{ validator: checkHasUploadFile }]}
          >
            <FileUpload accept={accept} maxCount={1} />
          </CyFormItem>
        </Form>
      </Modal>
    </div>
  )
}

export default TableImportButton
