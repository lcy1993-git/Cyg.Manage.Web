import { message } from 'antd'
import { useCallback, useEffect } from 'react'
import { saveData, SaveHistoryData } from '../service'
import { HistoryState } from '../store'

type useSavaDataProps = Pick<HistoryState, 'historyDataSource' | 'mode' | 'preDesignDataSource'> &
  Pick<HistoryState['UIStatus'], 'recordVersion'>

/** 保存网架数据 */
export const useSavaData = ({
  mode,
  historyDataSource,
  recordVersion,
  preDesignDataSource,
}: useSavaDataProps) => {
  const save = useCallback(async () => {
    if (recordVersion === 'save') {
      const isHistory = mode === 'record' || mode === 'recordEdit'

      try {
        if (isHistory) {
          // 历史网架
          await SaveHistoryData(historyDataSource)
        } else {
          // 预设计
          await saveData(preDesignDataSource)
        }

        message.success('保存成功')
      } catch (e: any) {
        message.error(e.message || '保存失败，请重试')
      }
    }
  }, [historyDataSource, mode, preDesignDataSource, recordVersion])

  useEffect(() => {
    save()
  }, [save])
}
