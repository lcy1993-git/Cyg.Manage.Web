// import FileDwgView from '../api-file-view/componnents/file-dwg-view';
import PdfFileView from '@/components/pdf-file-view'
import { baseUrl } from '@/services/common'
import request from '@/utils/request'
import React from 'react'
import ApiFileView from '../api-file-view'
import XlsxViewer from '../api-file-view/componnents/file-excel-view'
import type { FileType } from '../api-file-view/getStrategyComponent'

interface UrlFileViewProps {
  url?: string
  fileType: FileType
  params?: any
  method?: 'POST' | 'GET'
  requestSource?: 'common' | 'project' | 'resource' | 'tecEco' | 'tecEco1' | 'review'
}

const UrlFileView: React.FC<UrlFileViewProps & Record<string, unknown>> = ({
  url = '/Download/GetProjectOutcomeFile',
  fileType,
  params = {},
  method = 'GET',
  requestSource = 'upload',
  ...rest
}) => {
  let api: any = null
  let proxyUrl = `http://10.6.1.111:8082/commonGet?target_url=https://srthkf2.gczhyun.com:21530`
  if (fileType === 'pdf') {
    api = {
      url: `${baseUrl[requestSource]}${url}?path=${params.path}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    }
    console.log(api.url)

    return <PdfFileView params={api} hasAuthorization={true} {...rest} />
  } else if (fileType === 'xlsx') {
    api = `${baseUrl[requestSource]}${url}?path=${params.path}&token=${window.localStorage.getItem(
      'Authorization'
    )}`
    return <XlsxViewer url={api} />
  } else {
    api = () => {
      const paramsData = method === 'GET' ? { params } : { data: params }
      return request(`${baseUrl[requestSource]}${url}`, {
        method,
        responseType: 'arrayBuffer',
        ...paramsData,
      })
    }
    return <ApiFileView type={fileType} api={api} {...rest} />
  }
}

export default UrlFileView
