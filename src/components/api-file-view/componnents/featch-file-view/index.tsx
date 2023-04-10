import type { FileType } from '../../getStrategyComponent'
import getStrategyComponent from '../../getStrategyComponent'

import { useMount } from 'ahooks'
import type { ReactElement } from 'react'
import { useState } from 'react'

export type FeatchFileViewProps = {
  api: () => Promise<any>
  type: FileType
  onError?: () => void
  emptySlot?: () => ReactElement
} & Record<string, any>

const FeatchFileView: React.FC<FeatchFileViewProps> = ({
  api,
  type,
  onError,
  emptySlot,
  ...rest
}) => {
  const [data, setData] = useState<ArrayBuffer | null>(null)

  useMount(() => {
    api()
      .then((res) => {
        setData(res)
      })
      .catch(() => {
        onError?.()
      })
  })
  if (!data) {
    return emptySlot ? emptySlot() : <></>
  }
  return getStrategyComponent(type)!(rest)
}

export default FeatchFileView
