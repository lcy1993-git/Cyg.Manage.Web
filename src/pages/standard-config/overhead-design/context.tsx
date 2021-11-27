import { createContext, useContext } from 'react'

interface OverHeadDesignContextProps {
  isRefresh?: boolean
}

// export const initState = { isRefresh: false }

export const OverHeadContext = createContext({} as OverHeadDesignContextProps)

export const OverHeadProvider = OverHeadContext.Provider

export const useOverHeadStore = () => useContext(OverHeadContext)
