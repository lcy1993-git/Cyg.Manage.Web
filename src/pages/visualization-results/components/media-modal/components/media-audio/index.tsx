import { baseUrl } from '@/services/common'
import type { MediaData } from '../../getComponentsByData'
import styles from './index.less'

interface MediaAudioProps {
  data: MediaData
}

const MediaAudio: React.FC<MediaAudioProps> = ({ data }) => {
  const isTrans = localStorage.getItem('isTransfer')
  //场内测试
  // let handleUrl = `${baseUrl.upload}`.slice(4)
  // let targetUrl = encodeURIComponent(`https://srthkf2.gczhyun.com:21530${handleUrl}`)'
  // let proxyUrl = `http://10.6.1.111:8082/commonGet?target_url=${targetUrl}`
  let handleUrl = `${baseUrl.upload}`

  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)

  let proxyUrl = `http://11.188.90.191:21525/commonGet?target_url=${targetUrl}`

  let finalUrl = Number(isTrans) === 1 ? proxyUrl : handleUrl
  return (
    <div className={styles.audioWrap}>
      <audio
        className={styles.audio}
        src={`${finalUrl}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
        controls={true}
        controlsList="noremoteplayback"
      />
    </div>
  )
}

export default MediaAudio
