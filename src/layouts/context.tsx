import { createContext, useContext } from 'react';

interface LayoutContextValue {
  resourceManageFlag?: boolean;
  clearAgainLogin?: () => void;
  allProjectSearchProjectId?: string;
  allProjectSearchPerson?: string;
  setResourceManageFlag?: (value: boolean) => void;
  setAllProjectSearchProjectId?: (value: string) => void;
  setAllProjectSearchPerson?: (value: string) => void;
}

const LayoutContext = createContext({} as LayoutContextValue);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutStore = () => useContext(LayoutContext);
