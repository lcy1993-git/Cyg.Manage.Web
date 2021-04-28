import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import { createContext, useContext } from 'react';
export interface StateType {
  filterCondition: EngineerProjetListFilterParams;
}

const initState: StateType = {
  filterCondition: { kvLevel: -1 },
};

function Store(vState: StateType) {
  return makeAutoObservable({
    vState,
    setFilterCondition(filterCondition: EngineerProjetListFilterParams) {
      this.vState.filterCondition = filterCondition;
    },
    setTableFilterCondition( ) {
      
    }
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
