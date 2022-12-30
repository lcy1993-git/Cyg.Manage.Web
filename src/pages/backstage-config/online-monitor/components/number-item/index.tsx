import ImageIcon from '@/components/image-icon'
import { getClientOnlineUser, getOnlineUser } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import OnlineListModal from '../online-list-modal'
import styles from './index.less'

interface NumberItemProps {
  imgSrc?: string
  type?: 'all' | 'admin' | 'survey' | 'design' | 'manage' //总在线人数 | 各端在线人数
  account: number
  title: string
  className?: string
}
const NumberItem: React.FC<NumberItemProps> = (props) => {
  const { account = 0, title, type, imgSrc, className } = props
  const [onlineModal, setOnlineModal] = useState<boolean>(false)
  const [sendData, setSendData] = useState<any[]>([])
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
    if (type === 'all' || type === 'admin') {
      await getTotalData(type === 'all' ? 2 : 3)
      setOnlineModal(true)
      return
    }
    if (type === 'manage' || type === 'survey' || type === 'design') {
      await getClientData(type === 'manage' ? 2 : type === 'survey' ? 4 : 8)
      setOnlineModal(true)
      return
    }
    return
  }

  return (
    <>
      <div className={styles.numberItem}>
        <ImageIcon width={75} height={75} imgUrl={`monitor/${imgSrc}`} />
        <div className={styles.rightContent}>
          <div
            className={styles.number}
            style={{
              fontSize: '42px',
              cursor: `${type ? 'pointer' : 'default'}`,
              color: `${className === 'line' ? '#2afc96' : '#fff'}`,
              fontWeight: 'bold',
            }}
            onClick={() => clickEvent()}
          >
            {account && account.toLocaleString()}
          </div>
          <div
            className={styles.title}
            style={{ color: `${className === 'line' ? '#fff' : '#2afc96'}` }}
          >
            {title}
          </div>
        </div>
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
