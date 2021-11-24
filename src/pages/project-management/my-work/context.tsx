import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface MyWorkContextProps {
  myWorkInitData: any[]
  currentClickTabType: string
  currentClickTabChildActiveType: string
  setCurrentClickTabChildActiveType: Dispatch<SetStateAction<string>>
  refreshStatistics: any
}

export const MyWorkContext = createContext({} as MyWorkContextProps)

export const MyWorkProvider = MyWorkContext.Provider

export const useMyWorkStore = () => useContext(MyWorkContext)
