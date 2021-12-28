import FileDocxView from '@/components/api-file-view/componnents/file-docx-view'
import XlsxViewer from '@/components/api-file-view/componnents/file-excel-view'
import { baseUrl } from '@/services/common'
import { getFileStream } from '@/services/project-management/all-project'
import React, { useEffect, useState } from 'react'

interface UrlFileViewProps {
  url?: string
  params?: any
  method?: 'POST' | 'GET'
  requestSource?: 'common' | 'project' | 'resource' | 'review'
}

const ViewAuditFile: React.FC<UrlFileViewProps & Record<string, unknown>> = ({
  url = '/ReviewOpinionFile/fileStream',
  fileType,
  params = {},
  method = 'GET',
  requestSource = 'review',
  ...rest
}) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const { url, extension } = params
    if (!(params.extension === '.xlsx')) {
      getFileStream({ url, extension }).then((res) => {
        setData(res)
      })
    }
  }, [])

  let api: any = null
  if (params.extension === '.xlsx') {
    api = `${baseUrl[requestSource]}${url}?url=${encodeURIComponent(params.url)}&extension=${
      params.extension
    }&token=${window.localStorage.getItem('Authorization')}`

    return <XlsxViewer url={api} />
  } else {
    return data ? <FileDocxView data={data} /> : null
  }
}

export default ViewAuditFile
