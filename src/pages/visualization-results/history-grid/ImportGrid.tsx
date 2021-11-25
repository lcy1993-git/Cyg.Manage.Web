import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Upload } from 'antd'
import { useCallback } from 'react'
import { downloadTemplate, importEquipments, importHistoryEquipments } from './service'
import { useHistoryGridContext } from './store'

const { Dragger } = Upload
const { useForm } = Form

/** 导入 */
const ImportGrid = () => {
  const { UIStatus, mode, preDesignItemData, dispatch } = useHistoryGridContext()
  const { importModalVisible } = UIStatus

  const [form] = useForm()

  const closeModal = useCallback(() => {
    dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, importModalVisible: false } })
    form.resetFields()
  }, [dispatch, UIStatus, form])

  const onOk = useCallback(async () => {
    const files = form.getFieldValue('files')

    if (!Array.isArray(files) || files.length === 0) {
      message.error('请先选择需要上传的文件')
      return
    }

    const data = new FormData()
    files.forEach((f) => data.append('files', f.originFileObj, f.name))

    try {
      const res =
        mode === 'preDesigning'
          ? await importEquipments(data, preDesignItemData!.id as string)
          : await importHistoryEquipments(data)

      if (res.isSuccess) {
        message.success('上传成功')

        dispatch('refetch')
        closeModal()
      } else {
        message.error(res.message)
      }
    } catch (e: any) {
      message.error(e.message || '上传出错，请重试')
    }
  }, [closeModal, preDesignItemData, form, mode, dispatch])

  return (
    <Modal
      destroyOnClose
      centered
      title="导入网架"
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
