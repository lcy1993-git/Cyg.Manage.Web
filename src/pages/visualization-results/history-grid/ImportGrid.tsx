import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Upload } from 'antd'
import { useCallback } from 'react'
import { downloadTemplate, importEquipments, importHistoryEquipments } from './service'
import { useHistoryGridContext } from './store'

const { Dragger } = Upload
const { useForm } = Form

/** 导入 */
const ImportGrid = () => {
  const { UIStatus, mode, currentGridData, dispatch } = useHistoryGridContext()
  const { importModalVisible } = UIStatus

  const [form] = useForm()

  const closeModal = useCallback(() => {
    dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, importModalVisible: false } })
  }, [dispatch, UIStatus])

  const onOk = useCallback(async () => {
    const files = form.getFieldValue('files')

    if (!Array.isArray(files) || files.length === 0) {
      message.error('请先选择需要上传的文件')
      return
    }

    const data = new FormData()
    files.forEach((f) => data.append(f.name, f))

    try {
      mode === 'preDesigning'
        ? await importEquipments(data, currentGridData.id)
        : await importHistoryEquipments(data)

      message.success('上传成功')
      closeModal()
    } catch (e: any) {
      console.error('上传出错', e)
      message.error(e.message || '上传出错，请重试')
    }
  }, [closeModal, currentGridData, form, mode])

  return (
    <Modal centered title="导入网架" visible={importModalVisible} onCancel={closeModal} onOk={onOk}>
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
          <Dragger multiple accept=".xls,.xlsx">
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

/** 下载导入模板 */
const download = async () => {
  const blob = await downloadTemplate()
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

export default ImportGrid
