import React, { useEffect, useState } from 'react';
import MapBase from '../map-base';
import Layer from 'ol/layer/Layer';
import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import LayerGroup from 'ol/layer/Group';
import GeoJSON from 'ol/format/GeoJSON';
import { initLayers, initOtherLayers, initView, initOtherLayersState } from '../../utils';
import styles from './index.less';
import { loadLayer } from '@/services/visualization-results/visualization-results';
import { pointStyle, line_style, cable_channel_styles, mark_style, fzx_styles } from '../../utils/pointStyle';

const MapContainer = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(initOtherLayers());

  const [layersState, setLayersState] = useState(0);
  const [otherlayersState, setOtherLayerState] = useState(initOtherLayersState);

  // 视图
  const [view, setView] = useState(initView);

  const groupLayers: Layer[] = [];
  interface Project {
    id: string
    time?: string
    status?: string
  }

  const layerParams = [
    {
      layerName: 'user_line', // 下户线
      zIndex: 1,
      declutter: false,
      type: 'line'
    },
    {
      layerName: 'cable_channel', // 电缆通道
      zIndex: 1,
      declutter: false,
      type: 'cable_channel'
    },
    {
      layerName: 'mark', // 地物
      zIndex: 1,
      declutter: false,
      type: 'mark'
    },
    {
      layerName: 'line',
      zIndex: 2,
      declutter: false,
      type: 'line'

    },
    {
      layerName: 'subline', // 辅助线
      zIndex: 2,
      declutter: false,
      type: 'line'
    },
    {
      layerName: 'electric_meter', // 户表
      zIndex: 2,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'cable',
      zIndex: 3,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'tower',
      zIndex: 4,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'transformer', // 变压器
      zIndex: 5,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'cable_equipment', // 电气设备
      zIndex: 6,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'cable_head', // 电缆头
      zIndex: 7,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'cross_arm', // 横担
      zIndex: 8,
      declutter: false,
      type: 'point'
    },
    {
      layerName: 'over_head_device', // 杆上设备
      zIndex: 9,
      declutter: false,
      type: 'point'
    }
  ]

  // 事件
  const onTest = function () {
    refreshMap([{
      id: '1382687501508292609'
    }]);
  }

  // 根据名称获取图层
  const getLayerByName = (name: string): any => {
    let layer = null;
    layers.forEach((item: Layer) => {
      if (item.get('name') === name) {
        layer = item;
      }
    });
    return layer;
  }

  // 根据名称获取图层组
  const getLayerGroupByName = (name: string): any => {
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

    loadSurveyLayers(wfsBaseURL, postData);
    loadPlanLayers(wfsBaseURL, postData);
    loadDesignLayers(wfsBaseURL, postData);
    loadDismantleLayers(wfsBaseURL, postData);
    setLayerGroups(layerGroups);
  }

  const loadSurveyLayers = (url: string, postData: string) => {
    loadLayers(url, postData, getLayerGroupByName('surveyLayer'), 'survey', 1);
  }

  const loadPlanLayers = (url: string, postData: string) => {
    loadLayers(url, postData, getLayerGroupByName('planLayer'), 'plan', 2);
  }

  const loadDesignLayers = (url: string, postData: string) => {
    loadWFS(url, postData, 'pdd:design_pull_line', (data: any) => {
      if (groupLayers['design_pull_line']) {
        groupLayers['design_pull_line'].getSource().clear();
      } else {
        var source = new VectorSource();
        groupLayers['design_pull_line'] = new Vector({
          source,
          zIndex: 1,
          // declutter: true
        });
        groupLayers['design_pull_line'].set('name', 'design_pull_line');
        getLayerGroupByName('designLayer').getLayers().push(groupLayers['design_pull_line']);
      }
      if (data.features != undefined && data.features.length > 0) {
        let pJSON = (new GeoJSON()).readFeatures(data);
        for (var i = 0; i < pJSON.length; i++) {
          pJSON[i].setGeometry(pJSON[i].getGeometry()?.transform('EPSG:4326', 'EPSG:3857'));
          let s = pointStyle('design_pull_line', pJSON[i], false);
          pJSON[i].setStyle(s);
        }
        groupLayers['design_pull_line'].getSource().addFeatures(pJSON);
      }
    })
    loadLayers(url, postData, getLayerGroupByName('designLayer'), 'design', 3);
  }

  const loadDismantleLayers = (url: string, postData: string) => {
    loadLayers(url, postData, getLayerGroupByName('dismantleLayer'), 'dismantle', 4);
  }

  const loadLayers = (url: string, postData: string, group: LayerGroup, layerType: string, layerTypeId: number) => {
    layerParams.forEach((item: any) => {
      let layerName = item.layerName;
      loadWFS(url, postData, 'pdd:' + layerType + '_' + layerName, (data: any) => {
        if (groupLayers[layerType + '_' + layerName]) {
          groupLayers[layerType + '_' + layerName].getSource().clear();
        } else {
          let source = new VectorSource();
          groupLayers[layerType + '_' + layerName] = new Vector({
            source,
            zIndex: item.zIndex,
            declutter: item.declutter
          });
          groupLayers[layerType + '_' + layerName].set('name', layerType + '_' + layerName);
          group.getLayers().push(groupLayers[layerType + '_' + layerName]);
        }

        if (data.features && data.features.length > 0) {
          let pJSON = (new GeoJSON()).readFeatures(data);
          for (var i = 0; i < pJSON.length; i++) {
            pJSON[i].setGeometry(pJSON[i].getGeometry()?.transform('EPSG:4326', 'EPSG:3857'));
            let style;
            if (item.type == 'line') {
              style = line_style(pJSON[i], false, layerType);
            } else if (item.type == 'point') {
              style = pointStyle(layerType + '_' + layerName, pJSON[i], false);
            } else if (item.type == 'cable_channel') {
              style = cable_channel_styles(pJSON[i]);
            } else if (item.type == 'mark') {
              style = mark_style(pJSON[i]);
            } else if (item.type == 'subline') {
              style = fzx_styles();
            }
            pJSON[i].setStyle(style);
          }
          groupLayers[layerType + '_' + layerName].getSource().addFeatures(pJSON);
        }
      })
    })
  }
  /**
   * 通过wfs方式获取数据
   * @param url 
   * @param postData 
   * @param layerName 
   * @param callBack 
   */
  const loadWFS = (url: string, postData: string, layerName: string, callBack: (o: any) => void) => {
    const promise = loadLayer(url, postData, layerName);
    promise.then((data: any) => {
      if (data.features && data.features.length > 0) {
        callBack(data);
      }
    })
  }

  // 根据项目进行定位
  const relocateMap = (projectId?: string) => {
    let features: any = [];
    let source = new VectorSource();
    layerGroups.forEach((layerGroup: LayerGroup) => {
      layerGroup.getLayers().getArray().forEach((layer: any) => {
        let fs = layer.getSource().getFeatures();
        if (fs.length > 0) {
          if (!projectId) {
            features = features.concat(fs);
          } else {
            fs.forEach((feature: any) => {
              if (projectId === feature.getProperties().project_id)
                features.push(feature);
            })
          }
        }
      })
    })

    if (features.length > 0) {
      source.addFeatures(features);
      view.fit(source.getExtent(), map.getSize());
      setView(view);
    }

  }

  return (
    <div className={styles.mapContainerBox}>
      <MapBase
        layers={layers}
        setLayers={setLayers}
        setLayerGroups={setLayerGroups}
        layerGroups={layerGroups}
        controls={[]}
        view={view}
        setView={setView}
      />
    </div>
  )
}
export default MapContainer;