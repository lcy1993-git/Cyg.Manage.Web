import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import GeometryType from 'ol/geom/GeometryType'
import Map from 'ol/Map';
import View from 'ol/View';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Source, Vector as VectorSource } from 'ol/source';
import { Layer } from 'ol/layer';
import { useCurrentRef } from '@/utils/hooks';
import Geometry from 'ol/geom/Geometry';
import BaseEvent from 'ol/events/Event';
import { useEventEmitter, useMount } from 'ahooks';
import { getVectorLayer, vecLayer } from './layers';
import * as proj from 'ol/proj';
import { drawEnd } from './draw';

interface interActionRef {
  draw?: Draw;
  snap?: Snap;
  source?: VectorSource<Geometry>;
  modify?: Modify;
  isDraw?: boolean;
}

declare type MapLayerType = "STREET" | "SATELLITE";

const HistoryMapBase = () => {


  type MapLayerType = "STREET" | "SATELLITE";
  /**
   * 全局状态部分
   */

  // 绘制类型
  const [geometryType, setGeometryType] = useState<string>("");
  // 当前地图类型(街道图,卫星图)
  const [mapLayerType, setMapLayerType] = useState<MapLayerType>("SATELLITE");
  // 显示名称
  const [nameVisible, setNameVisible] = useState<boolean>(false);
  // 定位到当前项目
  const locateCurrent$ = useEventEmitter();
  // 根据地区定位地图事件
  const centerView$ = useEventEmitter();
  // 导入事件
  const importFile$ = useEventEmitter();
  // 保存事件
  const saveFile$ = useEventEmitter();

  const ref = useRef<HTMLDivElement>(null)
  // 地图实例
  const mapRef = useCurrentRef<{ map: Map }>({ map: {} })
  // 图层缓存数据
  const layerRef = useCurrentRef<Record<string, Layer<Source>>>({})
  // 视图实例
  const viewRef = useCurrentRef<{ view: View }>({})
  // 画图缓存数据
  const interActionRef = useCurrentRef<interActionRef>({})
  // 挂载地图
  useMount(() => {
    beforeInit();
    initLayer();
    initView();
    initMap();
    // 初始化之后注册交互行为
    bindEvent();
    mapRef.map.getControls().clear();
    initInterAction();
  });

  // 处理geometryType变化
  useEffect(() => {
    if (ref.current && geometryType) {
      removeaddInteractions()
      addInteractions(geometryType)
    }
  }, [geometryType]);

  // beforinit
  function beforeInit() {
    ref.current!.innerHTML = ""
    interActionRef.source = new VectorSource();
  }
  // 初始化layer
  function initLayer() {
    // 添加 卫星图
    layerRef.vecLayer = vecLayer;
    // 添加街道图层

    // 添加 vectorLayer
    layerRef.vectorLayer = getVectorLayer(interActionRef.source!);
  }
  // 初始化view
  function initView() {
    viewRef.view = new View({
      center: proj.transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
      zoom: 5,
      maxZoom: 25,
      minZoom: 1,
      projection: 'EPSG:3857',
    });
  }
  // 初始化地图实例
  function initMap() {
    mapRef.map = new Map({
      target: ref.current!,
      layers: Object.values(layerRef),
      view: viewRef.view,
    });
  }

  // 绑定事件
  function bindEvent() {
    mapRef.map.on("click", (e: BaseEvent) => {
      console.log("click", e);
    })

    // 地图拖动事件
    mapRef.map.on('moveend', (e: BaseEvent) => {
      console.log("moveend", e);
      console.log(interActionRef.source);
    })
  }

  // 初始化interaction
  function initInterAction() {
    interActionRef.modify = new Modify({ source: interActionRef.source })
    interActionRef.modify.on(["modifyend", "modifystart"], function (e) {
      console.log("编辑时回调", e);
    });
    mapRef.map.addInteraction(interActionRef.modify);
  }

  // 删除draw交互行为
  function removeaddInteractions() {
    if (interActionRef.draw && interActionRef.snap) {
      mapRef.map.removeInteraction(interActionRef.draw);
      mapRef.map.removeInteraction(interActionRef.snap);
    }
  }

  // 添加draw交互行为
  function addInteractions(type: string) {
    if (type) {
      interActionRef.draw = new Draw({
        source: interActionRef.source,
        type: type,
      });
      // 绑定绘制完成事件
      interActionRef.draw.on("drawend", (e) => drawEnd(e, interActionRef.source!, setGeometryType))
      mapRef.map.addInteraction(interActionRef.draw);
      interActionRef.snap = new Snap({ source: interActionRef.source });
      mapRef.map.addInteraction(interActionRef.snap);
    }
  }

  function test() {
  }

  return (
    <div>
      <div ref={ref} style={{ height: window.innerHeight - 300, width: window.innerWidth }}></div>
      <div>onClick</div>
      <span onClick={() => setGeometryType(GeometryType.POINT)}>Point</span>
      <span style={{ color: "red" }} onClick={() => setGeometryType(GeometryType.LINE_STRING)}>Line</span>
      <span onClick={test}>test</span>
    </div>
  );
}


export default HistoryMapBase;
