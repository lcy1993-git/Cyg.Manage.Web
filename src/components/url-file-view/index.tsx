// import FileDwgView from '../api-file-view/componnents/file-dwg-view';
import PdfFileView from '@/components/pdf-file-view'
import { baseUrl } from '@/services/common'
import request from '@/utils/request'
import { handleGetUrl } from '@/utils/utils'
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

  //场内测试代码
  // let handleUrl = `${baseUrl.upload}`.slice(4)
  // let targetUrl = encodeURIComponent(`https://srthkf1.gczhyun.com:21530${handleUrl}`)
  // let proxyUrl = `https://srthkf1.gczhyun.com:21530/glzz/commonGet?target_url=${targetUrl}`
  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : 'http://localhost:8000/api'
  const handleUrl = `${baseUrl[requestSource]}${url}`
  // let targetUrl = handleSM2Crypto(`${handleUrl}`)
  const proxyUrl = `${currentHost}/commonGet`

  if (fileType === 'pdf') {
    api = {
      url: `${proxyUrl}${handleGetUrl({ path: params.path }, handleUrl)}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    }

    return <PdfFileView params={api} hasAuthorization={true} {...rest} />
  } else if (fileType === 'xlsx') {
    api = `${proxyUrl}${handleGetUrl(
      { path: params.path, token: window.localStorage.getItem('Authorization') },
      handleUrl
    )}`

    return <XlsxViewer url={api} />
  } else {
    api = () => {
      const paramsData = method === 'GET' ? { params } : { data: params }
      return request(handleUrl, {
        method,
        responseType: 'arrayBuffer',
        ...paramsData,
      })
    }
    return <ApiFileView type={fileType} api={api} {...rest} />
  }
}

export default UrlFileView
