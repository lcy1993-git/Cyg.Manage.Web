import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-tree'
import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'
export interface ProjectInfo {
  projectId: string
  engineerId: string
}
export interface StateType {
  filterCondition: EngineerProjetListFilterParams
  projectInfo?: ProjectInfo
}

const initState: StateType = {
  filterCondition: { kvLevel: -1 },
}

function Store(vState: StateType) {
  return makeAutoObservable({
    vState,
    setFilterCondition(filterCondition: EngineerProjetListFilterParams) {
      this.vState.filterCondition = filterCondition
    },
    setProjectInfo(projectInfo: ProjectInfo) {
      this.vState.projectInfo = projectInfo
    },
  })
}

const store = Store(initState)
const StateContext = createContext(store)
function useContainer() {
  return useContext(StateContext)
}
const Provider: React.FC = ({ children }) => {
  return <StateContext.Provider value={store}>{children}</StateContext.Provider>
}

export { useContainer, Provider }
