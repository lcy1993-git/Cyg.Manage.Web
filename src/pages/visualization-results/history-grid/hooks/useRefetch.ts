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
        dispatch({ type: 'changeAllHistoryGridData', payload: res })

        const payload = res.find((s: any) => s.isTemplate)

        if (!cancel) {
          dispatch({ type: 'changeCurrentGridData', payload })
        }
      } else {
        // 预设计
        if (!preDesignItemData) {
          // 没有项目数据
          return
        }
        // 历史网架数据
        const resHistory = await getAllGridVersions()
        if (Array.isArray(resHistory) && resHistory?.length !== 0) {
          dispatch({ type: 'changeAllHistoryGridData', payload: resHistory })
          const newHistory = resHistory.find((s: any) => s.isTemplate)
          if (newHistory) {
            dispatch({ type: 'changeHistoryDataSource', newHistory })
          }
        }
        const res = await getDataByProjectId({ projectIds: [preDesignItemData.id] })

        if (!Array.isArray(res.content) || res.content.length === 0) {
          // 没有数据
          return
        }

        const payload = res.content[0]

        if (!cancel) {
          dispatch({ type: 'changePreDesignDataSource', payload })
        }
      }
    }

    refetchData()

    return () => {
      cancel = true
    }
  }, [refetch, mode, preDesignItemData, dispatch])
}
