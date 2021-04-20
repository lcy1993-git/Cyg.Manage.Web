import React, { useEffect, useRef, useState } from 'react';
import Footer from '../footer';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map';

import { mapClick, mapPointermove } from '../../utils';
import { useMount } from 'ahooks';
import { useContainer } from '../../result-page/store';
import styles from './index.less';
import { refreshMap, getLayerByName } from '../../utils/refreshMap';
import { initIpLocation } from '@/services/visualization-results/visualization-results';

const BaseMap = (props: any) => {

  const [map, setMap] = useState<Map | null>(null);
  const mapElement = useRef(null)
  const { layers, layerGroups, view, setView, setLayerGroups } = props;

  // footer相关数据
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0,0]);
  const [scaleSize, setScaleSize] = useState<string>("")
  const [isSatelliteMap, setIsSatelliteMap] = useState<boolean>(true);

  // 从Vstate获取外部传入的数据
  const { vState } = useContainer();
  const { checkedProjectIdList: projects, filterCondition } = vState;
  const { kvLevel } = filterCondition;


  // 挂载
  useMount(() => {
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: []
    })

    // 初始化勘察图层、方案图层、设计图层、删除图层、勘察轨迹图层、交底轨迹图层
    layerGroups.forEach((item: LayerGroup) => {
      initialMap.addLayer(item);
    });
    const ops1 = {
      highlightLayer: null
    }
    // 地图点击事件
    initialMap.on('click', (e: Event) => mapClick(e, initialMap, ops1));
    initialMap.on('pointermove', (e: Event) => mapPointermove(e,initialMap, setCurrentPosition));

    const ops = { layers, layerGroups, view, setView, setLayerGroups, map: initialMap, kvLevel };
    refreshMap(ops, projects!)
    setMap(initialMap);
  });

  // 动态刷新refreshMap
  useEffect(() => {
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map };
    map && refreshMap(ops, projects!)
  }, [JSON.stringify(projects)])


  /**
   * @demo 这是一个demo
   * @useEffect  见下  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
   */
  // useEffect(() => {

  //   当依赖项目发生变化时候，React会自动执行这里面的代码

  // }, [这里是依赖项目1, 依赖项目2, 依赖项目3])

  // demoEnd ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆

  const onlocationClick = () => {
    // 当点击定位按钮时
    let promise = initIpLocation();
    console.log(promise)
  }

  const onSatelliteMapClick = () => {
    // 卫星图点击时
<<<<<<< HEAD
    getLayerByName('imgLayer', layers).setVisible(true);
    getLayerByName('vecLayer', layers).setVisible(false);
  }

  const onStreetMapClick = () => {
    // 街道图点击时
    getLayerByName('imgLayer', layers).setVisible(false);
    getLayerByName('vecLayer', layers).setVisible(true);
=======
    setIsSatelliteMap(false);
    
  }

  const onStreetMapClick = () => {
    // 卫星图点击时
    setIsSatelliteMap(true);
>>>>>>> f83e99b03f5fc4fa6bd0806693e7e5e398bade47
  }
  return (
    <>
      <div ref={mapElement} className={styles.mapBox}></div>
      <Footer
        onlocationClick={onlocationClick}
        currentPosition={currentPosition}
        scaleSize={scaleSize}
        onSatelliteMapClick={onSatelliteMapClick}
        onStreetMapClick={onStreetMapClick}
      />
    </>
  );
}


export default BaseMap;