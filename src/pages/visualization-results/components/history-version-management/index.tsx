import {Timeline} from 'antd'
import {Ref, useEffect, useReducer, useState} from 'react'
import styles from './index.less'
import {useMount} from 'ahooks'

import pickUp from '@/assets/icon-image/pack-up.png'
import {getAllGridVersions} from "@/services/visualization-results/list-menu";
import {historyGridReducer, init, useHistoryGridContext} from "@/pages/visualization-results/history-grid/store";
import {Moment} from "moment/moment";

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
  onClick?: () => void
  height?: string
}

const HistoryVersionManagement = (props: Props, ref: Ref<any>) => {
  const {onClick, height = '45vh'} = props
  const [active, setActive] = useState<boolean>(true)
  const [activeId, setActiveId] = useState<string>('')
  const [show,setShow] = useState<boolean>(true)
  const [list, setList] = useState<HistoryGridVersion[]>([])
  const {currentData,mode,dispatch} = useHistoryGridContext()
  const activeList = () => {
    setActive(!active)
  }
  useMount(async () => {
    await getHistoryList()
  })
  const getHistoryList = async () => {
    setActiveId('')
    const res = await getAllGridVersions(true)
    setList(res.content)
    res.content.length !== 0 && onItemClick(res.content[0])
  }
  const onItemClick = (val: HistoryGridVersion) => {
    onClick?.()
    dispatch({
      type:'changeHistoryGirdVersion',
      payload:val
    })
    setActiveId(val.id)
  }
  useEffect(() => {
    if (mode === 'record'){
      setShow(true)
    } else {
      setShow(false)
    }
  }, [currentData,mode])
  return (
    <div
      className={styles.versionManagement}

      style={{
        height: height,
        display: show ?'block':'none'
      }}>
      <div className={styles.versionManagementButton}>
        <div className={styles.versionManagementText} onClick={activeList}>
          版本管理
        </div>
        <img
          src={pickUp}
          alt="收起"
          className={styles.pickUpIcon}
          onClick={activeList}
          style={{
            cursor:'pointer',
            transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      <div
        className={styles.versionManagementList}
        style={{
          height: active ? '70vh' : '0vh',
          overflow: active ? 'auto' : 'hidden',
        }}
      >
        <div style={{height: '12px'}}/>
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
        ,
      </div>
    </div>
  )
}
export default HistoryVersionManagement
