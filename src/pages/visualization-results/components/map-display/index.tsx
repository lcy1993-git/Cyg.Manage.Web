import React, { FC, useState } from 'react';
import styles from './index.less';

interface MapDisplayProps {
  onSatelliteMapClick: () => void;
  onStreetMapClick: () => void;
}

const MapDisplay: FC<MapDisplayProps> = (props) => {
  const { onSatelliteMapClick, onStreetMapClick } = props;
  const [isStreet, setIsStreet] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  console.log(active);

  const onChange = (value: string) => {
    if (value === 'street') {
      onStreetMapClick()
      setIsStreet(true)
    } else {
      onSatelliteMapClick()
      setIsStreet(false)
    }
  };
  return (
    <div className={active ? styles.containerActive : styles.container} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      <div className={`${styles.icon} ${isStreet ? "" : styles.streetActive}`}>
        <div className={styles.list}>
          <img className={styles.img} src={require('@/assets/image/webgis/卫星图.png')} alt='卫星图' onClick={() => onChange('satellite')} />
          <div className={styles.text}>卫星图</div>
        </div>
      </div>
      <div className={`${styles.icon1} ${styles.icon1Active} ${isStreet ? styles.streetActive : ""}`}>
        <div className={styles.list}>
          <img className={styles.img} src={require('@/assets/image/webgis/街道图.png')} alt='街道图' onClick={() => onChange('street')} />
          <div className={styles.text}>街道图</div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
