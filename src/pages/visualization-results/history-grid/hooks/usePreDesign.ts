import { useLayoutStore } from '@/layouts/context'
import { message } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { initPreDesign } from '../service'
import { HistoryDispatch, INITIAL_DATA_SOURCE } from '../store'
import { useGridType } from './useGridType'

/** 预设计初始化逻辑 */
export const usePreDesign = (dispatch: HistoryDispatch) => {
  const gridType = useGridType()

  const { preDesignItem } = useLayoutStore()

  const lastPreDesignItem = useRef(preDesignItem)

  /** 初始化 */
  const init = useCallback(
    async (id: string) => {
      dispatch({ type: 'changeMode', payload: 'preDesign' })

      try {
        const { content } = await initPreDesign(id)
        dispatch({
          type: 'changePreDesignDataSource',
          payload: { ...INITIAL_DATA_SOURCE, id: content },
        })
      } catch (e: any) {
        message.error(e?.message || '初始化预设计失败，请重试')
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (gridType === 'preDesign') {
      let preDesignItemPayload

      if (preDesignItem.id) {
        if (lastPreDesignItem.current.id !== preDesignItem.id) {
          // 点击新的工程项目，回到默认状态
          init(preDesignItem.id)
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
