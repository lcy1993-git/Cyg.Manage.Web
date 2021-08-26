import { useState } from "react";
import type { ReactElement } from "react";
import { useMount } from "ahooks";
import { Empty } from "antd";
import FileDwgView from "./componnents/file-dwg-view";
import getStrategyComponent from './getStrategyComponent';
import type { FileType } from './getStrategyComponent';

type ApiFileViewProps = {
  api: () => Promise<ArrayBuffer>;
  type: FileType;
  onError?: () => void;
  emptySlot?: () => ReactElement;
  
} & Record<string, unknown>;

const ApiFileView: React.FC<ApiFileViewProps> = ({
  api,
  type,
  onError,
  emptySlot,
  ...rest
}) => {

  const [data, setData] = useState<ArrayBuffer | null>(null);

  useMount(() => {
    if (type !== "dwg") {
      api().then((res) => {
        setData(res)
      }).catch(() => {
        onError?.()
      })
    }
  })

  if (!data) {
    return <Empty />
  }
  if (type === "dwg") {
    return <FileDwgView params={api} hasAuthorization={true} {...rest}/>
  }
  const Component = getStrategyComponent(type)!;
  return <Component data={data} {...rest} />
}

export { ApiFileView as default} ;