import React from 'react'
import { Input, Button, message } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import { downLoadTemplateExcel } from '@/services/technology-economic/spread-coefficient'
import rules from '../../rule'
import { uploadAuditLog } from '@/utils/utils'
import { baseUrl } from '@/services/common'
interface IForm {
  type?: 'add' | 'edit'
  selectList?: number[]
}
const AddOrEditForm: React.FC<IForm> = (props) => {
  const { type } = props
  const downLoad = async () => {
    const res = await downLoadTemplateExcel({})
    let blob = new Blob([res], {
      type: `application/xlsx`,
    })
    let finallyFileName = `模板.xlsx`
    //for IE
    //@ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //@ts-ignore
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
      <CyFormItem label="地区名称" name="item1" required rules={rules.name}>
        <Input placeholder="请输入地区名称" />
      </CyFormItem>
      <CyFormItem
        label="上传文件"
        name="file"
        required={type === 'add' ? true : false}
        rules={type === 'add' ? rules.file : []}
      >
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  )
}

export default AddOrEditForm
