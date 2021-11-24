import { useCallback, useEffect } from 'react'
import { SaveHistoryData } from '../service'
import { HistoryState } from '../store'
import { message } from 'antd'

type useSavaDataProps = Pick<HistoryState, 'historyDataSource' | 'mode' | 'preDesignItemData'> & {
  recordVersion: 'hide' | 'save' | 'record'
}

export const useSavaData = ({
  mode,
  historyDataSource,
  recordVersion,
  preDesignItemData,
}: useSavaDataProps) => {
  const check = useCallback(async () => {
    if (recordVersion === 'save' && ['record', 'recordEdit'].includes(mode)) {
      await SaveHistoryData(historyDataSource)
      message.success('保存成功')
    } else if (recordVersion === 'save' && ['preDesign', 'preDesigning'].includes(mode)) {
      historyDataSource.id = preDesignItemData?.id
      await SaveHistoryData(historyDataSource)
      message.success('保存成功')
    }
  }, [historyDataSource, mode, recordVersion])
  useEffect(() => {
    check()
  }, [check])
}
