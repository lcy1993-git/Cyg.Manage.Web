import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

/**
 * company -> 所有公司级
 * project -> 单个公司级
 */
export type DataType = 'company' | 'project'
export type CompanyInfo = {
  companyName?: string
  companyId?: string
}

interface ProjectAllAreaStatisticsProps {
  dataType: DataType
  companyInfo: CompanyInfo
  projectShareCompanyId: string
  setDataType: Dispatch<SetStateAction<DataType>>
  setProjectShareCompanyId: Dispatch<SetStateAction<string>>
  setCompanyInfo: Dispatch<SetStateAction<CompanyInfo>>
}

const ProjectAllAreaStatisticsContext = createContext({} as ProjectAllAreaStatisticsProps)

export const ProjectAllAreaStatisticsProvider = ProjectAllAreaStatisticsContext.Provider

export const useProjectAllAreaStatisticsStore = () => useContext(ProjectAllAreaStatisticsContext)
