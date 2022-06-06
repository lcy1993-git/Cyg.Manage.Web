import { createContext, Dispatch, SetStateAction, useContext } from 'react'

interface ContextType {
  linesId: string[]
  setlinesId: Dispatch<SetStateAction<string[]>>
  powerSupplyIds: string[]
  setpowerSupplyIds: Dispatch<SetStateAction<string[]>>
  setsubStations: Dispatch<SetStateAction<string[]>>
  subStations: string[]
}

// 全局状态管理
export const TreeContext = createContext({} as ContextType)

export const TreeProvider = TreeContext.Provider

export const useTreeContext = () => useContext(TreeContext)
