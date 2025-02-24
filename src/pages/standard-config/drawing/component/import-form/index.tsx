import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import FileUpload from '@/components/file-upload'
import { addDrawingItem } from '@/services/resource-config/drawing'
import { drawingCategory, drawingType } from '@/services/resource-config/resource-enum'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { Dispatch, forwardRef, Ref, SetStateAction, useImperativeHandle, useState } from 'react'

interface ImportChartProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  title: string
  chartId?: string
}
const ImportChartModal = (props: ImportChartProps, ref: Ref<any>) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { libId, changeFinishEvent, title, chartId } = props
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const [fileName, setFileName] = useState<string>('')

  const { run, loading } = useRequest(
    (val) => {
      return addDrawingItem(val)
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('图纸上传成功')
        changeFinishEvent()
        setState(false)
      },
    }
  )

  useImperativeHandle(ref, () => ({
    setFormValues: (val: any) => {
      const value = { ...val }
      form.setFieldsValue(value)
    },
  }))

  const onSave = () => {
    form.validateFields().then((value) => {
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('category', value.category)
      formData.append('type', value.type)
      formData.append('chartName', value.chartName)
      formData.append('fileName', fileName)
      formData.append('resourceLibId', libId as string)
      chartId && formData.append('chartId', chartId)
      run(formData)
    })
  }
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={title}
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={onSave} loading={loading}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          labelWidth={80}
          label="类别"
          name="category"
          required
          rules={[{ required: true, message: '类别不能为空' }]}
        >
          <EnumSelect placeholder="请选择类型" enumList={drawingCategory} valueString />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="类型"
          name="type"
          required
          rules={[{ required: true, message: '类型不能为空' }]}
        >
          <EnumSelect placeholder="请选择类型" enumList={drawingType} valueString />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传图纸文件' }]}
        >
          <FileUpload
            fileList={fileList}
            accept=".dwg"
            maxCount={1}
            onChange={(file: any) => {
              setFileList(file)
              setFileName(file[0].name)
              form.setFieldsValue({ chartName: file[0].name.split('.')[0] })

              return false
            }}
          />
        </CyFormItem>
        <CyFormItem
          labelWidth={80}
          label="图纸名称"
          name="chartName"
          required
          rules={[{ required: true, message: '图纸名称不能为空' }]}
        >
          <Input placeholder="请输入图纸名称" />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default forwardRef(ImportChartModal)
