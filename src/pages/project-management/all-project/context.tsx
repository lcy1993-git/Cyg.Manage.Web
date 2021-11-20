import type { Dispatch, SetStateAction } from 'react'
import React from 'react'
import { useContext } from 'react'

interface ProjectListProps {
  urlList?: string
  setUrlList?: Dispatch<SetStateAction<string>>
}

export const ProjectListContext = React.createContext({} as ProjectListProps)

export const ProjectListProvider = ProjectListContext.Provider

export const useProjectListStore = () => useContext(ProjectListContext)
