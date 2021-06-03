import {createContext, useContext} from "react"

interface LayoutContextValue {
    clearAgainLogin: () => void
    allProjectSearchProjectName: string
    allProjectSearchPerson: string
    setAllProjectSearchProjectName: (value: string) => void
    setAllProjectSearchPerson: (value: string) => void
}

const LayoutContext = createContext({} as LayoutContextValue);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutStore = () => useContext(LayoutContext)

