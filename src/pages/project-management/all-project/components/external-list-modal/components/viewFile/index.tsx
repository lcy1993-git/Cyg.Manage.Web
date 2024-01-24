import FileDocxView from '@/components/api-file-view/componnents/file-docx-view'
import XlsxViewer from '@/components/api-file-view/componnents/file-excel-view'
import { baseUrl } from '@/services/common'
import { downLoadFileItem } from '@/services/operation-config/company-file'
import { handleGetUrl } from '@/utils/utils'
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

  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : 'http://localhost:8000/api'

  const handleUrl = `${baseUrl[requestSource]}${url}`
  const targetUrl = handleGetUrl(
    { fileId: params.id, token: window.localStorage.getItem('Authorization') },
    handleUrl
  )
  const proxyUrl = `${currentHost}/commonGet${targetUrl}`

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
    api = proxyUrl

    return <XlsxViewer url={api} />
  } else {
    return data ? <FileDocxView data={data} /> : null
  }
}

export default ViewAuditFile
