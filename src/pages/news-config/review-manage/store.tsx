import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-tree';
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
export interface StateType {
  filterCondition: EngineerProjetListFilterParams;
  projectId?: string;
}

const initState: StateType = {
  filterCondition: {},
};

function Store(vState: StateType) {
  return makeAutoObservable({
    vState,
    setFilterCondition(filterCondition: EngineerProjetListFilterParams) {
      this.vState.filterCondition = filterCondition;
    },
    setProjectId(projectId: string) {
      this.vState.projectId = projectId;
    },
  });
}

const store = Store(initState);
const StateContext = createContext(store);
function useContainer() {
  return useContext(StateContext);
}
const Provider: React.FC = ({ children }) => {
  return <StateContext.Provider value={store}>{children}</StateContext.Provider>;
};

export { useContainer, Provider };
