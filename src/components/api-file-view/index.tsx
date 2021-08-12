import FileXlsxView from "@/components/file-xlsx-view";
import FilePdfView from "./componnents/file-pdf-view";
import { useMount } from "ahooks";
import { Empty } from "antd";
import { PDFJS } from "pdfjs-dist";
import type { ReactElement } from "react";
import { useState } from "react";
import { Children } from "react";

type ApiFileViewProps = {
  api: () => Promise<any>;
  type: string;
  onError?: () => void;
  emptySlot?: () => ReactElement;
} & Record<string, any>;

const ApiFileView: React.FC<ApiFileViewProps> = ({
  api,
  type,
  onError,
  emptySlot,
  ...rest
}) => {

  const [data, setData] = useState<ArrayBuffer | null>(null);

  useMount(() => {
    api().then((res) => {
      setData(res)
    }).catch(() => {
      onError?.()
    })
  })

  const getComponent = () => {
    switch (type) {
      case "xlsx":
        return FileXlsxView
      case "pdf":
        return FilePdfView
    
      default:
        return emptySlot || Empty
        break;
    }
  }

  if(!data) {
    return <Empty />
  }
    return getComponent(data, ...rest)
  
  // if(!data) {
  //   return emptySlot ? emptySlot() : <></>;
  // }else{
  //   switch (type) {
  //     case xlsx:
        
  //       break;
  //     case PDFJS:
        
  //       break;
    
  //     default:
  //       break;
  //   }
  // } if(type === 'xlsx' || type === 'xls') {

  //   return (
  //     <FileXlsxView data={data} {...rest}/>
  //   )
  // }
  //   return <></>
}

export default ApiFileView;