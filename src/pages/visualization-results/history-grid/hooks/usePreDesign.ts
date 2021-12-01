import { useLayoutStore } from '@/layouts/context'
import { useCallback, useEffect, useRef } from 'react'
import { HistoryDispatch, INITIAL_DATA_SOURCE } from '../store'
import { useGridType } from './useGridType'

/** 预设计初始化逻辑 */
export const usePreDesign = (dispatch: HistoryDispatch) => {
  const gridType = useGridType()

  const { preDesignItem } = useLayoutStore()

  const lastPreDesignItem = useRef(preDesignItem)

  const init = useCallback(() => {
    dispatch({ type: 'changeMode', payload: 'preDesign' })
    dispatch({ type: 'changePreDesignDataSource', payload: INITIAL_DATA_SOURCE })
  }, [dispatch])

  useEffect(() => {
    if (gridType === 'preDesign') {
      let preDesignItemPayload

      if (preDesignItem.id) {
        if (lastPreDesignItem.current.id !== preDesignItem.id) {
          // 点击新的工程项目，回到默认状态
          init()
        }

        preDesignItemPayload = preDesignItem
      } else {
        // 解决刷新获取不到项目数据
        preDesignItemPayload = JSON.parse(localStorage.getItem('preDesignItem') || 'null')
      }

      if (preDesignItemPayload) {
        dispatch({ type: 'changePreDesignItemData', payload: preDesignItemPayload })
      }
    }
  }, [preDesignItem, dispatch, gridType, init])

  useEffect(() => {
    lastPreDesignItem.current = preDesignItem
  }, [preDesignItem])
}
