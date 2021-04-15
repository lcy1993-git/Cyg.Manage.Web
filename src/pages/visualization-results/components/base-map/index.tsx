import React, { useRef, useState } from 'react';
import { useMount } from 'ahooks';

import Map from 'ol/Map';
import { mapClick } from '../../utils';
import styles from './index.less';
import LayerGroup from 'ol/layer/Group';


const BaseMap = (props: any) => {

  const [map, setMap] = useState<Map | null>(null);

  const mapElement = useRef(null)
  const { layers, otherLayers=[], view} = props;

  useMount(() => {
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: []
    })

    // 初始化勘察图层、方案图层、设计图层、删除图层、勘察轨迹图层、交底轨迹图层
    otherLayers.forEach((item: LayerGroup) => {
      initialMap.addLayer(item);
    });
    
    // 地图点击事件
    initialMap.on('click', mapClick)

    setMap(initialMap);
  });

  const mapTest = (s: any) => {
    console.log(s)
  }

  return (
    <>
    <button onClick={() => mapTest("这是一个参数")}>Map实列DEMO</button>
    <div ref={mapElement} className={styles.mapBox}></div>
    </>
  );
}

export default BaseMap;