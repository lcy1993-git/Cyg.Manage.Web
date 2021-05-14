import {createContext, useContext} from "react"

interface LayoutContextValue {
    clearAgainLogin: () => void
}

const LayoutContext = createContext({} as LayoutContextValue);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutStore = () => useContext(LayoutContext)

