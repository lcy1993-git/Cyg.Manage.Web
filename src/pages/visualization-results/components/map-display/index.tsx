import React, { FC, useState } from 'react';
import { Radio } from 'antd';
import styles from './index.less';

interface ListProps {
  name: string;
  value: string;
}

interface MapDisplayProps {

  onSatelliteMapClick: () => void;
  onStreetMapClick: () => void;
}

const ListItem = (props: ListProps) => {
  const { name, value } = props;
  return (
    <div className={styles.listItem} key={'listItem' + name}>
      <Radio value={value}>{name}</Radio>
    </div>
  );
};

const MapDisplay: FC<MapDisplayProps> = (props) => {
  const { onSatelliteMapClick, onStreetMapClick } = props;
  const [isStreet, setIsStreet] = useState(false);
  const onChange = (value: string) => {
    if(value === 'street') {
      onStreetMapClick()
      setIsStreet(true)
    }else{
      onSatelliteMapClick()
      setIsStreet(false)
    }
    // value === 'street' ? onStreetMapClick() : onSatelliteMapClick();
  };
  return (
    <div className={styles.container}>
      <div className={styles.icon}>

        {
          isStreet ?
            <div className={styles.list}>
              <img className={styles.img} src={require('@/assets/image/webgis/卫星图.png')} alt='卫星图' onClick={() => onChange('satellite')} />
              <span className={styles.text}>卫星图</span>
            </div>
            :
            <div className={styles.list}>
              <img className={styles.img} src={require('@/assets/image/webgis/街道图.png')} alt='街道图' onClick={() => onChange('street')} />
              <span className={styles.text}>街道图</span>
            </div>
        }


        {/* <Radio.Group defaultValue="satellite" onChange={(e) => onChange(e.target.value)}>
            <ListItem name="卫星影像图" value="satellite" />
            <ListItem name="街道图" value="street" />
          </Radio.Group> */}
      </div>
    </div>
  );
};

export default MapDisplay;
