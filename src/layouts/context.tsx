import { createContext, useContext } from 'react';

interface LayoutContextValue {
  resourceManageFlag?: boolean;
  workHandoverFlag?: boolean;
  clearAgainLogin?: () => void;
  allProjectSearchProjectId?: string;
  allProjectSearchPerson?: string;
  allProjectSearchType?: string;
  setResourceManageFlag?: (value: boolean) => void;
  setWorkHandoverFlag?: (value: boolean) => void;
  setAllProjectSearchProjectId?: (value: string) => void;
  setAllProjectSearchPerson?: (value: string) => void;
  setAllProjectSearchType?:  (value: string) => void;
  removeTab?: (value: string) => void;
}

const LayoutContext = createContext({} as LayoutContextValue);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutStore = () => useContext(LayoutContext);
