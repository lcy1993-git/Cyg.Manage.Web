import React, { FC, useRef, useState } from 'react';
import Map from 'ol/Map';
import { useMount } from 'ahooks';

import styles from './index.less';

const BaseMap: FC<any> = (props: any) => {

  const [map, setMap] = useState<any>(null);

  const mapElement = useRef(null)
  const { layers, otherLayers, view} = props;

  useMount(() => {
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: []
    })

    // 初始化勘察图层、方案图层、设计图层、删除图层、勘察轨迹图层、交底轨迹图层
    otherLayers.forEach((item: any) => {
      initialMap.addLayer(item);
    });
    
    // 地图点击事件
    initialMap.on('click', (evt: any) =>{
      console.log(this);
      console.log(evt);
    })

    setMap(initialMap);
  });

  return (
    <div ref={mapElement} className={styles.mapBox}></div>
  );
}

export default BaseMap;