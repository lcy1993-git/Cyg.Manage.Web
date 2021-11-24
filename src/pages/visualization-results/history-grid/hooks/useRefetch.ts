import { useEffect } from 'react'
import { getAllGridVersions, getDataByProjectId } from '../service'
import { HistoryDispatch, HistoryState } from '../store'

type UseRefetch = (
  states: Pick<HistoryState, 'refetch' | 'mode' | 'preDesignItemData'>,
  dispatch: HistoryDispatch
) => void

/** 重新获取网架数据 */
export const useRefetch: UseRefetch = ({ refetch, mode, preDesignItemData }, dispatch) => {
  useEffect(() => {
    let cancel = false

    async function refetchData() {
      const isHistory = mode === 'recordEdit' || mode === 'record'

      let payload

      if (isHistory) {
        // 历史网架
        const res = await getAllGridVersions()
        dispatch({ type: 'changeAllHistoryGridData', payload: res.content })

        payload = res.content.find((s: any) => s.isTemplate === true)
      } else {
        // 预设计
        if (!preDesignItemData) return

        payload = await getDataByProjectId(preDesignItemData.id)
      }

      if (!cancel) {
        dispatch({ type: 'changeCurrentGridData', payload: payload })
      }
    }

    refetchData()

    return () => {
      cancel = true
    }
  }, [refetch, mode, preDesignItemData, dispatch])
}
