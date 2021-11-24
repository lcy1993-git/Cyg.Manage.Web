import { useLayoutStore } from '@/layouts/context'
import { useEffect } from 'react'
import { Location } from 'umi'
import { HistoryDispatch } from '../store'

/** 预设计初始化逻辑 */
export const usePreDesign = ({ pathname }: Location<unknown>, dispatch: HistoryDispatch) => {
  const { preDesignItem } = useLayoutStore()

  useEffect(() => {
    if (pathname === '/visualization-results/grid-pre-design') {
      if (preDesignItem.id) {
        dispatch({ type: 'changePreDesignItemData', payload: preDesignItem })
      }
    }
  }, [preDesignItem, pathname, dispatch])
}
