import request from '@/utils/request';
import ApiFileView from '../api-file-view';
import { cyRequest, baseUrl } from '@/services/common';
import type { FileType } from '../api-file-view/getStrategyComponent';
// import FileDwgView from '../api-file-view/componnents/file-dwg-view';
import PdfFileView from '@/components/pdf-file-view';
import XlsxViewer from '../api-file-view/componnents/file-excel-view';
import React from 'react';

interface UrlFileViewProps {
  url?: string;
  fileType: FileType;
  params?: any;
  method?: 'POST' | 'GET';
  requestSource?: 'common' | 'project' | 'resource' | 'tecEco' | 'tecEco1' | 'review';
}

const UrlFileView: React.FC<UrlFileViewProps & Record<string, unknown>> = ({
  url = '/Download/GetProjectOutcomeFile',
  fileType,
  params = {},
  method = 'GET',
  requestSource = 'upload',
  ...rest
}) => {
  let api: any = null;
  if (fileType === 'pdf') {
    api = {
      url: `${baseUrl[requestSource]}${url}?path=${params.path}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    };
    return <PdfFileView params={api} hasAuthorization={true} {...rest} />;
  } else if (fileType === 'xlsx') {
    api = `${baseUrl[requestSource]}${url}?path=${params.path}&token=${window.localStorage.getItem(
      'Authorization',
    )}`;
    return <XlsxViewer url={api} />;
  } else {
    api = () => {
      const paramsData = method === 'GET' ? { params } : { data: params };
      return request(`${baseUrl[requestSource]}${url}`, {
        method,
        responseType: 'arrayBuffer',
        ...paramsData,
      });
    };
    return <ApiFileView type={fileType} api={api} {...rest} />;
  }
};

export default UrlFileView;
