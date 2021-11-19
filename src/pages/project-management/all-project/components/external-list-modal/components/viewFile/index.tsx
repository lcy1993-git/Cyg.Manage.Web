import FileDocxView from '@/components/api-file-view/componnents/file-docx-view'
import XlsxViewer from '@/components/api-file-view/componnents/file-excel-view'
import { baseUrl } from '@/services/common'
import { getFileStream } from '@/services/project-management/all-project'
import React, { useState } from 'react'

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
  let api: any = null
  if (params.extension === '.xlsx') {
    api = `${baseUrl[requestSource]}${url}?url=${encodeURIComponent(params.url)}&extension=${
      params.extension
    }&token=${window.localStorage.getItem('Authorization')}`

    return <XlsxViewer url={api} />
  } else {
    const { url, extension } = params
    getFileStream({ url, extension }).then((res) => {
      setData(res)
    })
    // const { data } = useRequest((res) => {
    //   setData(res)
    // });

    return data ? <FileDocxView data={data} /> : null
  }
}

export default ViewAuditFile
