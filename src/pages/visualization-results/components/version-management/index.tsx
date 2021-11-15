import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import { forwardRef, Ref, useImperativeHandle, useState } from 'react'
import styles from './index.less'
import { useMount } from 'ahooks'

export interface TimeLine {
  id: string
  time: string
}

interface Props {
  onClick?: () => void
}

const VersionManagement = (props: Props, ref: Ref<any>) => {
  const { onClick } = props
  const [active, setActive] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<string>('')
  const [list, setList] = useState<TimeLine[]>([])
  const activeList = () => {
    setActive(!active)
  }
  useMount(() => {
    getHistoryList()
  })
  useImperativeHandle(ref, () => ({
    update: getHistoryList,
    getList: () => {
      return list
    },
  }))
  const getHistoryList = () => {
    setActiveId('')
    let res = Array.from({ length: 25 }, (item, index) => {
      return {
        time: `2015-09-01 12:${index}1`,
        id: Math.random() + '',
      }
    })
    setList(res)
  }
  const onItemClick = (val: TimeLine) => {
    onClick?.()
    setActiveId(val.id)
    console.log(val)
  }
  return (
    <div className={styles.versionManagement}>
      <div className={styles.versionManagementButton}>
        {active ? (
          <DownOutlined className={styles.versionManagementIcon} />
        ) : (
          <UpOutlined className={styles.versionManagementIcon} />
        )}
        <div className={styles.versionManagementText} onClick={activeList}>
          版本管理
        </div>
      </div>
      <div
        className={styles.versionManagementList}
        style={{
          height: active ? '70vh' : '0vh',
          overflow: active ? 'auto' : 'hidden',
        }}
      >
        <div style={{ height: '12px' }} />
        <Timeline>
          {list.map((item) => {
            return (
              <Timeline.Item
                className={`${styles.listText} ${
                  activeId === item.id ? styles.listActiveText : styles.listText
                }`}
                key={item.id}
                // @ts-ignore
                onClick={() => onItemClick(item)}
              >
                {item.time}
              </Timeline.Item>
            )
          })}
        </Timeline>
        ,
      </div>
    </div>
  )
}
export default forwardRef(VersionManagement)
