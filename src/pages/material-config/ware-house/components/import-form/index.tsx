import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import UrlSelect from '@/components/url-select'
import { baseUrl } from '@/services/common'
import { uploadLineStressSag } from '@/services/resource-config/drawing'
import { uploadAuditLog } from '@/utils/utils'
import { useBoolean, useControllableValue } from 'ahooks'
import { Button, Col, Form, Input, message, Modal, Row } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

// interface CurrentDataParams {
//   id?: string;
//   provinceName?: string;
//   province?: string;
//   companyId?: string;
// }

interface ImportWareHouseProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
  province: string
  provinceName: string
  overviewId: string
}

const ImportWareHouse: React.FC<ImportWareHouseProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [companyId, setCompanyId] = useState<string>('')
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false)
  const [triggerUploadFile, { setFalse: setUploadFileFalse }] = useBoolean(false)
  const {
    province = '',
    provinceName = '',
    overviewId = '',
    requestSource,
    changeFinishEvent,
  } = props
  const [form] = Form.useForm()

  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values: any) => {
        const { file } = values
        return uploadLineStressSag(
          file,
          { province, companyId, overviewId },
          requestSource,
          '/WareHouse/SaveImport'
        )
      })
      .then(
        () => {
          message.success('导入成功')
          uploadAuditLog([
            {
              auditType: 1,
              eventType: 5,
              eventDetailType: '文件上传',
              executionResult: '成功',
              auditLevel: 2,
              serviceAdress: `${baseUrl.upload}/Upload/File`,
            },
          ])
          setIsImportFlag(true)

          return Promise.resolve()
        },
        (res: any) => {
          const { message: msg } = res
          if (message) {
            message.error(msg)
            setIsImportFlag(false)
          }
          uploadAuditLog([
            {
              auditType: 1,
              eventType: 5,
              eventDetailType: '文件上传',
              executionResult: '失败',
              auditLevel: 2,
              serviceAdress: `${baseUrl.upload}/Upload/File`,
            },
          ])
          return Promise.reject('导入失败')
        }
      )
      .finally(() => {
        setUploadFileFalse()
        changeFinishEvent?.()
      })
  }

  const onSave = () => {
    form.validateFields().then(() => {
      if (isImportFlag) {
        setState(false)
        setIsImportFlag(false)
        return
      }
      message.info('您还未上传文件，点击“开始上传”上传文件')
    })
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="780px"
      title="导入利库"
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
    >
      <Form form={form} preserve={false}>
        <Row gutter={24} style={{ minWidth: 800 }}>
          <Col>
            <CyFormItem labelWidth={80} label="区域" name="province">
              <Input defaultValue={provinceName} disabled />
            </CyFormItem>
          </Col>
          <Col>
            <CyFormItem labelWidth={120} label="所属供电公司" name="companyId">
              <UrlSelect
                style={{ width: '342px' }}
                url="/ElectricityCompany/GetListByAreaId"
                titlekey="text"
                valuekey="text"
                placeholder="请选择供电公司"
                extraParams={{ areaId: province }}
                allowClear
                onChange={(value: any) => setCompanyId(value)}
              />
            </CyFormItem>
          </Col>
        </Row>

        <CyFormItem
          labelWidth={80}
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传利库文件' }]}
        >
          <FileUpload
            accept=".xlsx"
            uploadFileBtn
            trigger={triggerUploadFile}
            uploadFileFn={saveLineStreesSagEvent}
            maxCount={1}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default ImportWareHouse
