import Geometry from "ol/geom/Geometry";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Vector as VectorSource, XYZ } from "ol/source";

// 卫星图层
export const vecLayer = new TileLayer({
  source: new XYZ({
    url: decodeURI("https://mt{0-3}.s02.sirenmap.com/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Galileo"),
  }),
  preload: 18,
});

// Vector层
export const getVectorLayer = (source: VectorSource<Geometry>) => new VectorLayer({
  source: source,
  // style: vectorLayerStyle
});