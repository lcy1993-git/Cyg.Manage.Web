import CyFormItem from '@/components/cy-form-item'
import CyTip from '@/components/cy-tip'
import FileUpload from '@/components/file-upload'
import UrlSelect from '@/components/url-select'
import { importCloudPlat, importMaterialInfo } from '@/services/project-management/project-notice'
import { getLocalPath, handleDecrypto } from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Button, Form, message, Modal, Select } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { categoryList } from '../../material-tabs'

interface UploadAddProjectProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  currentKey: string
  category?: number
  refreshEvent?: (value: any) => void
}

const { Option } = Select

const TempImport: React.FC<UploadAddProjectProps> = (props) => {
  const { currentKey, refreshEvent, category } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  //阶段选择
  const [stage, setStage] = useState<number>()

  const [pCategory, setPCategory] = useState<number>() //项目类别

  const [requestLoading, setRequestLoading] = useState(false)

  const [form] = Form.useForm()

  const closeModalEvent = () => {
    setState(false)
  }

  useEffect(() => {
    setStage(undefined)
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
        const res = await importCloudPlat(file, 'project', `/Hotfix231202/ImportCloudPlat`, stage)
        const handleRes = handleDecrypto(res)
        if (handleRes.code === 5000 || handleRes.code === 500 || handleRes.code !== 200) {
          message.error(handleRes.message)
          setRequestLoading(false)
          return
        }
      } else if (currentKey === 'pf') {
        const res = await importCloudPlat(
          file,
          'project',
          `/Hotfix231202/ImportApprovedEngineer`,
          stage
        )
        const handleRes = handleDecrypto(res)
        if (handleRes.code === 5000 || handleRes.code === 500 || handleRes.code !== 200) {
          message.error(handleRes.message)
          setRequestLoading(false)
          return
        }
      } else {
        const res = await importMaterialInfo(
          file,
          'project',
          `/Hotfix240506/ImportMaterialInfo`,
          stage,
          category
        )
        const handleRes = handleDecrypto(res)
        if (handleRes.code === 5000 || handleRes.code === 500 || handleRes.code !== 200) {
          message.error(handleRes.message)
          setRequestLoading(false)
          return
        }
      }
      message.success('导入成功')
      refreshEvent?.(stage)
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
            {category && (
              <CyFormItem
                label="项目类别"
                labelWidth={100}
                required
                name="PCategory"
                rules={[{ required: true, message: '未选择项目类别' }]}
              >
                <UrlSelect
                  valuekey="value"
                  titlekey="text"
                  defaultData={categoryList}
                  value={pCategory}
                  onChange={(value: any) => {
                    setPCategory(value)
                  }}
                  placeholder="项目类别"
                />
              </CyFormItem>
            )}
            <CyFormItem
              label="设计阶段"
              labelWidth={100}
              required
              name="stage"
              rules={[{ required: true, message: '未选择设计阶段' }]}
            >
              <Select
                placeholder="请选择"
                value={stage}
                onChange={(value: any) => changeStage(value)}
              >
                {currentKey !== 'pf' && <Option value={2}>可研统计</Option>}
                <Option value={3}>初设统计</Option>
                <Option value={4}>施工统计</Option>
                <Option value={5}>竣工统计</Option>
              </Select>
            </CyFormItem>

            <CyFormItem label="下载模板" labelWidth={100}>
              <Button type="primary" style={{ width: '100px' }}>
                <a
                  href={getLocalPath(
                    `/template/${
                      currentKey === 'yun'
                        ? 'cloudTemp'
                        : currentKey === 'pf'
                        ? 'replyTemp'
                        : 'material'
                    }.xlsx`
                  )}
                  download={`${
                    currentKey === 'yun'
                      ? '云平台应用统计模板V1.0.xlsx'
                      : currentKey === 'pf'
                      ? '批复工程量项目填写模板V1.0.xlsx'
                      : '物料统计模版'
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
