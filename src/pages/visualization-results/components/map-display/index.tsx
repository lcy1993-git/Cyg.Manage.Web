import { FC, useState } from 'react'
import styles from './index.less'
interface MapDisplayProps {
  onSatelliteMapClick: () => void
  onStreetMapClick: () => void
  setSourceType: (s: number) => void
}

const MapDisplay: FC<MapDisplayProps> = (props) => {
  const { onSatelliteMapClick, onStreetMapClick, setSourceType } = props
  const [isStreet, setIsStreet] = useState(false)
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  const onChange = (value: string) => {
    if (value === 'street') {
      onStreetMapClick()
      setIsStreet(true)
      setIsCustom(false)
    } else if (value === 'custom') {
      setIsStreet(false)
      setIsCustom(true)
    } else {
      onSatelliteMapClick()
      setIsStreet(false)
      setIsCustom(false)
    }
  }
  return (
    <>
      <div
        className={active ? styles.containerActive : styles.container}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className={`${styles.icon2}  ${isCustom ? styles.streetActive : ''}`}>
          <div className={styles.list}>
            <img
              className={styles.img}
              src={require('@/assets/image/webgis/自定义.png')}
              alt="自定义"
              onClick={() => onChange('custom')}
            />
            <div className={styles.text}>自定义</div>
            <div className={styles.moreSource} onClick={() => setSourceType(3)} title="切换图层源">
              ···
            </div>
          </div>
        </div>
        <div
          className={`${styles.icon} ${isCustom || isStreet ? '' : styles.streetActive} ${
            active ? styles.iconActive : ''
          }`}
        >
          <div className={styles.list}>
            <img
              className={styles.img}
              src={require('@/assets/image/webgis/卫星图.png')}
              alt="卫星图"
              onClick={() => onChange('satellite')}
            />
            <div className={styles.text}>卫星图</div>
            <div className={styles.moreSource} onClick={() => setSourceType(1)} title="切换图层源">
              ···
            </div>
          </div>
        </div>
        <div
          className={`${styles.icon1} ${active ? styles.icon1Active : ''} ${
            isStreet && active ? styles.streetActive : ''
          }`}
        >
          <div className={styles.list}>
            <img
              className={styles.img}
              src={require('@/assets/image/webgis/街道图.png')}
              alt="街道图"
              onClick={() => onChange('street')}
            />
            <div className={styles.text}>街道图</div>
            <div
              className={styles.moreSource}
              onClick={() => {
                setSourceType(2)
              }}
              title="切换图层源"
            >
              ···
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MapDisplay
