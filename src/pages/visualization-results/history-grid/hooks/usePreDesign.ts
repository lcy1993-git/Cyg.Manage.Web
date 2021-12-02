import { useLayoutStore } from '@/layouts/context'
import { message } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { initPreDesign } from '../service'
import { HistoryDispatch, HistoryState, INITIAL_DATA_SOURCE, INITIAL_STATE } from '../store'
import { useGridType } from './useGridType'

/** 预设计初始化逻辑 */
export const usePreDesign = (dispatch: HistoryDispatch) => {
  const { preDesignItem } = useLayoutStore()

  const gridType = useGridType()

  // 记录上次的项目数据，因为修改了对象 preDesignItem 引用，因此可能还是同一份数据
  const lastPreDesignItem = useRef<HistoryState['preDesignItemData']>()

  /** 初始化 */
  const init = useCallback(
    async (preDesignItemData: HistoryState['preDesignItemData']) => {
      dispatch({ type: 'reset', payload: { ...INITIAL_STATE, mode: gridType, preDesignItemData } })

      try {
        const { content } = await initPreDesign(preDesignItemData.id)

        dispatch({
          type: 'changePreDesignDataSource',
          payload: { ...INITIAL_DATA_SOURCE, id: content },
        })
      } catch (e: any) {
        message.error(e?.message || '初始化预设计失败，请重试')
      }
    },
    [dispatch, gridType]
  )

  useEffect(() => {
    if (gridType === 'preDesign') {
      let preDesignItemPayload

      if (preDesignItem?.id) {
        preDesignItemPayload = preDesignItem
      } else {
        // 解决刷新获取不到项目数据
        preDesignItemPayload = JSON.parse(localStorage.getItem('preDesignItem') || 'null')
      }

      // 上一个项目数据
      const lastItem = lastPreDesignItem.current

      if (!lastItem || (preDesignItemPayload && lastItem.id !== preDesignItemPayload.id)) {
        // * 首次打开 | 刷新页面 | 从不同项目再次进入 => 初始化
        init(preDesignItemPayload)
      }
    }
  }, [preDesignItem, dispatch, gridType, init])

  useEffect(() => {
    lastPreDesignItem.current = preDesignItem
  }, [preDesignItem])
}
