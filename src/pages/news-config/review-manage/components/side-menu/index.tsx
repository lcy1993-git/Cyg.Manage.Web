import React, { FC, useRef, useState } from 'react'
import classNames from 'classnames'
import styles from './index.less'
import { Tree, Spin, message } from 'antd'
import { useRequest, useSize } from 'ahooks'
import moment from 'moment'
// import {
//   fetchEngineerProjectListByParams,
//   ProjectItemType,
//   Engineer,
// } from '@/services/visualization-results/side-tree';
import { useContainer } from '../../store'
// import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite'

/**
 * 树形结构
 */
export interface TreeNodeType {
  title: string
  key: string
  time?: string
  status?: number
  haveData?: boolean
  haveSurveyData?: boolean
  haveDesignData?: boolean
  isExecutor?: boolean
  children?: TreeNodeType[]
}
export interface SideMenuProps {
  className?: string
}

/**
 * 把传进来的projectList数据传唤成需要的数组类型
 * @param projectItemsType
 * @returns
 */
const mapProjects2TreeNodeData = (
  projectItemsType: ProjectItemType[],
  engineerId: string
): TreeNodeType[] => {
  return projectItemsType.map((v: ProjectItemType) => {
    return {
      title: v.name,
      key: v.id,
      time: v.projectEndTime ? moment(v.projectEndTime).format('YYYY-MM-DD') : '',
      status: v.status,
      haveData: v.haveData,
      engineerId,
      haveSurveyData: v.haveSurveyData,
      haveDesignData: v.haveDesignData,
      isExecutor: v.isExecutor,
    }
  })
}

const generateProjectTree = (engineerList: Engineer[]) => {
  let projectTree = engineerList.map((v) => {
    return {
      title: v.name,
      key: v.id,
      children: mapProjects2TreeNodeData(v.projects, v.id),
    }
  })

  return projectTree
}

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>()
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>()
  const store = useContainer()
  const { vState } = store //设置公共状态的id数据
  const { filterCondition } = vState
  const { className } = props

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)

  /**
   * 获取全部数据
   */
  const { data: allData, loading: allLoading } = useRequest(
    () => fetchEngineerProjectListByParams(filterCondition),

    {
      refreshDeps: [filterCondition],
      onSuccess: () => {
        if (allData?.length) {
          let listTree = generateProjectTree(allData)

          //设置树形数据
          setTreeData(listTree)

          setExpandedKeys(
            listTree.map((v) => {
              if (v.children) {
                return v.key
              } else {
                return ''
              }
            })
          )

          store.setProjectInfo({
            projectId: listTree[0]?.children[0]?.key,
            engineerId: listTree[0]?.key,
          })

          setSelectedKeys([listTree[0]?.children[0]?.key])
        } else {
          message.warning('没有检索到数据')
        }
      },
      onError: () => {
        message.warning('获取数据失败')
      },
    }
  )

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }

  const onSelect = (selectedKeys: React.Key[], e: any) => {
    setSelectedKeys(selectedKeys)
    store.setProjectInfo({
      projectId: e.node.key,
      engineerId: e.node.engineerId,
    })
  }

  return (
    <>
      <div ref={ref} className={classNames(className, styles.sideMenuContainer)}>
        <div className={styles.title}>工程项目</div>
        {allLoading ? (
          <Spin spinning={allLoading} className={styles.loading} tip="正在载入中..."></Spin>
        ) : null}
        {allData ? (
          <div className={styles.sideMenu}>
            <Tree
              showLine
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent
              selectedKeys={selectedKeys}
              onSelect={(selectedKeys, e) => onSelect(selectedKeys, e)}
              height={size.height ? size.height - 30 : 700}
              treeData={treeData}
            />
          </div>
        ) : null}
      </div>
    </>
  )
})

export default SideTree
