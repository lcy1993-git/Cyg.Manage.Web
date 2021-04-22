import React, { useEffect, useRef, useState } from 'react';
import Footer from '../footer';
import SidePopup, { TableDataType } from '../side-popup';
import CtrolLayers from '../control-layers';
import Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import { transform } from "ol/proj";
import { mapClick, initControlLayearsData, mapPointermove, mapMoveend } from '../../utils';
import { BaseMapProps, ControlLayearsData } from '../../utils/init'
import { useMount } from 'ahooks';
import { useContainer } from '../../result-page/store';
import { refreshMap, getLayerByName, getLayerGroupByName } from '../../utils/refreshMap';
import { initIpLocation, loadEnums } from '@/services/visualization-results/visualization-results';
import { bd09Towgs84 } from '../../utils/locationUtils'
import styles from './index.less';

const BaseMap = (props: BaseMapProps) => {

  const [map, setMap] = useState<Map | null>(null);
  const mapElement = useRef(null);
  const { layers, layerGroups, view, setView, setLayerGroups } = props;

  // 图层控制层数据
  const [controlLayearsData, setControlLayearsData] = useState<ControlLayearsData[]>(initControlLayearsData);

  // 从Vstate获取外部传入的数据
  const { vState } = useContainer();
  const { checkedProjectIdList: projects, filterCondition, onPositionClickState } = vState;
  const { kvLevel } = filterCondition;

  // 右侧边栏状态
  const [rightSidebarVisiviabel, setRightSidebarVisiviabel] = useState(false);
  const [rightSidebarData, setRightSidebarData] = useState<TableDataType[]>([]);
  // 挂载
  useMount(() => {
    loadEnums().then(data => {
      localStorage.setItem('loadEnumsData', JSON.stringify(data.content));
    });
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

    // 地图点击事件
    initialMap.on('click', (e: Event) => mapClick(e, initialMap, {setRightSidebarVisiviabel, setRightSidebarData}));
    initialMap.on('pointermove', (e: Event) => mapPointermove(e, initialMap));
    initialMap.on('moveend', (e: Event) => mapMoveend(e, initialMap));

    const ops = { layers, layerGroups, view, setView, setLayerGroups, map: initialMap, kvLevel };
    refreshMap(ops, projects!)
    setMap(initialMap);
  });

  // 动态刷新refreshMap
  useEffect(() => {
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel };
    map && refreshMap(ops, projects!)
  }, [JSON.stringify(projects)])

  useEffect(() => {
    // 当图层切换时
    // controlLayearsData.find(data => currItem.type === item.type)
    layerGroups.forEach((layerGroup: any) => {
      layerGroup.setVisible(false);
    });

    let highlightLayer: any = map?.getLayers().getArray().find((layer: any) => {
      return layer.get('name') === 'highlightLayer';
    })
    console.log(highlightLayer);
    highlightLayer && highlightLayer.setVisible(false);
    let layerType: any;
    if (highlightLayer && highlightLayer.getSource().getFeatures().length > 0) {
      for (let f of highlightLayer.getSource().getFeatures()) {
        if (f.getProperties().layerType) {
          layerType = highlightLayer.getSource().getFeatures()[0].getProperties().layerType;
          break;
        }
      }
    }

    let checkedState: ControlLayearsData[] = [];
    controlLayearsData.map((data: ControlLayearsData) => {
      if (data.state)
        checkedState.push(data);
    })
    console.log(checkedState)
    // 做勘察图层透明度逻辑判断
    if (checkedState.length > 1) {
      getLayerGroupByName('surveyLayer', layerGroups).setOpacity(0.5);
    } else if (checkedState.length === 1) {
      if (checkedState[0]?.index === 0)
        getLayerGroupByName('surveyLayer', layerGroups).setOpacity(1);
    } else {
      return;
    }

    checkedState.map((data: ControlLayearsData) => {
      if (data.index + 1 === layerType)
        highlightLayer.setVisible(true);
      switch (data.index + 1) {
        case 1: // 勘察图层
          getLayerGroupByName('surveyLayer', layerGroups).setVisible(true);
          break;
        case 2: // 方案图层
          getLayerGroupByName('planLayer', layerGroups).setVisible(true);
          break;
        case 3: // 设计图层
          getLayerGroupByName('designLayer', layerGroups).setVisible(true);
          break;
        case 4: // 拆除图层
          getLayerGroupByName('dismantleLayer', layerGroups).setVisible(true);
          break;
        default:
          break;
      }
    })

    setControlLayearsData(controlLayearsData);

  }, [JSON.stringify(controlLayearsData)])


  useEffect(() => {
    // 当点击定位时
    // console.log(onPositionClickState)
  }, [onPositionClickState])
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
    promise.then((data: any) => {
      if (data.ipLoc.status == 'success' && data.rgc) {
        let lon = data.rgc.result.location.lng;
        let lat = data.rgc.result.location.lat;
        let lont = bd09Towgs84(lon, lat);
        let center = transform(lont, 'EPSG:4326', 'EPSG:3857');
        let duration = 5000;

        view.animate({
          center: center,
          zoom: 18,
          duration: duration
        }, () => { });
        setView(view);
      }
    })
  }

  const onSatelliteMapClick = () => {
    // 卫星图点击时
    getLayerByName('imgLayer', layers).setVisible(true);
    getLayerByName('vecLayer', layers).setVisible(false);
  }

  const onStreetMapClick = () => {
    // 街道图点击时
    getLayerByName('imgLayer', layers).setVisible(false);
    getLayerByName('vecLayer', layers).setVisible(true);
  };

  // 改变图层状态

  const onLayersStateChange = (index: number) => {
    const resControlLayearsData = controlLayearsData;
    resControlLayearsData[index].state = !resControlLayearsData[index].state;
    setControlLayearsData([...controlLayearsData]);
  };

  return (
    <>
      <div ref={mapElement} className={styles.mapBox}></div>
      {rightSidebarVisiviabel || <CtrolLayers controlLayearsData={controlLayearsData} onLayersStateChange={onLayersStateChange} />}
      <Footer
        onlocationClick={onlocationClick}
        onSatelliteMapClick={onSatelliteMapClick}
        onStreetMapClick={onStreetMapClick}
      />
      <SidePopup visible={rightSidebarVisiviabel} data={rightSidebarData} setRightSidebarVisiviabel={setRightSidebarVisiviabel} />
    </>
  );
}


export default BaseMap;