import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMount } from 'ahooks';
import { useContainer } from '../../result-page/mobx-store';
import { observer } from 'mobx-react-lite';

import Footer from '../footer';
import SidePopup, { TableDataType } from '../side-popup';
import CtrolLayers from '../control-layers';

import Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import { transform } from 'ol/proj';

import {
  refreshMap,
  getLayerByName,
  getLayerGroupByName,
  relocateMap,
  loadTrackLayers,
  clearTrackLayers,
  clearHighlightLayer,
} from '../../utils/methods';
import { bd09Towgs84 } from '../../utils';
import { mapClick, mapPointermove, mapMoveend } from '../../utils/mapClick';
import { BaseMapProps } from '../../utils/init';

import { initIpLocation, loadEnums } from '@/services/visualization-results/visualization-results';
import styles from './index.less';
import MapDisplay from '../map-display';

const BaseMap = observer((props: BaseMapProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const mapElement = useRef(null);
  const { layers, layerGroups, trackLayers, view, setView, setLayerGroups } = props;

  // 图层控制层数据
  const [surveyLayerVisible, setSurveyLayerVisible] = useState<boolean>(false);
  const [planLayerVisible, setPlanLayerVisible] = useState<boolean>(true);
  const [designLayerVisible, setDesignLayerVisible] = useState<boolean>(false);
  const [dismantleLayerVisible, setDismantleLayerVisible] = useState<boolean>(false);
  // 从Vstate获取外部传入的数据
  const store = useContainer();
  const { vState } = store;
  const {
    checkedProjectIdList: projects,
    filterCondition,
    visibleLeftSidebar,
    normalClickDate,
    observeClickDate,
    positionMap,
    observeTrack,
    confessionTrack,
  } = vState;
  const { kvLevel } = filterCondition;

  // 右侧边栏状态
  const [rightSidebarVisiviabel, setRightSidebarVisiviabelMap] = useState(false);
  const setRightSidebarVisiviabel = (state: boolean) => {
    (map && state) || clearHighlightLayer(map);
    setRightSidebarVisiviabelMap(state);
  };
  const [rightSidebarData, setRightSidebarData] = useState<TableDataType[]>([]);
  // 挂载
  useMount(() => {
    loadEnums().then((data) => {
      localStorage.setItem('loadEnumsData', JSON.stringify(data.content));
    });
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: [],
    });

    // 初始化勘察图层、方案图层、设计图层、删除图层、
    layerGroups.forEach((item: LayerGroup) => {
      initialMap.addLayer(item);
    });

    // 初始化勘察轨迹图层、交底轨迹图层
    trackLayers.forEach((item: LayerGroup) => {
      initialMap.addLayer(item);
    });

    // 地图点击事件
    initialMap.on('click', (e: Event) =>
      mapClick(e, initialMap, { setRightSidebarVisiviabel, setRightSidebarData }),
    );
    initialMap.on('pointermove', (e: Event) => mapPointermove(e, initialMap));
    initialMap.on('moveend', (e: Event) => mapMoveend(e, initialMap));

    const ops = { layers, layerGroups, view, setView, setLayerGroups, map: initialMap, kvLevel };
    refreshMap(ops, projects!);
    setMap(initialMap);
  });

  // 动态刷新refreshMap
  useEffect(() => {
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel };
    map && refreshMap(ops, projects!);
  }, [JSON.stringify(projects)]);

  // 动态刷新图层
  useEffect(() => {
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel };
    map && refreshMap(ops, projects!, true, normalClickDate);
  }, [JSON.stringify(normalClickDate)]);

  // 动态刷新轨迹
  useEffect(() => {
    // 加载勘察轨迹
    map && loadTrackLayers(projects[0].id, map, trackLayers, 0, observeClickDate);
  }, [JSON.stringify(observeClickDate)]);

  // 动态刷新轨迹
  useEffect(() => {
    // 加载勘察轨迹
    if (observeTrack) map && loadTrackLayers(projects[0].id, map, trackLayers, 0);
    else clearTrackLayers(trackLayers, 0);
  }, [JSON.stringify(observeTrack)]);

  // 动态刷新轨迹
  useEffect(() => {
    // 加载交底轨迹
    if (confessionTrack) map && loadTrackLayers(projects[0].id, map, trackLayers, 1);
    else clearTrackLayers(trackLayers, 1);
  }, [JSON.stringify(confessionTrack)]);

  // 地图定位
  useEffect(() => {
    map && relocateMap('', layerGroups, view, setView, map);
  }, [JSON.stringify(positionMap)]);

  // 左侧菜单伸缩时刷新地图尺寸
  useEffect(() => {
    map?.updateSize();
  }, [visibleLeftSidebar]);
  // 处理高亮图层
  const highlight = useCallback(
    (t: number, state) => {
      const highlightLayer: any = map
        ?.getLayers()
        .getArray()
        .find((layer: any) => {
          return layer.get('name') === 'highlightLayer';
        });
      const highlightLayers = highlightLayer?.getSource().getFeatures();
      const hightType = highlightLayers && highlightLayers[0]?.getProperties().layerType;
      hightType === t && highlightLayer?.setVisible(false);
      if (state[1] || state[2] || state[3]) {
        getLayerGroupByName('surveyLayer', layerGroups).setOpacity(0.5);
      } else {
        getLayerGroupByName('surveyLayer', layerGroups).setOpacity(1);
      }
    },
    [map],
  );

  const layersState = useMemo(() => {
    return [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible];
  }, [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible]);
  // 当勘察图层切换时
  useEffect(() => {
    highlight(1, layersState);
    getLayerGroupByName('surveyLayer', layerGroups).setVisible(surveyLayerVisible);
  }, [surveyLayerVisible]);
  // 当方案图层点击时
  useEffect(() => {
    highlight(2, layersState);
    getLayerGroupByName('planLayer', layerGroups).setVisible(planLayerVisible);
  }, [planLayerVisible]);
  // 当设计图层点击时
  useEffect(() => {
    highlight(3, layersState);
    getLayerGroupByName('designLayer', layerGroups).setVisible(designLayerVisible);
  }, [designLayerVisible]);
  // 当拆除图层点击时
  useEffect(() => {
    highlight(4, layersState);
    getLayerGroupByName('dismantleLayer', layerGroups).setVisible(dismantleLayerVisible);
  }, [dismantleLayerVisible]);

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

        view.animate(
          {
            center: center,
            zoom: 18,
            duration: duration,
          },
          () => {},
        );
        setView(view);
      }
    });
  };

  const onSatelliteMapClick = () => {
    // 卫星图点击时
    getLayerByName('imgLayer', layers).setVisible(true);
    getLayerByName('vecLayer', layers).setVisible(false);
  };

  const onStreetMapClick = () => {
    // 街道图点击时
    getLayerByName('imgLayer', layers).setVisible(false);
    getLayerByName('vecLayer', layers).setVisible(true);
  };

  return (
    <>
      <div ref={mapElement} className={styles.mapBox}></div>

      <CtrolLayers
        surveyLayerVisible={surveyLayerVisible}
        planLayerVisible={planLayerVisible}
        designLayerVisible={designLayerVisible}
        dismantleLayerVisible={dismantleLayerVisible}
        setSurveyLayerVisible={setSurveyLayerVisible}
        setPlanLayerVisible={setPlanLayerVisible}
        setDesignLayerVisible={setDesignLayerVisible}
        setDismantleLayerVisible={setDismantleLayerVisible}
      />

      <MapDisplay onSatelliteMapClick={onSatelliteMapClick} onStreetMapClick={onStreetMapClick} />

      <Footer onlocationClick={onlocationClick} />
      <SidePopup
        rightSidebarVisible={rightSidebarVisiviabel}
        data={rightSidebarData}
        setRightSidebarVisiviabel={setRightSidebarVisiviabel}
      />
    </>
  );
});

export default BaseMap;
