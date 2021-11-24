import { Timeline } from 'antd'
import { Ref, useEffect, useState } from 'react'
import styles from './index.less'
import { useMount } from 'ahooks'
import pickUp from '@/assets/icon-image/pack-up.png'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'
import { Moment } from 'moment/moment'
import { getAllGridVersions, getHistoriesById } from '../../history-grid/service'
import { useGridMap } from '@/pages/visualization-results/history-grid/store/mapReducer'
import GridVersionManagement from '@/pages/visualization-results/history-grid/components/grid-version-management'
import HistoryGirdForm from '@/pages/visualization-results/components/map-form/add-electrical-equipment'
import RecordHistoryVersion from '@/pages/visualization-results/components/record-history-version'

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
  updatedBy: string | null
}

interface Props {
  height?: string
}

const HistoryVersionManagement = (props: Props, ref: Ref<any>) => {
  const { height = '45vh' } = props
  const [state, setState] = useGridMap()
  const [active, setActive] = useState<boolean>(true)
  const [showVersion, setShowVersion] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<string>('')
  const [show, setShow] = useState<boolean>(true)
  const [list, setList] = useState<HistoryGridVersion[]>([])
  const { mode, dispatch, historyGridVersion } = useHistoryGridContext()
  const activeList = () => {
    setActive(!active)
  }
  useMount(async () => {
    await getHistoryList()
  })
  const getHistoryList = async () => {
    setActiveId('')
    const res = await getAllGridVersions(false)
    res?.content && setList(res?.content)
    res?.content?.length !== 0 && (await onItemClick(res?.content[0]))
  }
  const onItemClick = async (val: HistoryGridVersion) => {
    dispatch({
      type: 'changeHistoryGirdVersion',
      payload: val,
    })
    setActiveId(val.id)
    const res = await getHistoriesById(val.id)
    const data = res?.content
    data.id = val.id
    setState('dataSource', data)
    setState('selectedData', [])
  }
  const onVersionClose = async () => {
    setShowVersion(false)
    await getHistoryList()
  }
  useEffect(() => {
    if (mode === 'record') {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [mode, historyGridVersion, state])
  return (
    <div>
      <div
        className={styles.versionManagement}
        style={{
          height: height,
          display: show ? 'block' : 'none',
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
            {list?.map((item) => {
              return (
                <Timeline.Item
                  className={`${styles.listText} ${
                    activeId === item.id ? styles.listActiveText : styles.listText
                  }`}
                  key={item.id}
                  // @ts-ignore
                  onClick={() => onItemClick(item)}
                >
                  {item.versionCode.replaceAll('/', '.')}
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
