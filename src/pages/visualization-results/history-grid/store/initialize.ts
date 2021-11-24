import { Location } from 'umi'
import { ReducerState } from '.'
import { HistoryGridVersion } from '../../components/history-version-management'
import { initGridMapState } from './mapReducer'

export type InitParams = {
  location: Location<unknown>
}

/** 惰性初始化 */
const initialize = ({ location }: InitParams) => {
  const { pathname } = location
  const mode = pathname.includes('history-grid') ? 'record' : 'preDesign'

  const initialState: ReducerState = {
    mode,
    gridMapState: initGridMapState as any,
    historyGridVersion: {} as HistoryGridVersion,
    UIStatus: {
      showTitle: true,
      showHistoryLayer: true,
      currentLocation: false,
      currentProject: false,
      importModalVisible: false,
      drawing: false,
      mapType: 'street',
      recordVersion: 'hide',
    },
  }

  return initialState
}

export default initialize
