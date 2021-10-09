import { AreaInfo } from '@/services/index';
import { createContext, useContext } from 'react';

interface LayoutContextValue {
  resourceManageFlag?: boolean;
  workHandoverFlag?: boolean;
  clearAgainLogin?: () => void;
  mapSelectCity?: string;
  allProjectSearchProjectId?: string;
  allProjectSearchPerson?: string;
  allProjectSearchType?: string;
  allProjectAreaInfo?: AreaInfo;
  setResourceManageFlag?: (value: boolean) => void;
  setMapSelectCity?: (value: string) => void;
  setWorkHandoverFlag?: (value: boolean) => void;
  setAllProjectSearchProjectId?: (value: string) => void;
  setAllProjectSearchPerson?: (value: string) => void;
  setAllProjectSearchType?: (value: string) => void;
  setAllProjectAreaInfo?: (value?: AreaInfo) => void;
  removeTab?: (value: string) => void;
}

const LayoutContext = createContext({} as LayoutContextValue);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutStore = () => useContext(LayoutContext);
