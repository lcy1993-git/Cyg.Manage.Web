import { useLayoutStore } from '@/layouts/context'
import { useEffect, useRef } from 'react'
import { Location } from 'umi'
import { HistoryDispatch, HistoryState } from '../store'

type States = {
  location: Location<unknown>
  mode: HistoryState['mode']
}

/** 预设计初始化逻辑 */
export const usePreDesign = (
  { location: { pathname }, mode }: States,
  dispatch: HistoryDispatch
) => {
  const { preDesignItem } = useLayoutStore()

  const lastPreDesignItem = useRef(preDesignItem)

  useEffect(() => {
    if (pathname === '/visualization-results/grid-pre-design') {
      if (preDesignItem.id) {
        dispatch({ type: 'changePreDesignItemData', payload: preDesignItem })

        if (lastPreDesignItem.current.id !== preDesignItem.id) {
          // 点击新的工程项目，回到默认状态
          dispatch({ type: 'changeMode', payload: 'preDesign' })
        }
      } else {
        // 解决刷新获取不到项目数据
        const localPreDesignItem = localStorage.getItem('preDesignItem')
        if (
          localPreDesignItem &&
          localPreDesignItem !== 'null' &&
          localPreDesignItem !== 'undefined'
        ) {
          dispatch({ type: 'changePreDesignItemData', payload: JSON.parse(localPreDesignItem) })
        }
      }
    }
  }, [preDesignItem, pathname, dispatch])

  useEffect(() => {
    lastPreDesignItem.current = preDesignItem
  }, [preDesignItem])
}
