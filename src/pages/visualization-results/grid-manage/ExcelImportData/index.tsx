/* eslint-disable react-hooks/exhaustive-deps */
import { downloadExcelTemplate, importGridManageData } from '@/services/grid-manage/treeMenu'
import { handleDecrypto } from '@/utils/utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Upload } from 'antd'
import { useCallback, useState } from 'react'
import { useMyContext } from '../Context'
const { Dragger } = Upload
const { useForm } = Form
const ExcelImportData = () => {
  const { importModalVisible, setImportModalVisible, setIsRefresh, isRefresh, setlineAssemble } =
    useMyContext()
  const [form] = useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onOk = useCallback(async () => {
    const files = form.getFieldValue('files')
    if (!Array.isArray(files) || files.length === 0) {
      message.error('请先选择需要上传的文件')
      return
    }
    const data = new FormData()
    files.forEach((f) => data.append('files', f.originFileObj, f.name))

    try {
      setConfirmLoading(true)
      setlineAssemble(false)
      const res = await importGridManageData(data)
      const decryRes = handleDecrypto(res)
      if (decryRes.isSuccess) {
        message.success('上传成功')
        setConfirmLoading(false)
        setIsRefresh(!isRefresh)
        setlineAssemble(true)
        closeModal()
      } else {
        setConfirmLoading(false)
        message.error(decryRes.message)
      }
    } catch (e: any) {
      setConfirmLoading(false)
      message.error(e.message || '上传出错，请重试')
    }
  }, [form])

  const closeModal = useCallback(() => {
    setImportModalVisible(false)
    form.resetFields()
  }, [form, setImportModalVisible])

  /** 下载导入模板 */
  const download = async () => {
    const res = await downloadExcelTemplate()
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    const url = URL.createObjectURL(blob)
    let a: HTMLAnchorElement | null = document.createElement('a')
    a.href = url
    a.download = '导入模板.xlsx'
    a.click()
    a = null
  }

  const normalize = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  return (
    <Modal
      destroyOnClose
      centered
      title="导入网架.xlsx"
      confirmLoading={confirmLoading}
      visible={importModalVisible}
      onCancel={closeModal}
      onOk={onOk}
    >
      <Form requiredMark={false} colon={false} form={form}>
        <Form.Item label="文件模板">
          <Button type="primary" onClick={download}>
            下载模板
          </Button>
        </Form.Item>
        <Form.Item
          required
          label="上传文件"
          name="files"
          valuePropName="fileList"
          getValueFromEvent={normalize}
        >
          <Dragger beforeUpload={() => false} maxCount={1} accept=".xls,.xlsx">
            <div>
              <UploadOutlined className="mr-1" />
              添加文件或拖放文件上传
            </div>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ExcelImportData
