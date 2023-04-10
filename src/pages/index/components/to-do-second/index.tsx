import { useLayoutStore } from '@/layouts/context'
import { AreaInfo } from '@/services/index'
import { getMyWorkStatisticsData } from '@/services/project-management/all-project'
import { useRequest } from 'ahooks'
import { Spin } from 'antd'
import uuid from 'node-uuid'
import React, { useMemo } from 'react'
import ScrollView from 'react-custom-scrollbars'
import { history } from 'umi'
import ChartBox from '../chart-box'
import ToDoItem from '../to-do-item-second'
import styles from './index.less'

interface ToDoProps {
  componentProps?: string[]
  currentAreaInfo: AreaInfo
}
export const typeEnmu = {
  agent: 'agent',
  approve: 'approve',
  arrange: 'arrange',
  review: 'review',
  knot: 'knot',
}

export const reserveTypeEnum = {
  agent: 'agent',
  approve: 'approve',
  arrange: 'arrange',
  review: 'review',
  knot: 'knot',
}

const areaTypeObj = {
  '1': '-1',
  '2': '1',
  '3': '2',
}

const ToDo: React.FC<ToDoProps> = (props) => {
  const { componentProps = ['agent', 'approve', 'arrange', 'knot'], currentAreaInfo } = props

  const { setAllProjectSearchParams } = useLayoutStore()
  const { data: toDoStatisticsInfo, loading } = useRequest(
    () => getMyWorkStatisticsData(areaTypeObj[currentAreaInfo.areaLevel!], currentAreaInfo.areaId),
    {
      refreshDeps: [currentAreaInfo],
      pollingWhenHidden: false,
    }
  )

  const afterHandleComponentProps = useMemo(() => {
    return componentProps.reduce((arr, item, index) => {
      if ((index + 1) % 2 === 1) {
        if (!arr[Math.ceil((index + 1) / 2) - 1]) {
          arr.push([item])
        } else {
          arr[Math.ceil((index + 1) / 2) - 1].push(item)
        }
      } else {
        arr[Math.ceil((index + 1) / 2) - 1].push(item)
      }
      return arr
    }, [])
  }, [componentProps])

  const toAllProjectListPage = (type: string) => {
    setAllProjectSearchParams?.({
      areaLevel: areaTypeObj[currentAreaInfo.areaLevel!],
      areaId: currentAreaInfo.areaId,
      cityId: currentAreaInfo.cityId,
      searchPerson: '',
      searchType: typeEnmu[type],
    })
    history.push({
      pathname: '/project-management/all-project',
      state: { sideVisible: false },
    })
  }

  const handleTheStatisticsData = useMemo(() => {
    if (toDoStatisticsInfo) {
      let emptyObj = {}
      Object.keys(toDoStatisticsInfo)
        .filter((item) => item !== 'all')
        .forEach((item) => {
          emptyObj[reserveTypeEnum[item]] =
            item === 'agent' ? toDoStatisticsInfo[item] : toDoStatisticsInfo[item].total
        })
      return emptyObj
    }
    return {}
  }, [toDoStatisticsInfo])

  const componentShowElement = useMemo(() => {
    if (handleTheStatisticsData) {
      return afterHandleComponentProps.map((item) => {
        return (
          <div key={uuid.v1()} className={styles.projectManageRow}>
            {item[0] && (
              <div className="flex1" onClick={() => toAllProjectListPage(item[0])}>
                <ToDoItem type={item[0]} number={handleTheStatisticsData![item[0]]} />
              </div>
            )}
            {item[1] && (
              <div className="flex1" onClick={() => toAllProjectListPage(item[1])}>
                <ToDoItem type={item[1]} number={handleTheStatisticsData![item[1]]} />
              </div>
            )}
            {!item[1] && <div className="flex1"></div>}
          </div>
        )
      })
    }
    return []
  }, [afterHandleComponentProps, handleTheStatisticsData])

  const scrollBarRenderView = (params: any) => {
    const { ...rest } = params
    const viewStyle = {
      backgroundColor: `#4DA944`,
      borderRadius: '6px',
      cursor: 'pointer',
    }
    return <div className="box" style={{ ...params.style, ...viewStyle }} {...rest} />
  }

  return (
    <ChartBox title="项目管理">
      <Spin spinning={loading} delay={300}>
        <div className={styles.projectManageContent}>
          <ScrollView renderThumbVertical={scrollBarRenderView}>{componentShowElement}</ScrollView>
        </div>
      </Spin>
    </ChartBox>
  )
}

export default ToDo
