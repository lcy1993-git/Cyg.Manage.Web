import img from '@/assets/icon-image/survey-track.png';
import { useCurrentRef } from '@/utils/hooks';
import { useEventEmitter, useMount, useUpdateEffect } from 'ahooks';
import { FeatureCollection } from 'geojson';
import { Feature } from 'ol';
import BaseEvent from 'ol/events/Event';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { Draw, Modify, Snap } from 'ol/interaction';
import { LineCoordType, PointCoordType } from 'ol/interaction/Draw';
import { Layer } from 'ol/layer';
import Map from 'ol/Map';
import 'ol/ol.css';
import * as proj from 'ol/proj';
import { Source, Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import View from 'ol/View';
import { useRef, useState } from 'react';
import { drawEnd } from './draw';
import { getVectorLayer, vecLayer } from './layers';
import { featureStyle } from './styles';


interface interActionRef {
  draw?: Draw;
  snap?: Snap;
  source?: VectorSource<Geometry>;
  modify?: Modify;
  isDraw?: boolean;
}

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
  useUpdateEffect(() => {
    removeaddInteractions()
    if (geometryType) addInteractions(geometryType)
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
    })

    // 地图拖动事件
    mapRef.map.on('moveend', (e: BaseEvent) => {
    })
  }

  // 初始化interaction
  function initInterAction() {
    interActionRef.modify = new Modify({ source: interActionRef.source, style: new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: img,
        scale: .8
      }),
    }) ,
    // 设置容差
    pixelTolerance: 25
  })
    interActionRef.modify.on(["modifyend"], function (e) {
      e.features.getArray()[0].setStyle(featureStyle.type2)
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
    interActionRef.source?.clear();
    // 读取GeoJSON数据
    // new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!)
    const json = JSON.parse(window.localStorage.getItem("json")!) as FeatureCollection
    const features = (json.features).map(({geometry}) => {

      const feature = new Feature();
      
      if(geometry.type === GeometryType.LINE_STRING) {

        feature.setGeometry(new LineString(geometry.coordinates as LineCoordType));
        feature.setStyle(featureStyle.type1)

      }else if (geometry.type === GeometryType.POINT){
        const point = new Point(geometry.coordinates as PointCoordType);
        feature.setGeometry(point)
        feature.setStyle(featureStyle.type2)
      }
      return feature
    })

    
    interActionRef.source?.addFeatures(features)
  }

  const loadJSON = () => {
    console.log(JSON.parse(
      new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!)
    ));
    
    localStorage.setItem("json",
      new GeoJSON().writeFeatures(interActionRef.source?.getFeatures()!)
    )
  }

  return (
    <div>
      <div ref={ref} style={{ height: window.innerHeight - 300, width: window.innerWidth }}></div>
      <div>onClick</div>
      <button onClick={() => setGeometryType(GeometryType.POINT)}>Point</button>
      <button style={{ color: "red" }} onClick={() => setGeometryType(GeometryType.LINE_STRING)}>Line</button>
      <button style={{ color: "red" }} onClick={() => setGeometryType("")}>None</button>
      <button onClick={loadJSON}>loadJSON</button>
      <button onClick={test}>test</button>
    </div>
  );
}


export default HistoryMapBase;
