import { getClientOnlineUser, getOnlineUser } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import OnlineListModal from '../online-list-modal'
import styles from './index.less'

interface NumberItemProps {
  type?: 'all' | 'admin' | 'survey' | 'design' | 'manage' //总在线人数 | 各端在线人数
  size?: 'large' | 'small' //总用户数 | 在线人数
  account: number
  title: string
}
const NumberItem: React.FC<NumberItemProps> = (props) => {
  const { size, account = 0, title, type } = props
  const [onlineModal, setOnlineModal] = useState<boolean>(false)
  const [sendData, setSendData] = useState<any[]>([])
  const fontSize = size === 'large' ? 42 : 36
  const { data: totalData, run: getTotalData } = useRequest(getOnlineUser, {
    manual: true,
    onSuccess: () => {
      setSendData(totalData)
    },
  })
  const { data: clientData, run: getClientData } = useRequest(getClientOnlineUser, {
    manual: true,
    onSuccess: () => {
      setSendData(clientData)
    },
  })

  /**查看在线用户数据 */
  const clickEvent = async () => {
    if (size === 'small') {
      if (type === 'all' || type === 'admin') {
        await getTotalData(type === 'all' ? 2 : 3)
        setOnlineModal(true)
        return
      }
      await getClientData(type === 'manage' ? 2 : type === 'survey' ? 4 : 8)
      setOnlineModal(true)
    }
    return
  }

  return (
    <>
      <div className={styles.numberItem}>
        <div
          className={styles.number}
          style={{ fontSize: `${fontSize}px`, cursor: 'pointer' }}
          onClick={() => clickEvent()}
        >
          {account && account.toLocaleString()}
        </div>
        <div className={styles.title}>{title}</div>
      </div>
      {onlineModal && (
        <OnlineListModal
          visible={onlineModal}
          onChange={setOnlineModal}
          data={sendData}
          type={type}
        />
      )}
    </>
  )
}

export default NumberItem
