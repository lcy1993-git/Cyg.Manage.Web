import React, { FC } from 'react';
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
  const onChange = (value: string) => {
    value === 'street' ? onStreetMapClick() : onSatelliteMapClick();
  };
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <div className={styles.list}>
          <Radio.Group defaultValue="satellite" onChange={(e) => onChange(e.target.value)}>
            <ListItem name="卫星影像图" value="satellite" />
            <ListItem name="街道图" value="street" />
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
