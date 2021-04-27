import LayerGroup from "ol/layer/Group";
import { ProjectList, loadLayer, findLineDetailInfo } from "@/services/visualization-results/visualization-results";
import { layerParams } from './localData/layerParamsData';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import MultiLineString from 'ol/geom/MultiLineString';
import { pointStyle, line_style, cable_channel_styles, mark_style, fzx_styles } from './localData/pointStyle';
import Layer from "ol/layer/Layer";
import Point from "ol/geom/Point";
import { transform, getPointResolution } from "ol/proj";
import ProjUnits from "ol/proj/Units";
import Feature from "ol/Feature";
import ClassStyle from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import markerIconSrc from "@/assets/image/webgis/marker-icon.png";
import arrowSrc from "@/assets/image/webgis/arrow.png";
import { getXmlData, sortByTime } from "./utils"

var projects: any;
const wfsBaseURL = 'http://10.6.1.36:8099/geoserver/pdd/ows';
const refreshMap = async (ops: any, projects_: ProjectList[], location: boolean = true, time?: string) => {
  projects = projects_;
  const { setLayerGroups, layerGroups: groupLayers, view, setView, map, kvLevel } = ops;
  clearGroups(groupLayers);
  clearHighlightLayer(map);
  if (projects.length === 0) return;
  // let xmlData = "<?xml version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'><wfs:Query typeName='{0}' srsName='EPSG:4326'>";
  // let postData = "";
  // xmlData += "<ogc:Filter><Or>";
  // projects.forEach((project: ProjectList) => {
  //   let projectId = project.id;
  //   let projectTime = project.time;
  //   if (time && projectTime) {
  //     time = time.replaceAll('/','-');
  //     projectTime = projectTime.replaceAll('/','-');
  //     if (new Date(time).getTime() >= new Date(projectTime).getTime()) {
  //       postData += "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + projectId + "</Literal></PropertyIsEqualTo>";
  //     }
  //   } else {
  //     postData += "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + projectId + "</Literal></PropertyIsEqualTo>";
  //   }
  // });
  // postData = xmlData + postData + "</Or></ogc:Filter></wfs:Query></wfs:GetFeature>";
  const postData = getXmlData(projects, time);
  await loadSurveyLayers(kvLevel, postData, groupLayers);
  await loadPlanLayers(kvLevel, postData, groupLayers);
  await loadDismantleLayers(kvLevel, postData, groupLayers);
  await loadDesignLayers(kvLevel, postData, groupLayers, view, setView, map);

  setLayerGroups(groupLayers);
}

const loadSurveyLayers = async (kvLevel: any, postData: string, groupLayers: LayerGroup[]) => {
  await loadLayers(kvLevel, postData, getLayerGroupByName('surveyLayer', groupLayers), 'survey', 1, groupLayers);
}

const loadPlanLayers = async (kvLevel: any, postData: string, groupLayers: LayerGroup[]) => {
  await loadLayers(kvLevel, postData, getLayerGroupByName('planLayer', groupLayers), 'plan', 2, groupLayers);
}

const loadDesignLayers = async (kvLevel: any, postData: string, groupLayers: LayerGroup[], view: any, setView: any, map: any) => {
  await loadLayers(kvLevel, postData, getLayerGroupByName('designLayer', groupLayers), 'design', 3, groupLayers);
  await loadWFS(postData, 'pdd:design_pull_line', (data: any) => {
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
  relocateMap('', groupLayers, view, setView, map);
}

const loadDismantleLayers = async (kvLevel: any, postData: string, groupLayers: LayerGroup[]) => {
  await loadLayers(kvLevel, postData, getLayerGroupByName('dismantleLayer', groupLayers), 'dismantle', 4, groupLayers);
}

const loadLayers = async (kvLevel: any, postData: string, group: LayerGroup, layerType: string, layerTypeId: number, groupLayers: LayerGroup[]) => {
  let queryFlag = false;
  let layerParamsAdd: any = [];
  await loadWFS(postData, 'pdd:' + layerType + '_line', async (data: any) => {
    if (groupLayers[layerType + '_line']) {
      groupLayers[layerType + '_line'].getSource().clear();
    } else {
      let source = new VectorSource();
      groupLayers[layerType + '_line'] = new Vector({
        source,
        zIndex: 2,
        declutter: true
      });
      groupLayers[layerType + '_line'].set('name', layerType + '_line');
      group.getLayers().push(groupLayers[layerType + '_line']);
    }
    let data_: any = {
      type: "FeatureCollection",
      features: []
    }
    if (data.features && data.features.length > 0) {
      let lineIds: any = [];
      data.features.forEach((feature: any) => {
        if (kvLevel == -1 || feature.properties.kv_level == kvLevel) {
          data_.features.push(feature);
          if (feature.properties.kv_level == kvLevel) {
            lineIds.push(feature.id.split('.')[1])
            queryFlag = true
          }
        }
      })
      let pJSON = (new GeoJSON()).readFeatures(data_);
      for (var i = 0; i < pJSON.length; i++) {
        pJSON[i].setGeometry(pJSON[i].getGeometry()?.transform('EPSG:4326', 'EPSG:3857'));
        let style = line_style(pJSON[i], false, layerType);
        pJSON[i].setStyle(style);
      }
      groupLayers[layerType + '_line'].getSource().addFeatures(pJSON);

      if (lineIds.length == 0)
        return;

      let params: any = {
        lineId: lineIds,
        layerType: layerTypeId
      }
      let promise = findLineDetailInfo(params);
      promise.then((data: any) => {
        if (data.isSuccess && data.content.length > 0) {
          data.content.forEach((d: any) => {
            let feature1, feature2;
            if (d.detail.object1) {
              let lon1 = d.detail.object1.lon;
              let lat1 = d.detail.object1.lat;
              let point1 = new Point(transform([lon1, lat1], 'EPSG:4326', 'EPSG:3857'));
              feature1 = new Feature({
                ...d.detail.object1,
                geometry: point1
              });
              feature1.setId(layerType + '.' + d.detail.object1.id);
            }

            if (d.detail.object2) {
              let lon2 = d.detail.object2.lon;
              let lat2 = d.detail.object2.lat;
              let point2 = new Point(transform([lon2, lat2], 'EPSG:4326', 'EPSG:3857'));
              feature2 = new Feature({
                ...d.detail.object2,
                geometry: point2
              });
              feature2.setId(layerType + '.' + d.detail.object2.id);
            }

            if (d.detail.nodeType1 === 1 || d.detail.nodeType2 === 1) {
              if (d.detail.nodeType1 === 1) {
                if (feature1) {
                  feature1.setStyle(pointStyle(layerType + '_tower', feature1, false));
                  groupLayers[layerType + '_tower'].getSource().addFeature(feature1);
                }
              } else {
                if (feature2) {
                  feature2.setStyle(pointStyle(layerType + '_tower', feature2, false));
                  groupLayers[layerType + '_tower'].getSource().addFeature(feature2);
                }
              }
            } else if (d.detail.nodeType1 === 2 || d.detail.nodeType2 === 2) {
              if (d.detail.nodeType1 === 2) {
                if (feature1) {
                  feature1.setStyle(pointStyle(layerType + '_cable', feature1, false));
                  groupLayers[layerType + '_cable'].getSource().addFeature(feature1);
                }
              } else {
                if (feature2) {
                  feature2.setStyle(pointStyle(layerType + '_cable', feature2, false));
                  groupLayers[layerType + '_cable'].getSource().addFeature(feature2);
                }
              }
            }
          })
        }
      })
    }
  })

  if (!queryFlag) {
    layerParamsAdd.push({
      layerName: 'tower',
      zIndex: 4,
      type: 'point'
    })
    layerParamsAdd.push({
      layerName: 'cable',
      zIndex: 3,
      type: 'point'
    })
  }

  let lps = layerParams.concat(layerParamsAdd)
  lps.forEach((item: any) => {
    let layerName = item.layerName;
    loadWFS(postData, 'pdd:' + layerType + '_' + layerName, (data: any) => {
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
 * 清除高亮图层
 */
const clearHighlightLayer = (map: any) => {
  map?.getLayers().getArray().forEach((layer: any) => {
    if (layer.get('name') === 'highlightLayer')
      layer.getSource().clear();
  })
}

/**
 * 通过wfs方式获取数据
 * @param url 
 * @param postData 
 * @param layerName 
 * @param callBack 
 */
const loadWFS = async (postData: string, layerName: string, callBack: (o: any) => void) => {
  const promise = loadLayer(wfsBaseURL, postData, layerName);
  await promise.then((data: any) => {
    if (data.features && data.features.length > 0) {
      // let flag;
      // projects.forEach((project: any) => {
      //   if (project.id === data.features[0].properties.project_id)
      //     flag = true;
      // })
      const flag = projects.some((project: any) => {
        return project.id === data.features[0].properties.project_id;
      })
      flag && callBack(data);
    }
  })
}

// 加载勘察轨迹图层
const loadTrackLayers = (id: string, map: any, trackLayers: any, type: number = 0, time?: string) => {
  const trackType = ['survey_track', 'disclosure_track'];
  const track = ['survey_Track', 'disclosure_Track'];
  const trackLine = ['survey_TrackLine', 'disclosure_TrackLine'];
  const groupLayer = clearTrackLayers(trackLayers, type);

  var postData = "<?xml version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'><wfs:Query typeName='{0}' srsName='EPSG:4326'>";
  postData = postData + "<ogc:Filter><Or>";
  postData = postData + "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>";
  postData = postData + "</Or></ogc:Filter>";
  postData = postData + "</wfs:Query></wfs:GetFeature>";

  if (time) {
    time = time.replaceAll('/','-');
    var startDate = new Date(time);
    var endDate = new Date(time);
    endDate.setDate(endDate.getDate() + 1);
    var postDataStart = postData.substr(0, 418);
    var postDataEnd = postData.substr(postData.length - 29, 29);
    postData = postDataStart + "<ogc:Filter><And>" + "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>" + "<PropertyIsLessThanOrEqualTo><PropertyName>record_date</PropertyName><Literal>" + endDate.toISOString() + "</Literal></PropertyIsLessThanOrEqualTo><PropertyIsGreaterThanOrEqualTo><PropertyName>record_date</PropertyName><Literal>" + startDate.toISOString() + "</Literal></PropertyIsGreaterThanOrEqualTo></And></ogc:Filter>" + postDataEnd;
  }
  const promise = loadLayer(wfsBaseURL, postData, 'pdd:' + trackType[type]);
  promise.then((data: any) => {
    let surveyTrackLayer = getLayerByName(track[type], groupLayer.getLayers().getArray());
    let surveyTrackLineLayer = getLayerByName(trackLine[type], groupLayer.getLayers().getArray());
    if (!surveyTrackLayer) {
      let source = new VectorSource();
      surveyTrackLayer = new Vector({
        source,
        zIndex: 5
      });
      surveyTrackLayer.set('name', track[type]);
      groupLayer.getLayers().push(surveyTrackLayer);
    }
    if (!surveyTrackLineLayer) {
      let source = new VectorSource();
      surveyTrackLineLayer = new Vector({
        source,
        zIndex: 5
      });
      surveyTrackLayer.set('name', trackLine[type]);
      groupLayer.getLayers().push(surveyTrackLineLayer);
    }

    data.features.forEach((feature: any) => {
      feature.geometry.coordinates = transform(feature.geometry.coordinates, 'EPSG:4326', 'EPSG:3857')
      // feature.setGeometry(feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'));
    })
    const pJSON = (new GeoJSON()).readFeatures(data);
    pJSON.forEach((feature: any) => {
      let s = trackStyle();
      feature.setStyle(s);
    })
    surveyTrackLayer.getSource().addFeatures(pJSON);

    let lineLatlngs: any = [];
    let lineLatlngsSegement: any = [];
    let segementFirstDate: Date;
    let sortedFeatures = sortByTime(data.features);
    // let sortedFeatures = data.features.sort(sortFeaturesFunc);
    
    sortedFeatures.forEach((feature: any) => {
      if (lineLatlngsSegement.length == 0)  segementFirstDate = new Date(feature.properties.record_date);

      lineLatlngsSegement.push(feature.geometry.coordinates);

      var tempDate = new Date(feature.properties.record_date)
      if (tempDate.getTime() - segementFirstDate.getTime() > 1800000 || tempDate.getDay() != segementFirstDate.getDay()) {
        lineLatlngs.push(lineLatlngsSegement);
        lineLatlngsSegement = [];
      }
    })

    if (lineLatlngsSegement!.length > 1) {
      lineLatlngs.push(lineLatlngsSegement);
      lineLatlngsSegement = [];
    }

    var lineGeom = new MultiLineString(lineLatlngs);
    var lineFeature = new Feature({
      geometry: lineGeom
    });
    lineFeature.setStyle(trackLineStyle(lineFeature, 'rgba(255,204,51,1)'));
    surveyTrackLineLayer.getSource().addFeature(lineFeature);
    if (surveyTrackLayer.getSource().getFeatures().length > 0)
      map.getView().fit(surveyTrackLayer.getSource().getExtent(), map.getSize());
  })

}

// 清楚轨迹图层
const clearTrackLayers = (trackLayers: any, type: number = 0) => {
  const layers = ['surveyTrackLayers', 'disclosureTrackLayers'];
  const groupLayer = getLayerGroupByName(layers[type], trackLayers)
  groupLayer.getLayers().getArray().forEach((layer: any) => {
    layer.getSource().clear();
  })
  return groupLayer;
}
// 轨迹点样式
const trackStyle = () => {
  return new ClassStyle({
    image: new Icon({
      src: markerIconSrc,
      anchor: [0.5, 1]
    })
  });
}
// 轨迹线样式
const trackLineStyle = (feature: any, color: string) => {
  var geometry = feature.getGeometry();
  var styles = [new ClassStyle({
    stroke: new Stroke({
      color,
      width: 3
    })
  })];
  geometry.getLineStrings().forEach((lineString: any) => {
    lineString.forEachSegment(function (start: any, end: any) {
      var dx = end[0] - start[0];
      var dy = end[1] - start[1];
      if (dx === 0 && dy === 0) {
        return;
      }
      var rotation = Math.atan2(dy, dx);
      // arrows
      styles.push(
        new ClassStyle({
          geometry: new Point(end),
          image: new Icon({
            src: arrowSrc,
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation,
          }),
        })
      );
    });
  })
  return styles;
}

// 按时间排序
// function sortFeaturesFunc(a: any, b: any) {
//   var aDate = new Date(a.properties.record_date);
//   var bDate = new Date(b.properties.record_date);
//   return aDate.getTime() - bDate.getTime();
// }

// 根据名称获取图层
const getLayerByName = (name: string, layers: Layer[]): any => {
  // let layer = null;
  // layers.forEach((item: Layer) => {
  //   if (item.get('name') === name) {
  //     layer = item;
  //   }
  // });
  // return layer;
  return layers.find((item: Layer) => item.get('name') === name);
}

// 根据名称获取图层组
const getLayerGroupByName = (name: string, layerGroups: LayerGroup[]): any => {
  // let layerGroup = null;
  // layerGroups.forEach((item: LayerGroup) => {
  //   if (item.get('name') === name) {
  //     layerGroup = item;
  //   }
  // });
  // return layerGroup;
  return layerGroups.find((item: LayerGroup) => item.get('name') === name)
}

// 根据项目进行定位
const relocateMap = (projectId: string = "", layerGroups: LayerGroup[], view: any, setView: any, map: any) => {
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

// 获取比例尺
const getScale = (map: any) => {
  const view = map.getView();
  // let center = view.getCenter();
  // let projection = view.getProjection();
  // let resolution = view.getResolution();
  // let pointResolution = getPointResolution(
  //   projection,
  //   resolution,
  //   center,
  //   ProjUnits.METERS
  // );
  let pointResolution = getPointResolution(
    view.getProjection(),
    view.getResolution(),
    view.getCenter(),
    ProjUnits.METERS
  );

  let minWidth = 64;
  let nominalCount = minWidth * pointResolution;
  let suffix = '';
  if (nominalCount < 0.001) {
    suffix = 'μm';
    pointResolution *= 1000000;
  } else if (nominalCount < 1) {
    suffix = 'mm';
    pointResolution *= 1000;
  } else if (nominalCount < 1000) {
    suffix = 'm';
  } else {
    suffix = 'km';
    pointResolution /= 1000;
  }

  let i = 3 * Math.floor(Math.log(minWidth * pointResolution) / Math.log(10));
  let count, width, decimalCount;
  const LEADING_DIGITS = [1, 2, 5];

  while (true) {
    decimalCount = Math.floor(i / 3);
    const decimal = Math.pow(10, decimalCount);
    count = LEADING_DIGITS[((i % 3) + 3) % 3] * decimal;
    width = Math.round(count / pointResolution);
    if (isNaN(width)) {
      // this.element.style.display = 'none';
      // this.renderedVisible_ = false;
      return;
    } else if (width >= minWidth) {
      break;
    }
    ++i;
  }
  let text = count.toFixed(decimalCount < 0 ? -decimalCount : 0) + ' ' + suffix;
  return "1 : " + text;
}


export {
  refreshMap,
  getLayerByName,
  getLayerGroupByName,
  clearHighlightLayer,
  loadTrackLayers,
  clearTrackLayers,
  relocateMap,
  getScale
};


