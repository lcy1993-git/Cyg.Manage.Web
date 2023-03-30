import React from 'react'
import { useKeyPress } from 'ahooks'
import { baseUrl } from '@/services/common'
import styles from './index.less'

interface MediaImgFullScreenProps {
  isFullScreen: boolean
  setIsFullScreen: (b: boolean) => void
  preFullClick: () => void
  nextFullClick: () => void
  data: any
}

const MediaImgFullScreen: React.FC<MediaImgFullScreenProps> = ({
  isFullScreen,
  setIsFullScreen,
  preFullClick,
  nextFullClick,
  data,
}) => {
  useKeyPress(27, () => {
    setIsFullScreen(false)
  })

  // let handleUrl = `${baseUrl.upload}`.slice(4)
  let handleUrl = `${baseUrl.upload}`
  // let targetUrl = encodeURIComponent(`https://srthkf2.gczhyun.com:21530${handleUrl}`)
  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)
  // let proxyUrl = `http://10.6.1.111:8082/commonGet?target_url=${targetUrl}`
  let proxyUrl = `http://11.188.90.191:21525/commonGet?target_url=${targetUrl}`
  return isFullScreen ? (
    <div
      className={styles.fullScreen}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <div className={styles.close} onClick={() => setIsFullScreen(false)}>
        123
      </div>
      <div className={styles.changeImg}>
        <div className={styles.left} onClick={() => preFullClick()}></div>
        <div className={styles.right} onClick={() => nextFullClick()}></div>
      </div>
      <img
        className={styles.fullScreenImg}
        crossOrigin={''}
        src={`${proxyUrl}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
      />
    </div>
  ) : null
}

export default MediaImgFullScreen
