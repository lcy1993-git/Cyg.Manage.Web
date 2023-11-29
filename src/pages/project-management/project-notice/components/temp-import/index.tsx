import { useControllableValue } from 'ahooks'
import { Button, Select } from 'antd'
import { Form, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import CyTip from '@/components/cy-tip'
import { CaretDownOutlined } from '@ant-design/icons'
import { importCloudPlat } from '@/services/project-management/project-notice'

interface UploadAddProjectProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  currentKey: string
  refreshEvent?: () => void
}

const { Option } = Select

const TempImport: React.FC<UploadAddProjectProps> = (props) => {
  const { currentKey, refreshEvent } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  //阶段选择
  const [stage, setStage] = useState<number>(2)

  const [requestLoading, setRequestLoading] = useState(false)

  const [form] = Form.useForm()

  const closeModalEvent = () => {
    setState(false)
  }

  useEffect(() => {
    if (currentKey === 'yun') {
      setStage(2)
    } else {
      setStage(3)
    }
  }, [currentKey])

  //传入上传后获取到的List
  const saveBatchAddListEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values
      if (file?.length === 0 || file === undefined) {
        message.warning('您还未上传文件')
        return
      }
      setRequestLoading(true)

      // if (file[0].name.indexOf('.xlsx') == -1) {
      //   message.warning('请上传正确的Excel模板文件');
      //   setRequestLoading(false);
      //   return;
      // }
      if (currentKey === 'yun') {
        const res = await importCloudPlat(
          file,
          'project',
          `/Hotfix231202/ImportCloudPlat?projectStage=${stage}`
        )
        if (res.code === 5000 || res.code === 500 || res.code !== 200) {
          message.error(res.message)
          setRequestLoading(false)
          return
        }
      } else {
        alert('hello!')
        return
      }

      message.success('导入成功')
      refreshEvent?.()
      setState(false)

      setRequestLoading(false)
      form.resetFields()
    })
  }

  const changeStage = (value: any) => {
    setStage(value)
  }

  useEffect(() => {
    if (state) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      <Modal
        maskClosable={false}
        title="导入"
        width={650}
        visible={state as boolean}
        bodyStyle={{
          padding: 0,
        }}
        footer={[
          <Button
            loading={requestLoading}
            key="open"
            type="primary"
            onClick={() => saveBatchAddListEvent()}
          >
            确认
          </Button>,
        ]}
        onCancel={() => closeModalEvent()}
      >
        <Form form={form}>
          <CyTip>
            您可以通过下载excel模版，在模板中填写对应设计阶段项目信息，并上传填写后的文件。
          </CyTip>
          <div style={{ padding: '20px' }}>
            <CyFormItem label="设计阶段" labelWidth={100}>
              <Select
                value={stage}
                suffixIcon={<CaretDownOutlined />}
                onChange={(value: any) => changeStage(value)}
              >
                {currentKey === 'yun' && <Option value={2}>可研统计</Option>}
                <Option value={3}>初设统计</Option>
                <Option value={4}>施工统计</Option>
                <Option value={5}>竣工统计</Option>
              </Select>
            </CyFormItem>
            <CyFormItem label="下载模板" labelWidth={100}>
              <Button type="primary" style={{ width: '100px' }}>
                <a
                  href={`/template/${currentKey === 'yun' ? 'cloudTemp' : 'replyTemp'}.xlsx`}
                  download={`${
                    currentKey === 'yun'
                      ? '云平台应用统计模板V1.0.xlsx'
                      : '批复工程量项目填写模板V1.0.xlsx'
                  }`}
                >
                  点击下载
                </a>
              </Button>
            </CyFormItem>
            <CyFormItem
              labelWidth={100}
              label="上传文件"
              name="file"
              valuePropName="fileList"
              required
            >
              <FileUpload maxCount={1} accept=".xlsx" />
            </CyFormItem>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default TempImport
