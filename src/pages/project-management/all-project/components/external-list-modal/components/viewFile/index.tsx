import FileDocxView from '@/components/api-file-view/componnents/file-docx-view'
import XlsxViewer from '@/components/api-file-view/componnents/file-excel-view'
import { baseUrl } from '@/services/common'
import { downLoadFileItem } from '@/services/operation-config/company-file'
import { handleSM2Crypto } from '@/utils/utils'
import React, { useEffect, useState } from 'react'

interface UrlFileViewProps {
  url?: string
  params?: any
  // method?: 'POST' | 'GET'
  requestSource?: 'common' | 'project' | 'resource' | 'review'
}

const ViewAuditFile: React.FC<UrlFileViewProps & Record<string, unknown>> = ({
  url = '/Download/GetFileById',
  params = {},
  requestSource = 'upload',
}) => {
  const [data, setData] = useState(null)
  let isTrans = localStorage.getItem('isTransfer')
  //场内测试代码
  // let handleUrl = `${baseUrl.upload}`.slice(4)
  // let targetUrl = encodeURIComponent(`https://srthkf1.gczhyun.com:21530${handleUrl}`)
  // let proxyUrl = `https://srthkf1.gczhyun.com:21530/glzz/commonGet?target_url=${targetUrl}`
  let handleUrl = `${baseUrl[requestSource]}${url}`
  let targetUrl = handleSM2Crypto(`http://172.2.48.22${handleUrl}`)
  let proxyUrl = `http://117.191.93.63:21525/commonGet?param=${targetUrl}`

  useEffect(() => {
    const { id } = params
    if (!(params.extension === '.xlsx')) {
      downLoadFileItem({ fileId: id }).then((res) => {
        setData(res)
      })
    }
  }, [])

  let api: any = null
  if (params.extension === '.xlsx') {
    const excelUrl = Number(isTrans) === 1 ? `${proxyUrl}` : `${baseUrl[requestSource]}${url}`
    api = `${excelUrl}?fileId=${params.id}&token=${window.localStorage.getItem('Authorization')}`

    return <XlsxViewer url={api} />
  } else {
    return data ? <FileDocxView data={data} /> : null
  }
}

export default ViewAuditFile
