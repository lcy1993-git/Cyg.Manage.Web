import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface MyWorkContextProps {
  currentClickTabType: string
  currentClickTabChildActiveType: string
  setCurrentClickTabChildActiveType: Dispatch<SetStateAction<string>>
}

export const MyWorkContext = createContext({} as MyWorkContextProps)

export const MyWorkProvider = MyWorkContext.Provider

export const useMyWorkStore = () => useContext(MyWorkContext)
