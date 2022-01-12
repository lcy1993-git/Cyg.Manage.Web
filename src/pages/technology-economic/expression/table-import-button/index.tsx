import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { commonUpload } from '@/services/common'
import { downloadTemplate } from '@/services/technology-economic/common-rate'
import { checkHasUploadFile } from '@/utils/common-rule'
import { ExportOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Form, message, Modal, Spin } from 'antd'
import React, { useState } from 'react'

interface TableImportButtonProps extends ButtonProps {
  importUrl: string
  extraParams?: object
  modalTitle?: string
  accept?: string
  name?: string
  labelTitle?: string
  buttonTitle?: string
  requestSource?: 'project' | 'resource' | 'upload' | 'tecEco1' | 'tecEco'
  postType?: 'body' | 'query'
  setSuccessful?: (e: boolean) => void
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
    postType = 'body',
    setSuccessful,
    ...rest
  } = props

  const [importModalVisible, setImportModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const cancelImport = () => {
    form.resetFields()
    setImportModalVisible(false)
  }
  const downLoad = async () => {
    const res = await downloadTemplate(downType)
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    let finallyFileName = `模板.xlsx`
    //for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
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
  }
  const sureImport = () => {
    form.validateFields().then(async (values) => {
      setLoading(true)
      const { file } = values
      // const res = await
      commonUpload(importUrl, file, name, requestSource, extraParams)
        .then((res) => {
          message.success('导入成功')
          setLoading(false)
          setSuccessful && setSuccessful(true)
          setImportModalVisible(false)
          form.resetFields()
        })
        .catch((res) => {
          setLoading(false)
        })
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
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin tip="导入中..." />
          </div>
        ) : (
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
        )}
      </Modal>
    </div>
  )
}

export default TableImportButton
