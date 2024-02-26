import {
  getData,
  getDynamicTrackDetail,
  getExtent,
  getMediaSign,
  ProjectList,
} from '@/services/visualization-results/visualization-results'
import { handleDecrypto } from '@/utils/utils'
import Feature from 'ol/Feature'
import WKT from 'ol/format/WKT'
import MultiLineString from 'ol/geom/MultiLineString'
import { Draw } from 'ol/interaction'
import { createBox } from 'ol/interaction/Draw'
import LayerGroup from 'ol/layer/Group'
import Layer from 'ol/layer/Layer'
import Vector from 'ol/layer/Vector'
import { getPointResolution, transform } from 'ol/proj'
import ProjUnits from 'ol/proj/Units'
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'
import { layerParams, LayerParams } from './localData/layerParamsData'
import {
  cable_channel_styles,
  line_style,
  pointStyle,
  trackLineStyle,
  trackStyle,
  zero_guy_style,
} from './localData/pointStyle'
import { LineCluster, sortByTime } from './utils'

var projects: any
var layerGroups: LayerGroup[]
var mediaSign: boolean
var mediaSignData: any
var timer: any
var mapMovetimer: any
var mapMoveEnds: any[] = []
var layerTypes: any[] = []
var extent_: any[] = []
var dragBox: any
// var showData: any = [];
/**
 * 由普通线路和水平拉线形成的线簇数组列表
 */
let lineClusters: LineCluster[] = []
const getLineClusters = () => {
  return lineClusters
}
/**
 * 当前选中项目的所有勘察轨迹日期
 */
let trackRecordDateArray: string[] = []
const getTrackRecordDateArray = () => {
  return trackRecordDateArray
}

const refreshMap = async (ops: any, projects_: any, location: boolean = false) => {
  const { layerGroups: groupLayers, view, setView, map } = ops
  let isLoad = false
  if (projects_) {
    isLoad = true
    projects = projects_
    clearHighlightLayer(map)
  }

  // if(currentLevel && currentLevel === Math.round(map.getView().getZoom())){
  //   if(projects_ === null){
  //     return false;
  //   }
  // }
  // currentLevel = Math.round(map.getView().getZoom());

  if (projects.length === 0 || layerTypes.length === 0) {
    extent_ = []
    clearGroups(groupLayers)
    return false
  }
  lineClusters = []
  if (isLoad) {
    await getExtent({ layerTypes, projects }).then((data: any) => {
      if (data) {
        const mapRegion = handleDecrypto(data)
        if (!mapRegion.content) return
        const minX = mapRegion.content?.minX
        const minY = mapRegion.content?.minY
        const maxX = mapRegion.content?.maxX
        const maxY = mapRegion.content?.maxY
        const min = transform([minX, minY], 'EPSG:4326', 'EPSG:3857')
        const max = transform([maxX, maxY], 'EPSG:4326', 'EPSG:3857')
        extent_ = [min[0], min[1], max[0], max[1]]
        let dx = extent_[2] - extent_[0]
        let dy = extent_[3] - extent_[1]
        extent_ = [
          extent_[0] * (1 - dx / extent_[0] / 5),
          extent_[1] * (1 - dy / extent_[1] / 5),
          extent_[2] * (1 + dx / extent_[2] / 5),
          extent_[3] * (1 + dy / extent_[3] / 5),
        ]
        map.getView().fit(extent_, map.getSize())
      }
    })
  }

  let extent = map.getView().calculateExtent(map.getSize())
  let minExtent = transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326')
  let maxExtent = transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326')
  const extent_4326 = [minExtent[0], minExtent[1], maxExtent[0], maxExtent[1]]
  let ids: any = []

  projects.forEach((item: any) => {
    ids.push({ id: item.id })
  })

  let params = {
    polygonCoordinates: [
      [extent_4326[0], extent_4326[1]],
      [extent_4326[2], extent_4326[1]],
      [extent_4326[2], extent_4326[3]],
      [extent_4326[0], extent_4326[3]],
      [extent_4326[0], extent_4326[1]],
    ],
    zoomLevel: Math.round(map.getView().getZoom()),
    layerTypes: layerTypes,
    projects: ids,
  }

  mapMoveEnds.push(new Date())
  let startLength = mapMoveEnds.length
  mapMovetimer && clearInterval(mapMovetimer)
  mapMovetimer = setInterval(function () {
    if (startLength === mapMoveEnds.length) {
      const promise = getData(params)
      promise.then(async (data: any) => {
        const decryData = handleDecrypto(data)

        clearGroups(groupLayers)

        decryData.content.survey &&
          (await loadSurveyLayers(decryData.content.survey, groupLayers, map))
        decryData.content.plan && (await loadPlanLayers(decryData.content.plan, groupLayers, map))
        decryData.content.design &&
          (await loadDesignLayers(
            decryData.content.design,
            groupLayers,
            view,
            setView,
            map,
            location
          ))
        decryData.content.dismantle &&
          (await loadDismantleLayers(decryData.content.dismantle, groupLayers, map))
      })
      mapMoveEnds = []
    } else {
      mapMovetimer && clearInterval(mapMovetimer)
    }
  }, 500)

  // await loadPreDesignLayers(groupLayers)

  // const postData = getXmlData(projects, startDate, endDate)

  // await loadPlanLayers(postData, groupLayers, map)
  // await loadDismantleLayers(postData, groupLayers, map)
  // await loadDesignLayers(postData, groupLayers, view, setView, map, location)

  // for (let index = 0; index < lineClusters.length; index++) {
  //   const lineCluster = lineClusters[index]
  //   lineCluster.updateLabelControlValue(false)
  // }
  // setLayerGroups(groupLayers)
}

const checkZoom = (evt: any, map: any) => {
  let oldValue = evt.oldValue
  let mapResolution = evt.target.getResolution()
  // 地图放大(经过临界点)
  if (mapResolution < 0.2 && oldValue > 0.2) {
    for (let index = 0; index < lineClusters.length; index++) {
      const lineCluster = lineClusters[index]
      lineCluster.updateLabelControlValue(true)
    }
  }
  // 地图缩小(经过临界点)
  else if (mapResolution > 0.2 && oldValue < 0.2) {
    for (let index = 0; index < lineClusters.length; index++) {
      const lineCluster = lineClusters[index]
      lineCluster.updateLabelControlValue(false)
    }
  }

  timer && clearInterval(timer)
  if (mediaSign) {
    loadMediaSign(map, layerGroups, mediaSign, true)
    timer = setInterval(function () {
      loadMediaSign(map, layerGroups, mediaSign, true)
    }, 1000)
  } else {
    timer && clearInterval(timer)
  }

  // if(mapResolution < 0.2) {
  //   let surveyLayer = getLayerByName('surveyLayer', map.getLayers().getArray());
  //   console.log(surveyLayer);
  //   console.log(surveyLayer.getLayers().getArray());
  //   surveyLayer.getLayers().getArray().forEach((item:any) => {
  //     console.log(item.get('name'));
  //     console.log(item.getStyle());
  //   })
  // }
}

const loadSurveyLayers = async (data: any, groupLayers: LayerGroup[]) => {
  layerParams.forEach((item: LayerParams) => {
    let layerName = item.layerName
    let layerNames_ = layerName.split('_')
    let footlayerName_ = ''
    layerNames_.forEach((item: any) => {
      footlayerName_ += item[0].toLocaleUpperCase() + item.substring(1)
    })
    let layerName_ = footlayerName_[0].toLocaleLowerCase() + footlayerName_.substring(1)
    if (data[layerName_])
      loadWFSData(
        data[layerName_],
        'survey',
        layerName,
        getLayerGroupByName('surveyLayer', groupLayers),
        groupLayers,
        item
      )
  })
}

const loadPlanLayers = async (data: any, groupLayers: LayerGroup[]) => {
  layerParams.forEach((item: LayerParams) => {
    let layerName = item.layerName
    let layerNames_ = layerName.split('_')
    let footlayerName_ = ''
    layerNames_.forEach((item: any) => {
      footlayerName_ += item[0].toLocaleUpperCase() + item.substring(1)
    })
    let layerName_ = footlayerName_[0].toLocaleLowerCase() + footlayerName_.substring(1)
    if (data[layerName_])
      loadWFSData(
        data[layerName_],
        'plan',
        layerName,
        getLayerGroupByName('planLayer', groupLayers),
        groupLayers,
        item
      )
  })
}

const loadDesignLayers = async (data: any, groupLayers: LayerGroup[]) => {
  layerParams.forEach((item: LayerParams) => {
    let layerName = item.layerName
    let layerNames_ = layerName.split('_')
    let footlayerName_ = ''
    layerNames_.forEach((item: any) => {
      footlayerName_ += item[0].toLocaleUpperCase() + item.substring(1)
    })
    let layerName_ = footlayerName_[0].toLocaleLowerCase() + footlayerName_.substring(1)
    if (data[layerName_])
      loadWFSData(
        data[layerName_],
        'design',
        layerName,
        getLayerGroupByName('designLayer', groupLayers),
        groupLayers,
        item
      )
  })

  // relocateMap('', groupLayers, view, setView, map, location)
}

const loadDismantleLayers = async (data: any, groupLayers: LayerGroup[]) => {
  layerParams.forEach((item: LayerParams) => {
    let layerName = item.layerName
    let layerNames_ = layerName.split('_')
    let footlayerName_ = ''
    layerNames_.forEach((item: any) => {
      footlayerName_ += item[0].toLocaleUpperCase() + item.substring(1)
    })
    let layerName_ = footlayerName_[0].toLocaleLowerCase() + footlayerName_.substring(1)
    if (data[layerName_])
      loadWFSData(
        data[layerName_],
        'dismantle',
        layerName,
        getLayerGroupByName('dismantleLayer', groupLayers),
        groupLayers,
        item
      )
  })
}

// const loadPreDesignLayers = async (groupLayers: LayerGroup[]) => {
//   let groupLayer = getLayerGroupByName('preDesignLayer', groupLayers)
//   let layerType = 'preDesign'
//   // 点位图层
//   if (groupLayers[layerType + '_point']) {
//     groupLayers[layerType + '_point'].getSource().clear()
//   } else {
//     let source = new VectorSource()
//     groupLayers[layerType + '_point'] = new Vector({
//       source,
//       zIndex: 6,
//     })
//     groupLayers[layerType + '_point'].set('name', layerType + '_point')
//     groupLayer.getLayers().push(groupLayers[layerType + '_point'])
//   }

//   // 线路图层
//   if (groupLayers[layerType + '_line']) {
//     groupLayers[layerType + '_line'].getSource().clear()
//   } else {
//     let sourceLine = new VectorSource()
//     groupLayers[layerType + '_line'] = new Vector({
//       source: sourceLine,
//       zIndex: 6,
//     })
//     groupLayers[layerType + '_line'].set('name', layerType + '_line')
//     groupLayer.getLayers().push(groupLayers[layerType + '_line'])
//   }

//   let projectIds: any = []
//   projects.forEach((item: ProjectList) => {
//     projectIds.push(item.id)
//   })
//   await getDataByProjectId({ projectIds }).then((res) => {
//     res.content.forEach((data: any) => {
//       if (data.equipments) {
//         const points = data.equipments.map((p: any) => {
//           const feature = new Feature()
//           feature.setGeometry(new Point([p.lng!, p.lat!])?.transform('EPSG:4326', 'EPSG:3857'))
//           feature.setStyle(getStyle('Point')('design', p.typeStr || '无类型', p.name, true))

//           feature.setProperties(p)
//           feature.set('sourceType', layerType)
//           return feature
//         })

//         groupLayers[layerType + '_point'].getSource().addFeatures(points)
//       }

//       if (data.lines) {
//         const lines = data.lines.map((p: any) => {
//           const feature = new Feature()
//           feature.setGeometry(
//             new LineString([
//               [p.startLng!, p.startLat!],
//               [p.endLng!, p.endLat!],
//             ])?.transform('EPSG:4326', 'EPSG:3857')
//           )

//           feature.setStyle(getStyle('LineString')('design', p.typeStr || '无类型', p.name, true))
//           // feature.setStyle(lineStyle[p.type])
//           // Object.keys(p).forEach((key) => {
//           //   feature.set(key, p[key])
//           // })
//           feature.setProperties(p)
//           feature.set('sourceType', layerType)
//           return feature
//         })
//         groupLayers[layerType + '_line'].getSource().addFeatures(lines)
//       }
//     })
//   })
// }

const loadWFSData = (
  data: any,
  layerType: string,
  layerName: string,
  group: LayerGroup,
  groupLayers: LayerGroup[],
  item: LayerParams
) => {
  if (groupLayers[layerType + '_' + layerName]) {
    if (groupLayers[layerType + '_' + layerName].getSource() instanceof Cluster)
      groupLayers[layerType + '_' + layerName].getSource().getSource().clear()
    else groupLayers[layerType + '_' + layerName].getSource().clear()
  }
  let pJSON: any = []

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let format = new WKT()
      let feature = format.readFeature(data[i].geom)
      feature.setGeometry(feature.getGeometry()?.transform('EPSG:4326', 'EPSG:3857'))
      feature.set('id_', `${layerType}_${layerName}.${new Date().getTime()}`)
      feature.setProperties(data[i])
      if (item.type !== 'point') {
        let style
        // 普通线路
        if (item.type == 'line') {
          let props = feature.getProperties()
          // 电缆线
          if (props?.is_cable) {
            feature.setProperties({
              layer_name: 'line',
              showLabel: true,
              showLengthLabel: false,
            })
          }
          // 架空线路
          else {
            feature.setProperties({
              layer_name: 'line',
              showLabel: false,
              showLengthLabel: false,
            })
            if (props.start_type === '线路') {
            } // 架空线路拐点处生成的短线
            else if (props.start_node_type) {
              // 判断线路型号label里是否包含距离label
              let lengthLabel = props?.length?.toFixed(2) + 'm'
              let lengthLabelIndex = props?.lable?.indexOf(lengthLabel)
              if (lengthLabelIndex > 0) {
                // 删除线路型号label中的距离label
                feature.setProperties({ lable: props?.lable.substr(0, lengthLabelIndex) })
              }

              // 为线簇数组添加线簇
              let isAdded = false
              for (let index = 0; index < lineClusters.length; index++) {
                const lineCluster = lineClusters[index]
                if (lineCluster.isShouldContainLine(feature)) {
                  feature.setProperties({ line_cluster_id: lineCluster.id })
                  lineCluster.insertLine(feature, 'line')
                  isAdded = true
                }
              }

              if (!isAdded) {
                if (lineClusters.length === 130) {
                  // console.log(feature, props.start_id, props.end_id);
                }
                feature.setProperties({ line_cluster_id: lineClusters.length + 1 })
                lineClusters.push(
                  new LineCluster(
                    lineClusters.length + 1,
                    props.start_id,
                    props.end_id,
                    [feature],
                    []
                  )
                )
              }
            }
          }

          style = line_style(feature, false)
        }
        // 水平拉线
        else if (item.type === 'zero_guy') {
          feature.setProperties({
            layer_name: 'zero_guy',
            showLabel: false,
            showLengthLabel: false,
          })
          let props = feature.getProperties()
          if (!props.mode) {
            let index = props.label?.indexOf(props.length)
            feature.setProperties({ mode: props.label?.substr(0, index - 1) })
          }
          if (props.mode_id?.startsWith('NULL')) {
            let index = props.label?.indexOf(props.length)
            feature.setProperties({ mode_id: props.label?.substr(0, index - 1) })
          }
          if (layerType === 'design') {
            switch (props.state) {
              case 1:
                feature.setProperties({ symbol_id: 2010 })
                break
              case 2:
                feature.setProperties({ symbol_id: 2011 })
                break
              case 3:
                feature.setProperties({ symbol_id: 2012 })
                break
              case 4:
                feature.setProperties({ symbol_id: 2013 })
                break
              default:
                feature.setProperties({ symbol_id: 2011 })
            }
          } else if (layerType === 'dismantle') {
            feature.setProperties({ symbol_id: 2020 })
          }

          // 为线簇数组添加线簇
          let isAdded = false
          for (let index = 0; index < lineClusters.length; index++) {
            const lineCluster = lineClusters[index]
            if (lineCluster.isShouldContainLine(feature)) {
              feature.setProperties({ line_cluster_id: lineCluster.id })
              lineCluster.insertLine(feature, 'zero_guy')
              isAdded = true
            }
          }
          if (!isAdded) {
            feature.setProperties({ line_cluster_id: lineClusters.length + 1 })
            lineClusters.push(
              new LineCluster(lineClusters.length + 1, props.start_id, props.end_id, [], [feature])
            )
          }

          style = zero_guy_style(feature, false)
        }
        // 电缆线路
        else if (item.type === 'cable_channel') {
          feature.setProperties({
            layer_name: 'cable_channel',
            showLabel: true,
            showLengthLabel: false,
          })
          if (!feature.getProperties().symbol_id) {
            if (layerType === 'dismantle' || feature.getProperties().state === 4) {
              feature.setProperties({ symbol_id: '3020' })
            } else {
              feature.setProperties({ symbol_id: '3010' })
            }
          }

          style = cable_channel_styles(feature)
        } else if (item.type === 'special_point') {
          style = pointStyle(layerType + '_' + layerName, feature, false)
        } else if (item.type === 'pull_line') {
          style = pointStyle(layerType + '_' + layerName, feature, false)
        }

        //  else if (item.type === 'subline') {
        //   style = fzx_styles();
        // }
        feature.setStyle(style)
      }
      pJSON.push(feature)
    }
    // groupLayers[layerType + '_' + layerName].getSource().addFeatures(pJSON);
  }
  if (groupLayers[layerType + '_' + layerName]) {
    if (groupLayers[layerType + '_' + layerName].getSource() instanceof Cluster) {
      groupLayers[layerType + '_' + layerName].getSource().getSource().addFeatures(pJSON)
    } else {
      groupLayers[layerType + '_' + layerName].getSource().addFeatures(pJSON)
    }
  } else {
    //矢量要素数据源
    let source = new VectorSource({
      features: pJSON,
    })

    interface LayerObject {
      source: any
      zIndex: number
      declutter?: boolean
      style?: any
      minZoom?: number
    }
    let obj: LayerObject = {
      source,
      zIndex: item.zIndex,
      declutter: item.declutter,
    }
    if (item.type === 'point') {
      //聚合标注数据源
      // var clusterSource = new Cluster({
      //   distance: 40, //聚合的距离参数，即当标注间距离小于此值时进行聚合，单位是像素
      //   source, //聚合的数据源，即矢量要素数据源对象
      // })
      obj.source = source
      obj.style = (feature: any, resolution: any) => {
        // var size = feature.get('features').length; //获取该要素所在聚合群的要素数量
        // var style = styleCache[size];
        // if (!style) {
        //   style = pointStyle(layerType + '_' + layerName, feature.get('features')[0], false);
        //   styleCache[size] = style;
        // }
        var style = pointStyle(layerType + '_' + layerName, feature, false, false, resolution)
        return style
      }
    } else if (item.type === 'line' || item.type === 'cable_channel') {
      // obj.minZoom = 13
    }
    groupLayers[layerType + '_' + layerName] = new Vector(obj)
    groupLayers[layerType + '_' + layerName].set('name', layerType + '_' + layerName)
    group.getLayers().push(groupLayers[layerType + '_' + layerName])
  }
}

/**
 * 通过wfs方式获取数据
 * @param url
 * @param postData
 * @param layerName
 * @param callBack
 */
// const loadWFS = async (postData: string, layerName: string, callBack: (o: any) => void) => {
//   const promise = loadLayer(postData, layerName)
//   await promise.then((data: any) => {
//     if (data.features && data.features.length > 0) {
//       // const flag = projects.some((project: any) => {
//       //   return project.id === data.features[0].properties.project_id;
//       // });
//       // data.features.forEach((feature: any) => {
//       //   let obj: LayerDatas;
//       //   const project = projects.find(
//       //     (project: any) => project.id === feature.properties.project_id,
//       //   );
//       //   if (project) {
//       //     let ld = layerDatas.find((layerData: LayerDatas) => project.id === layerData.projectID);
//       //     if (!ld) {
//       //       obj = {
//       //         projectID: project.id,
//       //         time: project.time,
//       //         data: [],
//       //       };
//       //       layerDatas.push(obj);
//       //     } else {
//       //       ld.data.push({
//       //         name: layerName,
//       //         data,
//       //       });
//       //     }
//       //   }
//       // });
//       callBack(data)
//     }
//   })
// }

// 加载勘察轨迹图层
const loadTrackLayers = (map: any, trackLayers: any, type: number = 0) => {
  const track = ['survey_Track', 'disclosure_Track']
  const trackLine = ['survey_TrackLine', 'disclosure_TrackLine']
  const groupLayer = clearTrackLayers(trackLayers, type)
  const projectIds = projects.map((project: any) => {
    return project.id
  })
  getDynamicTrackDetail({ projectIds, trackType: type + 1 }).then((data: any) => {
    const decryData = handleDecrypto(data)
    if (decryData.code !== 200) return
    // 筛选轨迹记录日期
    let recordSet: any = new Set()
    decryData.content.forEach((feature: any) => {
      feature.record_date = feature.recordDate
      recordSet.add(new Date(feature.recordDate).toLocaleDateString())
    })
    trackRecordDateArray = Array.from(recordSet)
    let surveyTrackLayer = getLayerByName(track[type], groupLayer.getLayers().getArray())
    let surveyTrackLineLayer = getLayerByName(trackLine[type], groupLayer.getLayers().getArray())
    if (!surveyTrackLayer) {
      let source = new VectorSource()
      surveyTrackLayer = new Vector({
        source,
        zIndex: 6,
      })
      surveyTrackLayer.set('name', track[type])
      groupLayer.getLayers().push(surveyTrackLayer)
    }
    if (!surveyTrackLineLayer) {
      let source = new VectorSource()
      surveyTrackLineLayer = new Vector({
        source,
        zIndex: 5,
      })
      surveyTrackLineLayer.set('name', trackLine[type])
      groupLayer.getLayers().push(surveyTrackLineLayer)
    }
    const wktFormat: any = new WKT()
    let obj = {}
    for (let i = 0; i < decryData.content.length; i++) {
      let ai = decryData.content[i]
      if (!obj[ai.projectId]) {
        obj[ai.projectId] = [ai]
      } else {
        obj[ai.projectId].push(ai)
      }
    }
    let res: any = []
    Object.keys(obj).forEach((key: any) => {
      res.push({
        id: key,
        data: obj[key],
      })
    })

    res.forEach((re: any) => {
      re.data.forEach((item: any) => {
        const feature = wktFormat.readFeature(item.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })
        feature.setProperties(item)
        const s = trackStyle()
        feature.setStyle(s)
        surveyTrackLayer.getSource().addFeature(feature)
      })

      let lineFeatures: any = []
      let lineLatlngsSegement: any = []
      let segementFirstDate: Date = new Date()
      let segementFirstDateString: string = ''
      let sortedFeatures = sortByTime(re.data)
      // let sortedFeatures = data.features.sort(sortFeaturesFunc);

      for (let i = 0; i < sortedFeatures.length; i++) {
        const feature = sortedFeatures[i]
        if (lineLatlngsSegement.length === 0) {
          segementFirstDate = new Date(feature.recordDate)
          segementFirstDateString = segementFirstDate.toLocaleDateString()
        }

        let tempDate = new Date(feature.recordDate)
        // 记录属于同一日的勘察轨迹
        if (tempDate.getDay() === segementFirstDate.getDay()) {
          const point = wktFormat.readGeometry(feature.geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          })
          lineLatlngsSegement.push(point.getCoordinates())
        } else {
          // 完成本日期的勘察轨迹记录
          let lineGeom = new MultiLineString([lineLatlngsSegement])
          let lineFeature = new Feature({
            geometry: lineGeom,
            record_date: segementFirstDateString,
            project_id: re.id,
          })
          lineFeature.setStyle(trackLineStyle(lineFeature))
          lineFeatures.push(lineFeature)
          // 开始记录下一日期的勘察轨迹
          lineLatlngsSegement = []
          const point = wktFormat.readGeometry(feature.geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          })
          lineLatlngsSegement.push(point.getCoordinates())
          segementFirstDate = new Date(feature.recordDate)
          segementFirstDateString = segementFirstDate.toLocaleDateString()
        }
      }

      if (lineLatlngsSegement!.length > 1) {
        let lineGeom = new MultiLineString([lineLatlngsSegement])
        let lineFeature = new Feature({
          geometry: lineGeom,
          record_date: segementFirstDateString,
          project_id: re.id,
        })
        lineFeature.setStyle(trackLineStyle(lineFeature))
        lineFeatures.push(lineFeature)
        lineLatlngsSegement = []
      }
      surveyTrackLineLayer.getSource().addFeatures(lineFeatures)
    })

    if (surveyTrackLayer.getSource().getFeatures().length > 0)
      map.getView().fit(surveyTrackLayer.getSource().getExtent(), map.getSize())
  })
}

// 清楚轨迹图层
const clearTrackLayers = (trackLayers: any, type: number = 0) => {
  const layers = ['surveyTrackLayers', 'disclosureTrackLayers']
  const groupLayer = getLayerGroupByName(layers[type], trackLayers)
  groupLayer
    .getLayers()
    .getArray()
    .forEach((layer: any) => {
      layer.getSource().clear()
    })
  return groupLayer
}

// 多媒体标记
const loadMediaSign = (
  map: any,
  layerGroups_?: LayerGroup[],
  mediaSign_?: boolean,
  isChange?: boolean
) => {
  if (layerGroups_) layerGroups = layerGroups_

  if (mediaSign_ != null && !isChange) {
    mediaSign = mediaSign_
  }

  if (!mediaSignData) loadMediaSignData()

  if (!mediaSignData) {
    return
  }
  mediaSignData.then((data: any) => {
    const decryData = handleDecrypto(data)
    if (decryData.content && decryData.content.length > 0) {
      layerGroups.forEach((layerGroup: any) => {
        let l: any = layerGroup
          .getLayers()
          .getArray()
          .find((l: any) => l.getProperties().name.includes('mediaSign'))
        if (l) l.getSource().clear()
        if (!mediaSign) return
        layerGroup
          .getLayers()
          .getArray()
          .forEach((layer: any) => {
            let layerName = layer.getProperties().name
            let layerType = layerName.split('_')[0]
            if (layerName !== layerType + '_mediaSign') {
              layer
                .getSource()
                .getFeatures()
                .forEach((item: any) => {
                  let feature = item
                  decryData.content.forEach((d: any) => {
                    if (feature.getProperties().id === d.main_ID) {
                      // layerName =  layerName.substring(layerName.split('_')[0].length + 1, layerName.length);
                      if (!layerGroups[layerType + '_mediaSign']) {
                        var source = new VectorSource()
                        layerGroups[layerType + '_mediaSign'] = new Vector({
                          source,
                          // declutter: true,
                          zIndex: 100,
                        })
                        layerGroups[layerType + '_mediaSign'].set('name', layerType + '_mediaSign')
                      }
                      let itemClone = item.clone()
                      let style = pointStyle(layer.get('name'), feature, false, mediaSign)
                      itemClone.setStyle(style)
                      itemClone.set('data', feature.getProperties())
                      layerGroups[layerType + '_mediaSign'].getSource().addFeature(itemClone)
                      if (
                        !getLayerByName(layerType + '_mediaSign', layerGroup.getLayers().getArray())
                      )
                        layerGroup.getLayers().push(layerGroups[layerType + '_mediaSign'])
                    }
                  })
                })
            }
          })
      })
    }
  })
}

const loadMediaSignData = () => {
  if (!mediaSign) return

  let projectIds: any = []
  projects.forEach((item: ProjectList) => {
    projectIds.push(item.id)
  })
  let params: any = {
    projectIds,
  }
  mediaSignData = getMediaSign(params)
}

// 按时间排序
// function sortFeaturesFunc(a: any, b: any) {
//   var aDate = new Date(a.properties.record_date);
//   var bDate = new Date(b.properties.record_date);
//   return aDate.getTime() - bDate.getTime();
// }

// 根据名称获取图层
// @ts-ignore
const getLayerByName = (name: string, layers: Layer[]): any => {
  // let layer = null;
  // layers.forEach((item: Layer) => {
  //   if (item.get('name') === name) {
  //     layer = item;
  //   }
  // });
  // return layer;
  return layers.find((item: Layer) => item.get('name') === name)
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
const relocateMap = (map: any) => {
  if (extent_.length !== 0) map.getView().fit(extent_, map!.getSize())
}

// 清楚所有图层组中的数据
const clearGroups = (layerGroups: LayerGroup[]) => {
  layerGroups.forEach((item: LayerGroup) => {
    item.getLayers().forEach((layer: any) => {
      if (layer.getSource() instanceof Cluster) layer.getSource().getSource().clear()
      else layer.getSource().clear()
    })
  })
}

// 拉框删除
export const drawBox = (map: any, layerGroups_: any) => {
  dragBox = new Draw({
    source: new VectorSource(),
    // condition: platformModifierKeyOnly,
    type: 'Circle',
    geometryFunction: createBox(),
  })
  map.addInteraction(dragBox)

  dragBox.on('drawend', function (e: any) {
    const extent = e.feature.getGeometry().getExtent()
    const surveyLayer = getLayerGroupByName('surveyLayer', layerGroups_)
    const planLayer = getLayerGroupByName('planLayer', layerGroups_)
    // pointLayer = getLayer(map, 'pointLayer')
    // boxSelectFeatures = pointLayer
    //   .getSource()
    //   .getFeaturesInExtent(extent)
    //   .filter((feature: any) => feature.getGeometry().intersectsExtent(extent))
    let moveData: any = []
    surveyLayer
      .getLayers()
      .getArray()
      .forEach((item: any) => {
        let data = item
          .getSource()
          .getFeaturesInExtent(extent)
          .filter((feature: any) => feature.getGeometry().intersectsExtent(extent))
        moveData = moveData.concat(data)
      })

    planLayer
      .getLayers()
      .getArray()
      .forEach((item: any) => {
        let data = item
          .getSource()
          .getFeaturesInExtent(extent)
          .filter((feature: any) => feature.getGeometry().intersectsExtent(extent))
        moveData = moveData.concat(data)
      })

    let highlightLayer = getLayerByName('highlightLayer', map.getLayers().getArray())
    // 高亮显示
    if (!highlightLayer) {
      var source = new VectorSource()
      highlightLayer = new Vector({
        source,
        // declutter: true,
        zIndex: 99,
      })
      highlightLayer.set('name', 'highlightLayer')
      map.addLayer(highlightLayer)
    }
    moveData.forEach(function (feature_: any) {
      // 判断类型(点线面)
      let featureClone = feature_.clone()
      let type = featureClone.getGeometry().getType().toLocaleLowerCase()
      let highlightStyle
      let id_ = feature_.getProperties().id_
      let name = id_.substr(0, id_.indexOf('.'))
      let layerName = name.substring(name.split('_')[0].length + 1, name.length)
      // 为选中的水平拉线图层添加高亮
      if (layerName === 'zero_guy') {
        highlightStyle = zero_guy_style(featureClone, true)
      } else if (type.indexOf('point') >= 0) {
        featureClone.set('feature_name', name)
        highlightStyle = pointStyle(name, featureClone, true, false, map.getView().getResolution())
      } else if (layerName === 'cable_channel') {
        highlightStyle = cable_channel_styles(featureClone, true)
      } else {
        highlightStyle = line_style(featureClone, true)
      }

      featureClone.setStyle(highlightStyle)
      highlightLayer.getSource().addFeature(featureClone)
    })
  })
  dragBox.setActive(false)
}

export const setDrawBox = (active: boolean) => {
  dragBox.setActive(active)
}

/**
 * 清除高亮图层
 */
const clearHighlightLayer = (map: any) => {
  map
    ?.getLayers()
    .getArray()
    .forEach((layer: any) => {
      if (layer.get('name') === 'highlightLayer') layer.getSource().clear()
    })
}

/**
 *
 * 改变图层类型
 */
const changeLayerType = (type: number, visible: boolean) => {
  if (visible) {
    layerTypes.push(type)
  } else {
    layerTypes.forEach((layerType: number, index: number) => {
      if (layerType === type) {
        layerTypes.splice(index, 1)
      }
    })
  }

  return Array.from(new Set(layerTypes))
}

// 获取比例尺
const getScale = (map: any) => {
  const view = map.getView()
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
  )

  let minWidth = 64
  let nominalCount = minWidth * pointResolution
  let suffix = ''
  if (nominalCount < 0.001) {
    suffix = 'μm'
    pointResolution *= 1000000
  } else if (nominalCount < 1) {
    suffix = 'mm'
    pointResolution *= 1000
  } else if (nominalCount < 1000) {
    suffix = 'm'
  } else {
    suffix = 'km'
    pointResolution /= 1000
  }

  let i = 3 * Math.floor(Math.log(minWidth * pointResolution) / Math.log(10))
  let count, width, decimalCount
  const LEADING_DIGITS = [1, 2, 5]

  while (true) {
    decimalCount = Math.floor(i / 3)
    const decimal = Math.pow(10, decimalCount)
    count = LEADING_DIGITS[((i % 3) + 3) % 3] * decimal
    width = Math.round(count / pointResolution)
    if (isNaN(width)) {
      // this.element.style.display = 'none';
      // this.renderedVisible_ = false;
      return
    } else if (width >= minWidth) {
      break
    }
    ++i
  }
  let text = count.toFixed(decimalCount < 0 ? -decimalCount : 0) + ' ' + suffix
  return '1 : ' + text
}

//经纬度截取
const getLngAndLat = (geom: any) => {
  return geom.substring(geom.indexOf('(') + 1, geom.indexOf(')')).split(' ')
}

const CalcTowerAngle = (startLine: any, endLine: any, isLeft: boolean) => {
  startLine[0] = transform(startLine[0], 'EPSG:4326', 'EPSG:3857')
  startLine[1] = transform(startLine[1], 'EPSG:4326', 'EPSG:3857')
  endLine[0] = transform(endLine[0], 'EPSG:4326', 'EPSG:3857')
  endLine[1] = transform(endLine[1], 'EPSG:4326', 'EPSG:3857')
  let startLineAngle = computeAngle(startLine[0], startLine[1])
  let startLineSupAngle = startLineAngle > 180 ? startLineAngle - 180 : 180 + startLineAngle
  let endLineAngle = computeAngle(endLine[0], endLine[1])
  let angle = Math.abs(endLineAngle - startLineAngle)
  if (angle >= 180) angle = 360 - angle //即为补角
  if (startLineAngle <= 180) {
    if (endLineAngle > startLineAngle && endLineAngle < startLineSupAngle) isLeft = true
    else isLeft = false
  } else {
    if (endLineAngle < startLineAngle && endLineAngle > startLineSupAngle) isLeft = false
    else isLeft = true
  }
  return [angle, isLeft]
}

const computeAngle = (point1: any, point2: any) => {
  let dx = point2[0] - point1[0]
  let dy = point2[1] - point1[1]
  let radian = Math.atan2(dy, dx)
  let angle = (180 / Math.PI) * radian
  return angle
}

const ToDegrees = (val: any) => {
  var degree = parseInt(val)
  var min = parseInt((val - degree) * 60)
  var sec = parseInt((val - degree) * 3600 - min * 60)
  return degree + '°' + min + '′' + sec + '″'
}

const handleGeom = (data: string) => {
  return data.substring(data.indexOf('(') + 1, data.indexOf(')')).split(' ')
}

export {
  CalcTowerAngle,
  changeLayerType,
  checkZoom,
  clearHighlightLayer,
  clearTrackLayers,
  getLayerByName,
  getLayerGroupByName,
  getLineClusters,
  getLngAndLat,
  getScale,
  getTrackRecordDateArray,
  handleGeom,
  loadMediaSign,
  loadMediaSignData,
  loadTrackLayers,
  refreshMap,
  relocateMap,
  ToDegrees,
}
