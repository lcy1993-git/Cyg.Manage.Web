import React, { useState } from 'react'
import styles from './index.less'
import yewu from '@/assets/index/业务事件@2x.png'
import xitong from '@/assets/index/系统事件@2x.png'
import all from '@/assets/index/所有事件@2x.png'
import warnImage from '@/assets/index/warn.png'
import { Button } from 'antd'
import { queryTotalCount } from '@/services/security-audit'
import { useMount } from 'ahooks'
import { useHistory } from 'react-router-dom'
interface Props {
  system: number
  business: number
}
const EventNumber: React.FC<Props> = (props) => {
  const history = useHistory()
  const [warn, setWarn] = useState(false)
  const [message, setMessage] = useState('审计记录即将超出系统存储上限，请及时处理')
  const getCount = async () => {
    const res = await queryTotalCount()
    if (res?.code === 5000 && res?.isSuccess === false) {
      setWarn(true)
      setMessage(res.message)
    }
  }
  useMount(() => {
    getCount()
  })
  const goToDetail = (id: string) => {
    history.push(`/admin-index/report/${id}`)
  }
  return (
    <div className={styles.eventNumber}>
      <div className={styles.eventNumberItem} onClick={() => goToDetail('11')}>
        <div className={styles.image}>
          <img src={all} alt="所有事件" height={70} />
        </div>
        <div className={styles.EventNumberInfo}>
          <p className={styles.text}>所有事件</p>
          <p className={styles.number}>{props.system + props.business}</p>
        </div>
      </div>
      <div className={styles.linBox}>
        <span className={styles.line} />
      </div>
      <div className={styles.eventNumberItem} onClick={() => goToDetail('12')}>
        <div className={styles.image}>
          <img src={xitong} alt="系统事件" height={70} />
        </div>
        <div className={styles.EventNumberInfo}>
          <p className={styles.text}>系统事件</p>
          <p className={styles.number}>{props.system}</p>
        </div>
      </div>
      <div className={styles.linBox}>
        <span className={styles.line} />
      </div>
      <div className={styles.eventNumberItem} onClick={() => goToDetail('13')}>
        <div className={styles.image}>
          <img src={yewu} alt="业务事件" height={70} />
        </div>
        <div className={styles.EventNumberInfo}>
          <p className={styles.text}>业务事件</p>
          <p className={styles.number}>{props.business}</p>
        </div>
      </div>
      <div
        className={styles.warn}
        style={{
          display: warn ? 'block' : 'none',
        }}
      >
        <div className={styles.warnIcon}>
          <img src={warnImage} alt="告警" width={'40px'} />
          <div className={styles.warnText}>告警</div>
        </div>
        <div className={styles.warnContent}>{message}</div>
        <div className={styles.warnButton}>
          <Button danger onClick={() => setWarn(false)}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EventNumber
