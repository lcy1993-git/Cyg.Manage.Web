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

      if (isHistory) {
        // 历史网架
        const res = await getAllGridVersions()
        dispatch({ type: 'changeAllHistoryGridData', payload: res.content })

        const payload = res.content.find((s: any) => s.isTemplate === true)

        if (!cancel) {
          dispatch({ type: 'changeCurrentGridData', payload })
        }
      } else {
        // 预设计
        if (!preDesignItemData) {
          // 没有项目数据
          return
        }

        const res = await getDataByProjectId({ projectIds: [preDesignItemData.id] })

        if (!Array.isArray(res.content) || res.content.length === 0) {
          // 没有数据
          return
        }

        const payload = res.content[0]

        if (!cancel) {
          dispatch({ type: 'changeHistoryDataSource', payload })
        }
      }
    }

    refetchData()

    return () => {
      cancel = true
    }
  }, [refetch, mode, preDesignItemData, dispatch])
}
