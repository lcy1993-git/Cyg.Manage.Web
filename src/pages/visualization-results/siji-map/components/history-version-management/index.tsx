import pickUp from '@/assets/icon-image/pack-up.png'
import HistoryGirdForm from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import RecordHistoryVersion from '@/pages/visualization-results/components/record-history-version'
import GridVersionManagement from '@/pages/visualization-results/history-grid/components/grid-version-management'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'
import { useGridMap } from '@/pages/visualization-results/history-grid/store/mapReducer'
import { useUpdateEffect } from 'ahooks'
import { Timeline } from 'antd'
import { Moment } from 'moment/moment'
import { useState } from 'react'
import { getHistoriesById } from '../../history-grid/service'
import styles from './index.less'

export interface HistoryGridVersion {
  id: string
  createdTime: Moment
  isDeleted: boolean
  deletedTime: Moment
  updatedTime: Moment
  remark: string
  versionCode: string
  isTemplate: boolean
  deletedBy: string | null
  createdBy: string | null
  creatorName: string | null
  updatedBy: string | null
}

interface Props {
  height?: string
}

const HistoryVersionManagement = (props: Props) => {
  const { height = '5vh' } = props
  const [state] = useGridMap()
  const [active, setActive] = useState<boolean>(true)
  const [showVersion, setShowVersion] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<string>('')
  const [, setShow] = useState<boolean>(true)
  const { mode, dispatch, allHistoryGridData } = useHistoryGridContext()
  const activeList = () => {
    setActive(!active)
  }
  const onItemClick = async (val: HistoryGridVersion) => {
    dispatch({
      type: 'changeCurrentGridData',
      payload: val,
    })
    setActiveId(val.id)
    const data = await getHistoriesById(val.id)
    data['id'] = val.id
    dispatch({
      type: 'changeHistoryDataSource',
      payload: data,
    })
  }
  const onVersionClose = async () => {
    setShowVersion(false)
    dispatch('refetch')
  }
  useUpdateEffect(() => {
    if (mode === 'record') {
      setShow(true)
    } else {
      setShow(false)
    }
    if (allHistoryGridData?.length !== 0) {
      const isTemplate = allHistoryGridData?.find((item) => item.isTemplate)
      isTemplate && onItemClick(isTemplate)
    }
  }, [mode, state, allHistoryGridData])
  return (
    <div>
      <div
        className={styles.versionManagement}
        style={{
          height: height,
          display: mode === 'record' ? 'block' : 'none',
        }}
      >
        <div className={styles.versionManagementButton}>
          <div className={styles.versionManagementText} onClick={() => setShowVersion(true)}>
            版本管理
          </div>
          <img
            src={pickUp}
            alt="收起"
            className={styles.pickUpIcon}
            onClick={activeList}
            style={{
              cursor: 'pointer',
              transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
        <div
          className={styles.versionManagementList}
          style={{
            maxHeight: active ? '70vh' : '0vh',
            overflow: active ? 'auto' : 'hidden',
          }}
        >
          <div style={{ height: '12px' }} />
          <Timeline>
            {allHistoryGridData?.map((item) => {
              return (
                <Timeline.Item
                  className={`${styles.listText} ${
                    activeId === item.id ? styles.listActiveText : styles.listText
                  }`}
                  key={item.id}
                  // @ts-ignore
                  onClick={() => onItemClick(item)}
                >
                  <span className={styles.addTextStyle}>
                    {item.versionCode.replaceAll('/', '.')}
                  </span>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </div>
      </div>
      {showVersion && <GridVersionManagement onClose={onVersionClose} />}
      <HistoryGirdForm updateHistoryVersion={onVersionClose} />
      <RecordHistoryVersion updateHistoryVersion={onVersionClose} />
    </div>
  )
}
export default HistoryVersionManagement
