import { Dispatch, SetStateAction } from '@umijs/renderer-react/node_modules/@types/react'
import { createContext, useContext } from 'react'

interface OverHeadDesignContextProps {
  isRefresh?: boolean
  setIsRefresh?: Dispatch<SetStateAction<boolean>>
}

export const OverHeadContext = createContext({} as OverHeadDesignContextProps)

export const OverHeadProvider = OverHeadContext.Provider

export const useOverHeadStore = () => useContext(OverHeadContext)
