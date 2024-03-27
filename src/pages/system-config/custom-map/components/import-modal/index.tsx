import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { importCustomMap } from '@/services/system-config/custom-map'
import { getLocalPath } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Form, message, Modal, Spin } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface UploadDrawingProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
}

const ImportCustomMap: React.FC<UploadDrawingProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [loading] = useState<boolean>(false)
  const { changeFinishEvent } = props
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const saveMapEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values
        return importCustomMap(file)
      })
      .then(
        () => {
          return Promise.resolve()
        },
        () => {
          return Promise.reject()
        }
      )
      .finally(() => {
        changeFinishEvent?.()
        setUploadFileFalse()
        setRequestLoading(true)
      })
  }

  const onSave = () => {
    form.validateFields().then(() => {
      if (requestLoading) {
        setState(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  //下载模板
  // const downTempEvent = async () => {
  //   setLoading(true)
  //   const res = await exportMapTemp()
  //   let blob = new Blob([res], {
  //     type: `application/xlsx`,
  //   })
  //   let finallyFileName = `自定义地图源模板.xlsx`
  //   //for IE
  //   //@ts-ignore
  //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //     //@ts-ignore
  //     window.navigator.msSaveOrOpenBlob(blob, finallyFileName)
  //   } else {
  //     // for Non-IE
  //     let objectUrl = URL.createObjectURL(blob)
  //     let link = document.createElement('a')
  //     link.href = objectUrl
  //     link.setAttribute('download', finallyFileName)
  //     document.body.appendChild(link)
  //     link.click()
  //     window.URL.revokeObjectURL(link.href)
  //     document.body.removeChild(link)
  //   }
  //   setLoading(false)
  //   message.success('下载成功')
  // }

  return (
    <Modal
      maskClosable={false}
      title="导入地图源配置文件"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
      destroyOnClose
    >
      <Spin spinning={loading} tip="模板下载中...">
        <Form form={form} preserve={false}>
          <CyFormItem
            label="导入"
            name="file"
            required
            rules={[{ required: true, message: '请上传地图源配置文件' }]}
          >
            <FileUpload
              accept=".xlsx,xls"
              uploadFileBtn
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileFn={saveMapEvent}
            />
          </CyFormItem>
          <a
            title="下载地图源配置模板"
            href={getLocalPath('/template/mapTemp.xlsx')}
            download="地图源配置模板.xlsx"
            style={{ fontSize: '12px', color: '#3c6ef3' }}
          >
            点击下载文件模板
          </a>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ImportCustomMap
