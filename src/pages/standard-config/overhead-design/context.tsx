import { createContext, useContext } from 'react'

interface OverHeadDesignContextProps {
  refresh: any
}

export const OverHeadContext = createContext({} as OverHeadDesignContextProps)

export const OverHeadProvider = OverHeadContext.Provider

export const useOverHeadStore = () => useContext(OverHeadContext)
