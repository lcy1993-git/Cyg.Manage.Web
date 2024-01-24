import { baseUrl } from '@/services/common'
import { handleGetUrl } from '@/utils/utils'
import type { MediaData } from '../../getComponentsByData'
import styles from './index.less'

interface MediaAudioProps {
  data: MediaData
}

const MediaAudio: React.FC<MediaAudioProps> = ({ data }) => {
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

  return (
    <div className={styles.audioWrap}>
      <audio
        className={styles.audio}
        src={finalUrl}
        controls={true}
        controlsList="noremoteplayback"
      />
    </div>
  )
}

export default MediaAudio
