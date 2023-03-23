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
        src={`${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
      />
    </div>
  ) : null
}

export default MediaImgFullScreen
