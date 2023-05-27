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
  let isTrans = localStorage.getItem('isTransfer')
  let api: any = null

  //场内测试代码
  // let handleUrl = `${baseUrl.upload}`.slice(4)
  // let targetUrl = encodeURIComponent(`https://srthkf1.gczhyun.com:21530${handleUrl}`)
  // let proxyUrl = `https://srthkf1.gczhyun.com:21530/glzz/commonGet?target_url=${targetUrl}`
  let handleUrl = `${baseUrl[requestSource]}${url}`
  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)
  let proxyUrl = `http://117.191.93.63:21525/commonGet?target_url=${targetUrl}`

  if (fileType === 'pdf') {
    api = {
      url:
        Number(isTrans) === 1
          ? `${proxyUrl}?path=${params.path}`
          : `${baseUrl[requestSource]}${url}?path=${params.path}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    }

    return <PdfFileView params={api} hasAuthorization={true} {...rest} />
  } else if (fileType === 'xlsx') {
    const excelUrl = Number(isTrans) === 1 ? `${proxyUrl}` : `${baseUrl[requestSource]}${url}`
    api = `${excelUrl}?path=${params.path}&token=${window.localStorage.getItem('Authorization')}`

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
