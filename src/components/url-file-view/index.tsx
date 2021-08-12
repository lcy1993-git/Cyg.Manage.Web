import request from '@/utils/request';
import { ReactNode } from 'react';
import type { RequestOptionsInit } from 'umi-request';
import FeatchFileView from './componnents/featch-file-view';

type UrlFileViewProps = {
  url: string;
  type: string;
  params?: any; 
  method: "GET" | "POST";
  onError?: () => void;
  requestOptions: RequestOptionsInit;
  emptySlot?: () => ReactNode;
} & Record<string, any>;

const UrlFileView: React.FC<UrlFileViewProps> = ({
  url,
  type,
  method = "GET",
  params,
  requestOptions ={},
  emptySlot,
  ...rest
}) => {

  const api = () => {
    let objParams: any = {};
    if(params){
      if(type === "GET") {
        objParams = { params }
      }else{
        objParams = { data: params }
      }
    }

    return request(url, { method, responseType: "arrayBuffer", ...objParams, ...requestOptions});
  }

  return <FeatchFileView
            api={api}
            type={type}
            emptySlot={emptySlot}
            {...rest}
          />
}

export default UrlFileView;