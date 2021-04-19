import LayerGroup from "ol/layer/Group";
import { ProjectList, loadLayer } from "@/services/visualization-results/visualization-results";
import {layerParams} from './mapdata';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { pointStyle, line_style, cable_channel_styles, mark_style, fzx_styles } from '../utils/pointStyle';
import Layer from "ol/layer/Layer";
import { View } from "ol";

const refreshMap = (ops: any, projects: ProjectList[], location: boolean = true, time?: string) => {
  const {setLayerGroups, layerGroups: groupLayers} = ops;
  clearGroups(groupLayers);
  if (projects.length === 0)
    return;
  let wfsBaseURL = 'http://171.223.214.154:8099/geoserver/pdd/ows';
  let xmlData = "<?xml version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'><wfs:Query typeName='{0}' srsName='EPSG:4326'>";
  let postData = "";
  xmlData += "<ogc:Filter><Or>";
  projects.forEach((project: ProjectList) => {
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

  loadSurveyLayers(wfsBaseURL, postData, groupLayers);
  loadPlanLayers(wfsBaseURL, postData, groupLayers);
  loadDesignLayers(wfsBaseURL, postData, groupLayers);
  loadDismantleLayers(wfsBaseURL, postData, groupLayers);
  setLayerGroups(groupLayers);
}

const loadSurveyLayers = (url: string, postData: string, groupLayers: LayerGroup[]) => {
  loadLayers(url, postData, getLayerGroupByName('surveyLayer', groupLayers), 'survey', 1, groupLayers);
}

const loadPlanLayers = (url: string, postData: string, groupLayers: LayerGroup[]) => {
  loadLayers(url, postData, getLayerGroupByName('planLayer', groupLayers), 'plan', 2, groupLayers);
}

const loadDesignLayers = (url: string, postData: string, groupLayers: LayerGroup[]) => {
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
      getLayerGroupByName('designLayer', groupLayers).getLayers().push(groupLayers['design_pull_line']);
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
  loadLayers(url, postData, getLayerGroupByName('designLayer', groupLayers), 'design', 3, groupLayers);
}

const loadDismantleLayers = (url: string, postData: string, groupLayers: LayerGroup[]) => {
  loadLayers(url, postData, getLayerGroupByName('dismantleLayer', groupLayers), 'dismantle', 4, groupLayers);
}

const loadLayers = (url: string, postData: string, group: LayerGroup, layerType: string, layerTypeId: number, groupLayers: LayerGroup[]) => {
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

// 清楚所有图层组中的数据
const clearGroups = (layerGroups: LayerGroup[]) => {
  layerGroups.forEach((item: LayerGroup) => {
    item.getLayers().forEach((layer: any) => {
      layer.getSource().clear();
    });
  });
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

  // 根据名称获取图层
  const getLayerByName = (name: string, layers: Layer[]): any => {
    let layer = null;
    layers.forEach((item: Layer) => {
      if (item.get('name') === name) {
        layer = item;
      }
    });
    return layer;
  }

  // 根据名称获取图层组
  const getLayerGroupByName = (name: string, layerGroups: LayerGroup[]): any => {
    let layerGroup = null;
    layerGroups.forEach((item: LayerGroup) => {
      if (item.get('name') === name) {
        layerGroup = item;
      }
    });
    return layerGroup;
  }

  // 根据项目进行定位
  const relocateMap = (projectId: string = "", layerGroups: LayerGroup[], view: View, setView: any, map: any) => {
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
      view.fit(source.getExtent(), map!.getSize());
      setView(view);
    }

  }

export {
  refreshMap
};