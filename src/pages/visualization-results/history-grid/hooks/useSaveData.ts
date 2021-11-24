import { useCallback, useEffect } from 'react'
import { SaveHistoryData } from '../service'
import { HistoryState } from '../store'
import { message } from 'antd'

type useSavaDataProps = Pick<HistoryState, 'historyDataSource' | 'mode'> & {
  recordVersion: 'hide' | 'save' | 'record'
}

export const useSavaData = ({ mode, historyDataSource, recordVersion }: useSavaDataProps) => {
  const check = useCallback(async () => {
    if (recordVersion === 'save') {
      await SaveHistoryData(historyDataSource)
      message.success('保存成功')
    }
  }, [historyDataSource, mode, recordVersion])
  useEffect(() => {
    check()
  }, [check])
}
