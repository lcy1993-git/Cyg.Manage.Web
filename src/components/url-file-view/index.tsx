import request from '@/utils/request';
import ApiFileView from '../api-file-view';
import { cyRequest, baseUrl } from '@/services/common';
import type { FileType } from '../api-file-view/getStrategyComponent';

interface UrlFileViewProps {
  url: string;
  fileType: FileType,
  params?: any,
  method?: "POST" | "GET",
  requestSource: 'common' | 'project' | 'resource' | 'tecEco' | 'tecEco1'
}

const UrlFileView: React.FC<UrlFileViewProps & Record<string, unknown>> = ({
  url,
  fileType,
  params = {},
  method = "GET",
  requestSource = 'project',
  ...rest
}) => {
  let api: any = null;
  if(fileType === "dwg") {
    api = {
      url: `${baseUrl[requestSource]}${url}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem("Authorization")
      }
    }
  }else{
    api = () => {
      const paramsData = method === "GET" ? {params} : { data: params }
      return cyRequest<any[]>(() =>
        request(`${baseUrl[requestSource]}${url}`, {
          method,
          responseType: "arrayBuffer",
          ...paramsData
        }),
      );
    };
  }

  return <ApiFileView type={fileType} api={api} {...rest}/>
}

export default UrlFileView;
