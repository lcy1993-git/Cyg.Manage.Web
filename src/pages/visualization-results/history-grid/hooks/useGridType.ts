import { useLocation } from 'umi'
import { HistoryState } from '../store'

type GridType = Exclude<HistoryState['mode'], 'recordEdit' | 'preDesigning'>

export const useGridType = (): GridType => {
  const { pathname } = useLocation()

  return pathname.indexOf('grid-pre-design') > -1 ? 'preDesign' : 'record'
}
