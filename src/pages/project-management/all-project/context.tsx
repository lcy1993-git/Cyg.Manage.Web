import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface ProjectListProps {
  urlList?: string
  setUrlList?: Dispatch<SetStateAction<string>>
}

export const ProjectListContext = createContext({} as ProjectListProps)

export const ProjectListProvider = ProjectListContext.Provider

export const useProjectListStore = () => useContext(ProjectListContext)
