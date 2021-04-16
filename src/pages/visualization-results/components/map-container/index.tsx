import React, { useState } from 'react';
import MapBase from '../map-base';
import Layer from 'ol/layer/Layer';
import LayerGroup from 'ol/layer/Group';
import { initLayers, initOtherLayers, initView, initOtherLayersState } from '../../utils';
import styles from './index.less';

const MapContainer = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [layerGroups, setOtherLayers] = useState<LayerGroup[]>(initOtherLayers());

  const [layersState, setLayersState] = useState(0);
  const [otherlayersState, setOtherLayerState] = useState(initOtherLayersState);

  // 视图
  const [view, setView] = useState(initView);


  // 事件
  const onTest = function () {
    // console.log(getLayerByName('imgLayer'));
    console.log(getLayerGroupByName('surveyLayer'));
  }

  // 字符串标准格式化方法
  String.prototype.format = function (args: any) {
    var result = this;
    if (arguments.length < 1) {
      return result;
    }
    var data = arguments;
    if (arguments.length == 1 && typeof (args) == "object") {
      data = args;
    }
    for (var key in data) {
      var value = data[key];
      if (undefined != value) {
        result = result.replace("{" + key + "}", value);
      }
    }
    return result;
  }

  // 根据名称获取图层
  const getLayerByName = (name: string) => {
    let layer = null;
    layers.forEach((item: Layer) => {
      if (item.get('name') === name) {
        layer = item;
      }
    });
    return layer;
  }

  // 根据名称获取图层组
  const getLayerGroupByName = (name: string) => {
    let layerGroup = null;
    layerGroups.forEach((item: LayerGroup) => {
      if (item.get('name') === name) {
        layerGroup = item;
      }
    });
    return layerGroup;
  }

  // 清楚所有图层组中的数据
  const clearGroups = () => {
    layerGroups.forEach((item: LayerGroup) => {
      item.getLayers().forEach((layer: any) => {
        layer.getSource().clear();
      });
    });
  }

  interface Project {
    id: string
    time?: string
    status?: string
  }

  const layerParams = [
    {

    }
  ]
  /**
   * 刷新地图数据
   * @param projectIds 所选择的项目id 
   * @param location  加载完成后是否自动定位
   * @param time 时间
   */
  const refreshMap = (projects: Project[], location: boolean = true, time?: string) => {
    clearGroups();
    if (projects.length === 0)
      return;
    let wfsBaseURL = 'http://171.223.214.154:8099/geoserver/pdd/ows';
    let xmlData = "<?xml version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'><wfs:Query typeName='{0}' srsName='EPSG:4326'>";
    let postData = "";
    xmlData += "<ogc:Filter><Or>";
    projects.forEach((project: Project) => {
      let projectId = project.id;
      let projectTime = project.time;
      if (time && projectTime) {
        if (new Date(time).getTime() >= new Date(projectTime).getTime())
          postData += "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + projectId + "</Literal></PropertyIsEqualTo>";
      } else {
        postData += "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + projectId + "</Literal></PropertyIsEqualTo>";
      }
    });
    postData = xmlData + postData + "</Or></ogc:Filter></wfs:Query></wfs:GetFeature>";
  }


 



  return (
    <div className={styles.mapContainerBox}>
      <button onClick={onTest}>
        图层测试DEMO
      </button>

      <MapBase
        layers={layers}
        otherLayers={otherLayers}
        controls={[]}
        view={view}
      />
    </div>
  )
}
export default MapContainer;