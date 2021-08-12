import FileXlsxView from "@/components/file-xlsx-view";
import { useMount } from "ahooks";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";

type FeatchFileViewProps = {
  api: () => Promise<any>;
  type: string;
  onError?: () => void;
  emptySlot?: () => ReactElement;
} & Record<string, any>;

const FeatchFileView: React.FC<FeatchFileViewProps> = ({
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
  if(!data) {
    return emptySlot ? emptySlot() : <></>;
  }if(type === 'xlsx' || type === 'xls') {
    return (
      <FileXlsxView data={data} {...rest}/>
    )
  }
    return <></>
}

export default FeatchFileView;