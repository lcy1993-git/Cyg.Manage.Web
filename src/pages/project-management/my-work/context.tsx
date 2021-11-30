import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface MyWorkContextProps {
  myWorkInitData: any[]
  currentClickTabType: string
  currentClickTabChildActiveType: string
  selectedFavId: string
  favName?: string
  sideVisible?: boolean
  indexToPageSearchParams: any
  setIndexToPageSearchParams: Dispatch<SetStateAction<any>>
  setCurrentClickTabChildActiveType: Dispatch<SetStateAction<string>>
  setSideVisible?: Dispatch<SetStateAction<boolean>>
  refreshStatistics: any
}

export const MyWorkContext = createContext({} as MyWorkContextProps)

export const MyWorkProvider = MyWorkContext.Provider

export const useMyWorkStore = () => useContext(MyWorkContext)
