import { Location } from 'umi'
import { ReducerState } from '.'
import { HistoryGridVersion } from '../../components/history-version-management'
import { initGridMapState } from './mapReducer'

export type InitParams = {
  location: Location<unknown>
}

/** 惰性初始化 */
export const initializeHistoryState = ({ location }: InitParams) => {
  const { pathname } = location
  const mode = pathname.includes('history-grid') ? 'record' : 'preDesign'

  const initialState: ReducerState = {
    mode,
    refetch: false,
    gridMapState: initGridMapState as any,
    historyGridVersion: {} as HistoryGridVersion,
    historyDataSource: {
      id: '',
      equipments: [],
      lines: [],
    },
    selectedData: [],
    UIStatus: {
      showTitle: true,
      showHistoryLayer: true,
      currentLocation: false,
      currentProject: false,
      importModalVisible: false,
      drawing: false,
      mapType: 'satellite',
      recordVersion: 'hide',
      cleanSelected: false,
      currentMousePosition: [0, 0],
    },
  }

  return initialState
}
