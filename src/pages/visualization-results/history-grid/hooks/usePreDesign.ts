import { useLayoutStore } from '@/layouts/context'
import { message } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { initPreDesign } from '../service'
import { HistoryDispatch, HistoryState, INITIAL_DATA_SOURCE, INITIAL_STATE } from '../store'

/** 预设计初始化逻辑 */
export const usePreDesign = (
  { mode }: { mode: HistoryState['mode'] },
  dispatch: HistoryDispatch
) => {
  const { preDesignItem } = useLayoutStore()

  // 记录上次的项目数据，因为修改了对象 preDesignItem 引用，因此可能还是同一份数据
  const lastPreDesignItem = useRef<HistoryState['preDesignItemData']>()

  /** 初始化 */
  const init = useCallback(
    async (preDesignItemData: HistoryState['preDesignItemData'], flag: { cancel: boolean }) => {
      dispatch({
        type: 'reset',
        payload: { ...INITIAL_STATE, mode: 'preDesign', preDesignItemData },
      })

      try {
        const { content } = await initPreDesign(preDesignItemData.id)

        // 出现竞态，取消状态修改
        if (flag.cancel) return

        dispatch({
          type: 'changePreDesignDataSource',
          payload: { ...INITIAL_DATA_SOURCE, id: content },
        })
      } catch (e: any) {
        if (flag.cancel) return
        message.error(e?.message || '初始化预设计失败，请重试')
      }
    },
    [dispatch]
  )

  useEffect(() => {
    // 是否执行了初始化
    let executedInit = false
    // 标记，用以当出现竞态时，取消上一次初始化函数中的修改状态操作
    let flag = { cancel: false }

    if (mode === 'preDesign' || mode === 'preDesigning') {
      let preDesignItemPayload

      if (preDesignItem?.id) {
        // 从我的工作台项目进入
        preDesignItemPayload = preDesignItem
      } else {
        // 刷新页面
        preDesignItemPayload = JSON.parse(localStorage.getItem('preDesignItem') || 'null')
      }

      // 上一个项目数据
      const lastItem = lastPreDesignItem.current

      if (!lastItem || (preDesignItemPayload && lastItem.id !== preDesignItemPayload.id)) {
        // * (首次从我的工作台项目进入 | 后续从不同项目再次进入 | 刷新页面 ) => 初始化

        executedInit = true
        init(preDesignItemPayload, flag)

        lastPreDesignItem.current = preDesignItemPayload
      }
    }

    return () => {
      if (executedInit) {
        // 如果上次 effect 中执行了初始化
        flag.cancel = true
      }
    }
  }, [preDesignItem, dispatch, mode, init])
}
