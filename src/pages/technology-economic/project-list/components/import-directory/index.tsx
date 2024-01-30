import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { baseUrl } from '@/services/common'
import { downLoadTemplate } from '@/services/technology-economic/project-list'
import { uploadAuditLog } from '@/utils/utils'
import { Button, message } from 'antd'
import React from 'react'

interface ResponsData {}

const ImportDirectory: React.FC<ResponsData> = () => {
  const downLoad = async () => {
    const res = await downLoadTemplate({})
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    let finallyFileName = `模板.xlsx`
    //for IE
    // @ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // @ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finallyFileName)
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finallyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
    message.success('下载成功')
    uploadAuditLog([
      {
        auditType: 1,
        eventType: 5,
        eventDetailType: '文件下载',
        executionResult: '成功',
        auditLevel: 2,
        serviceAdress: `${baseUrl.tecEco1}/RateTable/DownloadTemplate`,
      },
    ])
  }
  return (
    <>
      <CyFormItem label="下载模板" labelWidth={100} required>
        <Button
          className="mr7"
          type="primary"
          onClick={() => {
            downLoad()
          }}
        >
          下载模板
        </Button>
      </CyFormItem>

      <CyFormItem label="上传文件" name="file" required>
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  )
}

export default ImportDirectory
