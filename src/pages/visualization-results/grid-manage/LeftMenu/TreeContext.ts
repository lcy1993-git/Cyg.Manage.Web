import { createContext, Dispatch, SetStateAction, useContext } from 'react'

interface ContextType {
  linesId: string[]
  setlinesId: Dispatch<SetStateAction<string[]>>
  powerSupplyIds: string[]
  setpowerSupplyIds: Dispatch<SetStateAction<string[]>>
  setsubStations: Dispatch<SetStateAction<string[]>>
  subStations: string[]
  settreeLoading: Dispatch<SetStateAction<boolean>>
  treeLoading: boolean
  // 筛选弹窗电压表单项
  kvLevels: number[]
  setKvLevels: Dispatch<SetStateAction<number[]>>
  // 筛选弹窗区域表单项
  areasId: string[]
  setAreasId: Dispatch<SetStateAction<string[]>>
  // 重新获取tree数据标识
  isFilterTree: boolean
  setsFilterTree: Dispatch<SetStateAction<boolean>>
}

// 全局状态管理
export const TreeContext = createContext({} as ContextType)

export const TreeProvider = TreeContext.Provider

export const useTreeContext = () => useContext(TreeContext)
