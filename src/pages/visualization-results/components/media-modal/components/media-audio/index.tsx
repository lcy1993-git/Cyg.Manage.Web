import type { MediaData } from '../../getComponentsByData'
import { baseUrl } from '@/services/common';
import styles from './index.less';

interface MediaAudioProps {
  data: MediaData
}

const MediaAudio: React.FC<MediaAudioProps> = ({
  data
}) => {
  return (
    <div className={styles.audioWrap}>
      <audio
        className={styles.audio}
        src={`${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
        controls={true}
      />
    </div>
  );
}

export default MediaAudio;