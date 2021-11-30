import { createContext, SetStateAction, useContext } from 'react'

interface LayoutContextValue {
  resourceManageFlag?: boolean
  workHandoverFlag?: boolean
  clearAgainLogin?: () => void
  mapSelectCity?: string

  allProjectSearchParams?: any
  setResourceManageFlag?: (value: boolean) => void
  setMapSelectCity?: (value: string) => void
  setWorkHandoverFlag?: (value: boolean) => void

  setAllProjectSearchParams?: (value?: any) => void
  removeTab?: (value: string) => void
  /** 预设计 */
  preDesignItem?: any
  setPreDesignItem: React.Dispatch<SetStateAction<any>>
  favoriteFlag?: boolean
  setFavoriteFlag?: (value: boolean) => void
}

const LayoutContext = createContext({} as LayoutContextValue)

export const LayoutProvider = LayoutContext.Provider

export const useLayoutStore = () => useContext(LayoutContext)
