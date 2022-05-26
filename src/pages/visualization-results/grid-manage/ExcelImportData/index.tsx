/* eslint-disable react-hooks/exhaustive-deps */
import { importGridManageData } from '@/services/grid-manage/treeMenu'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Upload } from 'antd'
import { useCallback } from 'react'
import { useMyContext } from '../Context'
const { Dragger } = Upload
const { useForm } = Form
const ExcelImportData = () => {
  const { importModalVisible, setImportModalVisible } = useMyContext()
  const [form] = useForm()

  const onOk = useCallback(async () => {
    const files = form.getFieldValue('files')
    if (!Array.isArray(files) || files.length === 0) {
      message.error('请先选择需要上传的文件')
      return
    }
    const data = new FormData()
    files.forEach((f) => data.append('files', f.originFileObj, f.name))

    try {
      const res = await importGridManageData(data)
      if (res.isSuccess) {
        message.success('上传成功')
        closeModal()
      } else {
        message.error(res.message)
      }
    } catch (e: any) {
      message.error(e.message || '上传出错，请重试')
    }
  }, [form])

  const closeModal = useCallback(() => {
    setImportModalVisible(false)
    form.resetFields()
  }, [form, setImportModalVisible])

  /** 下载导入模板 */
  const download = async () => {
    const blob = new Blob()
    // await downloadTemplate()
    const url = URL.createObjectURL(blob)

    let a: HTMLAnchorElement | null = document.createElement('a')
    a.href = url
    a.download = '导入模板'
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
