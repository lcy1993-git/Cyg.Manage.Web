import TileLayer from 'ol/layer/Tile';
import Group from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import * as proj from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import Layer from 'ol/layer/Layer';
import Control from 'ol/control/Control';

export interface BaseMapProps {
  layers: Layer[];
  layerGroups: LayerGroup[];
  controls?: Control[];
  view: View;
  setLayers: (arg0: Layer[]) => void;
  setLayerGroups: (arg0: LayerGroup[]) => void;
  setView: (arg0: View) => void;
}

export const initLayers = (resData: any): Layer[] => {
  // 初始化data

  if (resData && resData.code !== 200) return [];

  let vecUrl = '';
  let imgUrl = '';

  resData.data.forEach((item: any) => {
    console.log(item)
    if(item.layerType === 1) {
      // vecUrl = item.url.replace('{s}', '{' + item.servers.split(',')[0] + '-' + item.servers.split(',')[item.servers.split(',').length - 1] + '}');
      vecUrl = item.url.replace('{s}', '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}');
    }else if(item.layerType === 2) {
      imgUrl = item.url.replace('{s}', '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}');
    }
  });

  // 卫星图
  // imgUrl = imgUrl || "https://t%7B0-7%7D.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5";
  const imgLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(vecUrl),
    }),
    preload: 18,
  });
  imgLayer.set('name', 'imgLayer');

  // 街道图
  // vecUrl = vecUrl || "https://t%7B0-7%7D.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5";
  const vecLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(imgUrl),
    }),
    preload: 18,
  });
  vecLayer.setVisible(false);
  vecLayer.set('name', 'vecLayer');

  // ann图
  const annUrl =
    'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5';
  const annLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(annUrl),
    }),
    preload: 18,
  });
  annLayer.set('name', 'annLayer');

  return [imgLayer, vecLayer, annLayer];
};

export const initOtherLayers = (): LayerGroup[] => {
  // 勘察图
  const surveyLayer = new Group();
  surveyLayer.setOpacity(0.5);
  surveyLayer.setVisible(false);
  surveyLayer.set('name', 'surveyLayer');

  // 方案图
  const planLayer = new Group();
  planLayer.setVisible(false);
  planLayer.set('name', 'planLayer');

  // 设计图
  const designLayer = new Group();
  designLayer.set('name', 'designLayer');

  // 拆除图
  const dismantleLayer = new Group();
  dismantleLayer.setVisible(false);
  dismantleLayer.set('name', 'dismantleLayer');

  // 跟踪图
  // const surveyTrackLayer = new Group();

  // 高亮图层
  // const dismantleLayers = new

  return [surveyLayer, planLayer, designLayer, dismantleLayer];
};

// 状态
export const initOtherLayersState = [
  {
    name: '勘察图层',
    state: false,
    index: 0,
  },
  {
    name: '方案图层',
    state: false,
    index: 1,
  },
  {
    name: '设计图层',
    state: false,
    index: 2,
  },
  {
    name: '拆除图层',
    state: false,
    index: 3,
  },
];

// view
export const initView = new View({
  center: proj.transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
  zoom: 5,
  maxZoom: 25,
  minZoom: 1,
  projection: 'EPSG:3857',
});

export interface ControlLayearsData {
  name: string;
  state: boolean;
  index: number;
}

export const initControlLayearsData: ControlLayearsData[] = [
  {
    name: '勘察图层',
    state: false,
    index: 0,
  },
  {
    name: '方案图层',
    state: false,
    index: 1,
  },
  {
    name: '设计图层',
    state: true,
    index: 2,
  },
  {
    name: '拆除图层',
    state: false,
    index: 3,
  },
];
