import { baseUrl } from '@/services/common'
import { handleGetUrl } from '@/utils/utils'
import { useKeyPress } from 'ahooks'
import React from 'react'
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
  //场内测试
  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : 'http://localhost:8000/api'

  const handleUrl = `${baseUrl.upload}/Download/GetFileById`

  // let targetUrl = handleSM2Crypto(`http://172.2.48.22${handleUrl}`)

  const targetUrl = handleGetUrl(
    { fileId: data.filePath, securityKey: '1201332565548359680', token: data.authorization },
    handleUrl
  )

  const finalUrl = `${currentHost}/commonGet${targetUrl}`

  return isFullScreen ? (
    <div
      className={styles.fullScreen}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <div className={styles.close} onClick={() => setIsFullScreen(false)}></div>
      <div className={styles.changeImg}>
        <div className={styles.left} onClick={() => preFullClick()}></div>
        <div className={styles.right} onClick={() => nextFullClick()}></div>
      </div>
      <img className={styles.fullScreenImg} crossOrigin={''} src={finalUrl} alt="" />
    </div>
  ) : null
}

export default MediaImgFullScreen
