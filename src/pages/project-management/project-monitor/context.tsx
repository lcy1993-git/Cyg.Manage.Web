import { Moment } from 'moment'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface ProjectMonitorContextProps {
  setStartDate: Dispatch<SetStateAction<any>>
  setEndDate: Dispatch<SetStateAction<any>>
  startDate?: Moment | null
  endDate?: Moment | null
}

export const ProMonitorContext = createContext({} as ProjectMonitorContextProps)

export const MonitorProvider = ProMonitorContext.Provider

export const useProMonitorStore = () => useContext(ProMonitorContext)
