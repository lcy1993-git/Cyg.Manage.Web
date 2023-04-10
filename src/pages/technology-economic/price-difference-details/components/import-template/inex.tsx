import React from 'react'
import { Button, message } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { downLoadTemplateExcel } from '@/services/technology-economic/spread-coefficient'
import FileUpload from '@/components/file-upload'
import { uploadAuditLog } from '@/utils/utils'
import { baseUrl } from '@/services/common'
interface IForm {
  type?: 'add' | 'edit'
  selectList?: number[]
}
const ImportTemplateForm: React.FC<IForm> = () => {
  const downLoad = async () => {
    const res = await downLoadTemplateExcel({})
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    let finallyFileName = `模板.xlsx`
    //for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
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
        serviceAdress: `${baseUrl.tecEco1}/PriceDifference/DownloadTemplate`,
      },
    ])
  }
  return (
    <>
      <CyFormItem label="文件模板" labelWidth={100}>
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
      <CyFormItem label="上传文件" name="files" required>
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  )
}

export default ImportTemplateForm
