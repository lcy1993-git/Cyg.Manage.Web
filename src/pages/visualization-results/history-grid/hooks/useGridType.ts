import { useLocation } from 'umi'

type GridType = 'preDesign' | 'history' | ''

export const useGridType = (): GridType => {
  const { pathname } = useLocation()

  return pathname.indexOf('grid-pre-design') > -1
    ? 'preDesign'
    : pathname.indexOf('history-grid') > -1
    ? 'history'
    : ''
}
