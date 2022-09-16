import { useMount } from 'ahooks'
import { Empty, message } from 'antd'
import type { ReactElement } from 'react'
import { useState } from 'react'
import type { FileType } from './getStrategyComponent'
import getStrategyComponent from './getStrategyComponent'

type ApiFileViewProps = {
  api: () => Promise<ArrayBuffer>
  type: FileType
  onError?: () => void
  emptySlot?: () => ReactElement
} & Record<string, unknown>

const ApiFileView: React.FC<ApiFileViewProps> = ({ api, type, onError, emptySlot, ...rest }) => {
  const [data, setData] = useState<ArrayBuffer | null>(null)

  useMount(async () => {
    if (type !== 'pdf') {
      const res = await api()
      if (Object.prototype.toString.call(res) === '[object ArrayBuffer]') {
        setData(res)
      } else {
        message.error('文件读取失败')
      }
    }
  })

  if (!data) {
    return <Empty />
  }
  const Component = getStrategyComponent(type)!
  return <Component data={data} {...rest} />
}

export { ApiFileView as default }
