import ExportAuthorityButton from '@/components/authortiy-export-button'
import CommonTitle from '@/components/common-title'
import CyFormItem from '@/components/cy-form-item'
import FileUpLoad from '@/components/file-upload'
import PageCommonWrap from '@/components/page-common-wrap'
import { baseUrl, commonUpload } from '@/services/common'
import { getLocalPath, uploadAuditLog } from '@/utils/utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, message } from 'antd'
import React from 'react'
import styles from './index.less'

const BasicData: React.FC = () => {
  const [assestsForm] = Form.useForm()
  const [areaForm] = Form.useForm()
  // const [assestsUploadLoading, setAssestsUploadLoading] = useState<boolean>(false);
  const uploadAssests = () => {
    assestsForm.validateFields().then(async (values) => {
      const { assestsFile } = values
      await commonUpload('/Upload/StaticFile', assestsFile, 'file', 'upload')
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 5,
          eventDetailType: '文件上传',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.upload}/Upload/StaticFile`,
        },
      ])
      message.success('上传成功')

      assestsForm.resetFields()
    })
  }

  //上传气象区文件
  const uploadAreaFile = async () => {
    areaForm.validateFields().then(async (values) => {
      const { areaFile } = values
      await commonUpload('/Meteorological/Import', areaFile, 'file', 'project')
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 5,
          eventDetailType: '文件上传',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/Meteorological/Import`,
        },
      ])
      message.success('上传成功')
      areaForm.resetFields()
    })
  }

  return (
    <PageCommonWrap noPadding>
      <div className={styles.basicPage}>
        <div className={styles.assestsUpload}>
          <div style={{ height: '45%', padding: '20px' }}>
            <CommonTitle>静态文件</CommonTitle>
            <Form form={assestsForm}>
              <CyFormItem
                labelWidth={111}
                label="静态文件上传"
                name="assestsFile"
                rules={[{ required: true, message: '请至少上传一个文件' }]}
              >
                <FileUpLoad />
              </CyFormItem>
            </Form>
            <div className={styles.basicPageButtonContent}>
              <Button type="primary" onClick={() => uploadAssests()}>
                <UploadOutlined />
                开始上传
              </Button>
            </div>
          </div>
          <div className={styles.divider}></div>
          {/* 气象数据 */}
          <div style={{ height: '45%', padding: '20px' }}>
            <CommonTitle>气象区文件模板</CommonTitle>
            <Form form={areaForm}>
              <CyFormItem label="气象区文件模板" labelAlign="right" labelWidth={111}>
                <Button type="primary" style={{ width: '80px' }}>
                  <a
                    href={getLocalPath('/template/metareaTemp.xlsx')}
                    download="气象区文件模板.xlsx"
                    onClick={() => {
                      uploadAuditLog([
                        {
                          auditType: 1,
                          eventType: 5,
                          eventDetailType: '文件下载',
                          executionResult: '成功',
                          auditLevel: 2,
                          serviceAdress: `/template/metareaTemp.xlsx`,
                        },
                      ])
                    }}
                  >
                    下载
                  </a>
                </Button>
              </CyFormItem>
              <CyFormItem
                labelWidth={111}
                labelAlign="right"
                label="当前气象区文件"
                name="areaFile"
                rules={[{ required: true, message: '请至少上传一个文件' }]}
              >
                <FileUpLoad accept=".xlsx" />
              </CyFormItem>
            </Form>
            <div className={styles.basicPageButtonContent}>
              <ExportAuthorityButton
                exportUrl="/Meteorological/Export"
                fileName="当前气象区文件"
                labelName="导出文件"
                type="get"
              />
              <Button type="primary" onClick={() => uploadAreaFile()}>
                <UploadOutlined />
                开始上传
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default BasicData
