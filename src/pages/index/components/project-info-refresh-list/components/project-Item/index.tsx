import { useLayoutStore } from '@/layouts/context'
import React, { FC } from 'react'
import { Link } from 'umi'
import styles from './index.less'
export interface ProjectItemProps {
  name: string
  id: string
  //content: string;
  date: string
  operator: string
  operationCategory: string
}

const ProjectItem: FC<ProjectItemProps> = ({ operator, name, id, date, operationCategory }) => {
  const { setAllProjectSearchProjectId, setAllProjectSearchParams } = useLayoutStore()

  const onClickProject = () => {
    // setAllProjectSearchProjectId(name);
    setAllProjectSearchProjectId?.(id)
    setAllProjectSearchParams?.({
      areaLevel: '-1',
      areaId: '',
      cityId: '',
      searchPerson: '',
      searchType: 'allpro',
    })
  }

  /**
   * count表示是可视条数是多少
   *
   */
  const handle0perator = (propName: string) => {
    if (propName && propName.length > 6) {
      const newOperator = propName.substring(0, 6)
      return `${newOperator}...`
    }
    return propName
  }
  return (
    <div className={styles.projectItem}>
      <div className={styles.operator}>{handle0perator(operator)}</div>
      <div className={styles.operationCategory}>{operationCategory}</div>
      <div className={styles.projectName}>
        <Link
          to={`/project-management/all-project`}
          className={styles.name}
          onClick={onClickProject}
        >
          {name}
        </Link>
      </div>
      <div className={styles.date}>{date}</div>
    </div>
  )
}
export default ProjectItem
