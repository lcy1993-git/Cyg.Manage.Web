import {
  getDesignMaterialModifyList,
  getDynamicDetail,
  getGisDetail,
  getlibId_new,
  getMaterialItemData,
  getMedium,
} from '@/services/visualization-results/visualization-results'
import { handleDecrypto } from '@/utils/utils'
import { message } from 'antd'
import Vector from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'
import getMappingTagsDictionary, { findenumsValue } from './localData/mappingTagsDictionary'
import {
  cable_channel_styles,
  line_style,
  pointStyle,
  trackLineStyle,
  trackStyle,
  zero_guy_style,
} from './localData/pointStyle'
import {
  clearHighlightLayer,
  getLayerByName,
  getScale,
  getTrackRecordDateArray,
  loadMediaSign,
} from './methods'
import { getMode } from './threeMode'
import { format } from './utils'

var removeData: any = [] // 迁移数据
const LevelEnmu = ['无', '220V', '380V', '10kV']

/**
 * ops.setSurveyModalData
 * ops.setSurveyModalVisible
 */

// const mappingTagsData = getMappingTagsDictionary();
// const mappingTagsDictionary: any =typeof mappingTagsData === 'string' ? JSON.parse(mappingTagsData) : {};
const mediaLayers = ['tower', 'cable', 'cable_equipment', 'electric_meter', 'mark']
const materiaLayers = [
  'tower',
  'transformer',
  'over_head_device',
  'pull_line',
  'electric_meter',
  'cross_arm',
  'user_line',
  'cable_channel',
  'fault_indicator',
  'zero_guy',
]
// const householdLayers = ['electric_meter']
const AdditionMaterialLayer = ['tower', 'cable_head']

const commentLayers = ['tower', 'cable', 'cable_equipment', 'mark', 'transformer']
const layerTypeEnum = {
  survey: '勘察',
  plan: '方案',
  design: '设计',
  dismantle: '拆除',
}
const layerTypeIDEnum = {
  survey: 1,
  plan: 2,
  design: 3,
  dismantle: 4,
}
const elementTypeEnum = {
  tower: '杆塔',
  cable: '电缆井',
  cable_equipment: '电气设备',
  mark: '地物',
  transformer: '变压器',
  over_head_device: '柱上设备',
  line: '线路' || '电缆',
  cable_channel: '电缆通道',
  electric_meter: '户表',
  cross_arm: '横担',
  hole: '电缆剖面',
  user_line: '下户线',
  fault_indicator: '故障指示器',
  pull_line: '拉线',
  zero_guy: '水平拉线',
  brace: '撑杆',
  Track: '轨迹点',
  TrackLine: '轨迹线',
  cable_head: '电缆中间头',
}
const lineTowerType = [
  {
    key: 1,
    value: 'tower',
  },
  {
    key: 2,
    value: 'cable',
  },
  {
    key: 3,
    value: 'cable_equipment',
  },
  {
    key: 4,
    value: 'electric_meter',
  },
  {
    key: 9,
    value: 'cross_arm',
  },
]
/**
 * 用于记录当前鼠标停留的要素
 */
let selectedFeature = null
/**
 * 用于筛选展示的勘察、交底轨迹点位
 */
let trackRecordDate = ''
let mapContent = null
let clickEvt: any = null
let clickOps: any = null
let isShowCableStatus = false

export const getMoveData = (map: any) => {
  let highlightLayer = getLayerByName('highlightLayer', map.getLayers().getArray())
  if (highlightLayer) {
    return highlightLayer.getSource().getFeatures()
  } else {
    return null
  }
}

export const changCheck = (map: any, isShowCable: any) => {
  // let highlightLayer = getLayerByName('highlightLayer', map.getLayers().getArray())
  // if(highlightLayer)
  //   console.log(highlightLayer.getSource().getFeatures());
  if (clickEvt && clickOps) {
    clearHighlightLayer(map)
    isShowCableStatus = isShowCable
    setTimeout(() => {
      mapClick(clickEvt, map, clickOps)
    }, 1000) // 等待1秒（1000毫秒）
  }
}

export const mapClick = (evt: any, map: any, ops: any) => {
  mapContent = map
  clickEvt = evt
  clickOps = ops

  // 解决本地存储mappingTagsData的bug
  const mappingTagsData = getMappingTagsDictionary()
  let mappingTagsDictionary: any
  if (typeof mappingTagsData === 'object' && mappingTagsData !== null) {
    mappingTagsDictionary = mappingTagsData
  } else if (typeof mappingTagsData === 'string') {
    mappingTagsDictionary = JSON.parse(mappingTagsData)
  } else {
    mappingTagsDictionary = {}
  }

  let mappingTags: any, mappingTagValues
  let selected = false

  // 处理点击事件点击到物体也会setFlase的bug
  // let setRightSidebarVisiviabelFlag = false;
  // 清除高亮
  const isCtrl = map.get('isCtrl')

  if (!isCtrl) {
    clearHighlightLayer(map)
    removeData = []
  }
  let layerName = ''
  // 遍历选中的数据
  map.forEachFeatureAtPixel(evt.pixel, async function (feature_: any, layer: any) {
    // setRightSidebarVisiviabelFlag = true;
    var feature: any
    if (selected) return
    selected = true

    if (layer.getProperties().name === 'highlightLayer') {
      if (isCtrl) {
        layer.getSource().removeFeature(feature_)
      } else {
        clearHighlightLayer(map)
        removeData = []
        return
      }
    }

    if (layer.getSource() instanceof Cluster) {
      if (feature_.get('features').length > 1) {
        let lont = feature_.get('features')[0].getGeometry().getCoordinates()
        let item = feature_
          .get('features')
          .find((item: any) => item.getGeometry().getCoordinates().toString() !== lont.toString())
        if (item) return
      }
      feature = feature_.get('features')[0]
    } else {
      feature = feature_
    }

    layerName = layer.getProperties().name
    layerName = layerName.substring(layerName.split('_')[0].length + 1, layerName.length)

    // 判断选中的图层类型
    let layerType = layer.getProperties().name.split('_')[0]
    feature.set('layerType', layerTypeIDEnum[layerType])

    if (isCtrl) {
      if (layerTypeIDEnum[layerType] === 1 || layerTypeIDEnum[layerType] === 2) {
        removeData.push(feature.getProperties())
      } else {
        return
      }
    }

    if (layerType === 'preDesign') return
    if (!isCtrl) map.getTargetElement().style.cursor = 'wait'
    if (layer.getProperties().name.includes('mediaSign')) {
      let params = {
        projectId: feature.getProperties().data.project_id,
        devices: [
          {
            category: 1, // 1为勘察，2为预设
            deviceId: feature.getProperties().data.id,
          },
        ],
      }
      if (layerType) {
        switch (layerType) {
          case 'survey':
            params.devices[0].category = 1
            break
          case 'plan':
            params.devices[0].category = 4
            break
          // case 'design':
          //   params.devices[0].category = 2;
          //   break;
          // case 'dismantle':
          //   params.devices[0].category = 3;
          //   break;
        }
      }
      getMedium(params)
        .then((data: any) => {
          ops.addMediaData(data)
        })
        .catch((e) => {
          message.error(e)
        })
      map.getTargetElement().style.cursor = 'default'
      return
    }

    switch (layerType) {
      case 'survey':
      case 'plan':
        mappingTags =
          mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags1 ||
          mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags
        break
      case 'design':
      case 'dismantle':
        if (layerName === 'line') {
          elementTypeEnum[layerName] = feature.getProperties().is_cable ? '电缆' : '线路'
          mappingTags = feature.getProperties().is_cable
            ? mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags3
            : mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags2
        } else {
          mappingTags =
            mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags2 ||
            mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTags
        }

        break
    }

    // 映射图层相对应的字段
    mappingTagValues = mappingTagsDictionary[layerName.toLocaleLowerCase()]?.mappingTagValues

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
    let highlightFeatures = []
    let totalLength = 0
    let totalMode = feature.getProperties().mode
    let totalkvLevel = feature.getProperties().kv_level
    let totalState = feature.getProperties().state
    let totalName = feature.getProperties().name
    let totalIsupgraded = feature.getProperties().isupgraded
    let totalRemark = feature.getProperties().remark
    if (layerName === 'line' || layerName === 'user_line' || layerName === 'zero_guy') {
      let layerTypeValue = feature.getProperties().layerType
      if (
        feature.getProperties().polyline_id &&
        feature.getProperties().is_cable &&
        isShowCableStatus
      ) {
        map
          .getLayers()
          .getArray()
          .forEach(function (value: any) {
            if (typeof value.getLayers === 'function') {
              value
                .getLayers()
                .getArray()
                .forEach(function (v: any) {
                  let layerName_ = v.getProperties().name
                  let layerType_ = layerName_.split('_')[0]
                  layerName_ = layerName_.substring(
                    layerName_.split('_')[0].length + 1,
                    layerName_.length
                  )
                  if (
                    layerType_ === layerType &&
                    (layerName_ === layerName || layerName_ === 'subline')
                  ) {
                    v.getSource()
                      .getFeatures()
                      .forEach(function (f: any) {
                        if (
                          f.getProperties().polyline_id === feature.getProperties().polyline_id &&
                          f.getProperties().segment_id === feature.getProperties().segment_id
                        ) {
                          f.set('layerType', layerTypeValue)
                          if (f.getProperties().length) {
                            let l = Number(f.getProperties().length) || 0
                            totalLength += l
                          }
                          if (f.getProperties().mode !== totalMode) {
                            totalMode = '*多种*'
                          }
                          if (f.getProperties().kv_level !== totalkvLevel) {
                            totalkvLevel = '*多种*'
                          }
                          if (f.getProperties().state !== totalState) {
                            totalState = '*多种*'
                          }
                          if (f.getProperties().name !== totalName) {
                            totalName = '*多种*'
                          }
                          if (f.getProperties().isupgraded !== totalIsupgraded) {
                            totalIsupgraded = '*多种*'
                          }
                          if (f.getProperties().remark !== totalRemark) {
                            totalRemark = '*多种*'
                          }

                          highlightFeatures.push(f)
                        }
                      })
                  }
                })
            }
          })
      } else {
        highlightFeatures.push(feature)
      }
    } else {
      highlightFeatures.push(feature)
    }

    // 轨迹图层也高亮
    if (layer.getProperties().name.indexOf('Track') < 0) {
      highlightFeatures.forEach(function (feature_) {
        // 判断类型(点线面)
        let featureClone = feature_.clone()
        let type = featureClone.getGeometry().getType().toLocaleLowerCase()
        let highlightStyle
        // 为选中的水平拉线图层添加高亮
        if (layerName === 'zero_guy') {
          highlightStyle = zero_guy_style(featureClone, true)
        } else if (type.indexOf('point') >= 0) {
          featureClone.set('feature_name', layer.getProperties().name)
          highlightStyle = pointStyle(
            layer.getProperties().name,
            featureClone,
            true,
            false,
            map.getView().getResolution()
          )
        } else if (layerName === 'cable_channel') {
          highlightStyle = cable_channel_styles(featureClone, true)
        } else {
          highlightStyle = line_style(featureClone, true)
        }

        featureClone.setStyle(highlightStyle)
        highlightLayer.getSource().addFeature(featureClone)
      })
      highlightLayer.setVisible(true)
    }

    if (isCtrl) {
      return
    }
    let featureId = feature.getProperties().id
    // if (!featureId) featureId = feature.getId().split('.')[1];
    // 有些想要展示的字段需要通过接口进行查询
    let parmas = {
      layerType: layerTypeIDEnum[layerType],
      companyId:
        feature.getProperties().company === undefined ? null : feature.getProperties().company,
      projectId:
        feature.getProperties().project_id === undefined
          ? null
          : feature.getProperties().project_id,
      recordId:
        feature.getProperties().recorder === undefined ? null : feature.getProperties().recorder,
      surveyId:
        feature.getProperties().surveyor === undefined ? null : feature.getProperties().surveyor,
      pullLineId: featureId,
    }
    await getGisDetail(parmas).then((data: any) => {
      const decryData = handleDecrypto(data)
      if (decryData.content) {
        feature.set('companyName', decryData.content.companyName)
        feature.set('projectName', decryData.content.projectName)
        feature.set('recorderName', decryData.content.recordName)
        feature.set('surveyorName', decryData.content.surveyName)
        feature.set('modeName', decryData.content.pullLineModelName)
      }
    })

    var pJSON = {}

    for (var p in mappingTags) {
      var mappingTag = mappingTags[p]
      if (mappingTagValues !== undefined && mappingTagValues[p] !== undefined) {
        pJSON[mappingTag] = mappingTagValues[p][feature.getProperties()[p]]
      } else {
        switch (p) {
          case 'voltage':
            let voltages = {
              无: '无',
              V220: '220V',
              V380: '380V',
              KV10: '10KV',
            }
            pJSON[mappingTag] = voltages[feature.getProperties()['voltage']]
            break
          case 'company':
            pJSON[mappingTag] = feature.getProperties()['companyName']
            break
          case 'project_id':
            pJSON[mappingTag] = feature.getProperties()['projectName']
            break
          case 'recorder':
            pJSON[mappingTag] = feature.getProperties()['recorderName']
            break

          case 'surveyor':
            if (layerType === 'design' || layerType === 'dismantle') mappingTag = '设计人员'
            pJSON[mappingTag] = feature.getProperties()['surveyorName']
            break
          case 'main_id':
            await getDynamicDetail({
              id: feature.getProperties()['main_id'],
              tableName: `${layerType}_tower`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                pJSON[mappingTag] = decryRes.content.code
              } else {
                pJSON[mappingTag] = ''
              }
            })
            break
          case 'sub_id':
            await getDynamicDetail({
              id: feature.getProperties()['sub_id'],
              tableName: `${layerType}_tower`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                pJSON[mappingTag] = decryRes.content.code
              } else {
                pJSON[mappingTag] = ''
              }
            })
            break
          case 'start_id':
            let startItem = lineTowerType.find(
              (item) => item.key === feature.getProperties().start_node_type
            )
            await getDynamicDetail({
              id: feature.getProperties()['start_id'],
              tableName: `${layerType}_${startItem?.value}`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                pJSON[mappingTag] = decryRes.content.code
              } else {
                pJSON[mappingTag] = ''
              }
            })
            break
          case 'end_id':
            let endItem = lineTowerType.find(
              (item) => item.key === feature.getProperties().end_node_type
            )
            await getDynamicDetail({
              id: feature.getProperties()['end_id'],
              tableName: `${layerType}_${endItem?.value}`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                pJSON[mappingTag] = decryRes.content.code
              } else {
                pJSON[mappingTag] = ''
              }
            })

            break
          case 'parent_id':
            let parentLayer = 'tower'
            let parentName = feature.getProperties()['parent_name']
            if (parentName?.startsWith('ElectricMeter')) {
              parentLayer = 'electric_meter'
            } else if (parentName?.startsWith('CableDevice')) {
              parentLayer = 'cable_equipment'
            }
            await getDynamicDetail({
              id: feature.getProperties()['parent_id'],
              tableName: `${layerType}_${parentLayer}`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                parentLayer === 'electric_meter'
                  ? (pJSON[mappingTag] = decryRes.content.name)
                  : (pJSON[mappingTag] = decryRes.content.code)
              } else {
                pJSON[mappingTag] = ''
              }
            })
            break
          case 'parent_line_id':
            await getDynamicDetail({
              id: feature.getProperties()['parent_id'],
              tableName: `${layerType}_line`,
            }).then((data: any) => {
              const decryRes = handleDecrypto(data)
              if (decryRes.content) {
                pJSON[mappingTag] = decryRes.content.name
              } else {
                pJSON[mappingTag] = ''
              }
            })
            break
          case 'mode_id':
            pJSON[mappingTag] = feature.getProperties()['modeName']
            break
          case 'survey_time':
            if (layer.getProperties().name.split('_')[0] !== 'design')
              pJSON[mappingTag] = feature.getProperties()[p]
                ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p]))
                : null
            break
          case 'record_date':
            pJSON[mappingTag] = feature.getProperties()[p]
              ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p]))
              : null
            break
          case 'length':
            if (totalLength) pJSON[mappingTag] = totalLength.toFixed(2)
            else
              pJSON[mappingTag] = Number(feature.getProperties()[p])
                ? Number(feature.getProperties()[p]).toFixed(2)
                : 0
            break
          case 'azimuth':
            pJSON[mappingTag] = Number(feature.getProperties()[p])
              ? Number(feature.getProperties()[p])?.toFixed(2)
              : 0
            if (layerName === 'tower') {
              pJSON[mappingTag] = feature.getProperties()[p]
            }
            break
          case 'capacity':
            if (feature.getProperties()[p].indexOf('kVA') >= 0)
              pJSON[mappingTag] = feature.getProperties()[p].substr(3) + 'kVA'
            break
          default:
            pJSON[mappingTag] = feature.getProperties()[p]
            break
        }
      }

      switch (p) {
        case 'mode':
          if (totalMode === '*多种*') pJSON[mappingTag] = totalMode
          break
        case 'kv_level':
          if (totalkvLevel === '*多种*') pJSON[mappingTag] = totalkvLevel
          break
        case 'state':
          if (totalState === '*多种*') pJSON[mappingTag] = totalState
          break
        case 'name':
          if (totalName) pJSON[mappingTag] = totalName
          break
        case 'isupgraded':
          if (totalIsupgraded) pJSON[mappingTag] = totalIsupgraded
          break
        case 'remark':
          if (totalRemark) pJSON[mappingTag] = totalRemark
          break
      }
    }

    // 查看多媒体功能
    if (layerType === 'survey' || layerType === 'plan') {
      if (mediaLayers.indexOf(layerName) >= 0) {
        let params = {
          projectId: feature.getProperties().project_id,
          devices: [
            {
              category: 1, // 1为勘察，2为预设
              deviceId: featureId,
            },
          ],
        }
        if (layerType) {
          switch (layerType) {
            case 'survey':
              params.devices[0].category = 1
              break
            case 'plan':
              params.devices[0].category = 4
              break
            // case 'design':
            //   params.devices[0].category = 2;
            //   break;
            // case 'dismantle':
            //   params.devices[0].category = 3;
            //   break;
          }
        }
        pJSON['多媒体'] = { params }
        // await getMedium(params).then((data: any) => {
        //   pJSON['多媒体'] = data.content || [];
        // });
      }
    }

    // if (
    //   layerType === 'survey' ||
    //   layerType === 'plan' ||
    //   layerType === 'design' ||
    //   layerType === 'dismantle'
    // ) {
    //   if (householdLayers.indexOf(layerName) >= 0) {
    //     let params = {
    //       type: layerType,
    //       projectId: feature.getProperties().project_id,
    //       deviceId: featureId,
    //       getProperties: feature.getProperties(),
    //     }

    //     pJSON['入户线'] = { params }
    //   }
    // }

    // 仅有设计图层和拆除图层可以查看相关的材料表
    if (layerType === 'design' || layerType === 'dismantle') {
      // 查看材料表
      if (materiaLayers.indexOf(layerName) >= 0) {
        const materialModifyList = await getDesignMaterialModifyList({
          deviceId: featureId,
          projectId: feature.getProperties().project_id,
          layerType: layerType,
          // deviceType: "string"
        })

        const objectID =
          layerName === 'electric_meter'
            ? feature.getProperties().entry_id
            : feature.getProperties().mode_id ||
              feature.getProperties().equip_model_id ||
              feature.getProperties().model_id

        if (!feature.getProperties().kv_level) {
          let g = getLayerByName(layerType + 'Layer', map.getLayers().getArray()) // console.log(g.getLayers(),1);
          let l = getLayerByName(layerType + '_tower', g.getLayers().getArray())
          let fs = l
            ?.getSource()
            .getFeatures()
            .find(
              (item: any) =>
                item.getProperties().features?.[0].getProperties().id ===
                feature.getProperties().main_id
            )
          // feature.getProperties().kv_level = ;
          fs && feature.set('kv_level', fs.getProperties().features?.[0].getProperties().kv_level)
        }

        let voltagelevel = {
          无: 0,
          V220: 1,
          V380: 2,
          KV10: 3,
        }
        if (feature.getProperties().voltage)
          feature.set('kv_level', voltagelevel[feature.getProperties().voltage])

        pJSON['材料表'] = {
          params: {
            holeId: feature.getProperties().project_id,
            projectId: feature.getProperties().project_id,
            deviceId: featureId,
            type: layerType,
            rest: {
              objectID,
              forProject: 0,
              forDesign: 0,
              state: findenumsValue('SurveyState')[feature.getProperties().state],
              materialModifyList: materialModifyList?.content || [],
              layerName,
              kvLevel: Number.isInteger(feature.getProperties().kv_level)
                ? LevelEnmu[feature.getProperties().kv_level]
                : null,
            },
            getProperties: feature.getProperties(),
          },
        }
      }
    }

    // if (layerType === 'design' || layerType === 'dismantle' || layerType === 'survey' ) {
    // 批注功能
    if (commentLayers.indexOf(layerName) >= 0) {
      pJSON['审阅'] = { id: feature.getProperties().project_id, feature }
    }
    // }

    //杆塔和电缆中间头显示附加材料表
    if (
      layerType === 'survey' ||
      layerType === 'plan' ||
      layerType === 'design' ||
      layerType === 'dismantle'
    ) {
      if (AdditionMaterialLayer.indexOf(layerName) >= 0) {
        let params = {
          type: layerType,
          projectId: feature.getProperties().project_id,
          deviceId: featureId,
          getProperties: feature.getProperties(),
        }

        pJSON['附加材料表'] = { params }
      }
    }

    let threeMode = getMode(layerName, feature.getProperties())
    if (threeMode && threeMode !== '') {
      // dev上的三维模型需要关闭
      // pJSON['三维模型'] = threeMode;
    }

    // 轨迹线不弹出侧边栏
    if (elementTypeEnum[layerName] === '轨迹线') {
      map.getTargetElement().style.cursor = 'default'
      return
    }
    // 相应数据到右侧边栏
    const resData = []
    const propertiesData = []
    if (elementTypeEnum[layerName] !== '轨迹点') {
      resData.push({ propertyName: '所属图层', data: layerTypeEnum[layerType] + '图层' })
    }
    resData.push({
      propertyName:
        elementTypeEnum[layerName] === '水平拉线' || elementTypeEnum[layerName] === '户表'
          ? '设备种类'
          : '元素类型',
      data: elementTypeEnum[layerName],
    })
    for (let p in pJSON) {
      if (p === '杆规格') {
        pJSON[p] = `${feature.getProperties().rod}*${feature.getProperties().height}`
      }
      if (p === '呼称高') {
        pJSON[p] = feature.getProperties().normimalheight
        // await getlibId_new({ projectId: feature.getProperties().project_id }).then(async (data) => {
        //   if (data.isSuccess) {
        //     const resourceLibID = data?.content
        //     await getModulesRequest({
        //       moduleIDs: [feature.getProperties().mode_id],
        //       resourceLibID,
        //     }).then((res) => {
        //       if (res.isSuccess && res?.content.length > 0) {
        //         pJSON[p] = res?.content[0].nominalHeight
        //       }
        //     })
        //   }
        // })
      }
      if (p === '导线相数') {
        pJSON[p] = feature.getProperties().kv_level === 2 ? '三相' : '两相'
      }
      if (p === '穿孔示意图') {
        let channelId = feature.getProperties().channel_id
        let g = getLayerByName(layerType + 'Layer', map.getLayers().getArray()) // console.log(g.getLayers(),1);
        let l = getLayerByName(layerType + '_cable_channel', g.getLayers().getArray())
        let f = l
          .getSource()
          .getFeatures()
          .find((f: any) => f.values_.id === channelId)

        pJSON[p] = {
          holeId: feature.getProperties().id,
          layerType: layerType === 'design' ? 1 : 2,
          title: f.values_.mode,
          layMode: f.values_.lay_mode,
          arrangement: f.values_.arrangement,
        }
      }

      if (p === '方向') {
        let azimuth = feature.getProperties().azimuth
        if (azimuth) {
          if (azimuth >= -90 && azimuth < 90) {
            pJSON[p] = '→↑'
          } else {
            pJSON[p] = '←↓'
          }
        } else {
          pJSON[p] = ''
        }
      }
      if (p === '下户线型号') {
        let g = getLayerByName(layerType + 'Layer', map.getLayers().getArray()) // console.log(g.getLayers(),1);
        let l = getLayerByName(layerType + '_user_line', g.getLayers().getArray())
        let fs = l
          ?.getSource()
          .getFeatures()
          .find((item: any) => item.getProperties().end_id === feature.getProperties().id)
        if (!fs) {
          // 无下户线下户的户表
          // 此处读取无下户线户表的材料表，从中读取‘下户线型号’和‘下户线长度’
          const objectID =
            layerName === 'electric_meter'
              ? feature.getProperties().entry_id
              : feature.getProperties().mode_id || feature.getProperties().equip_model_id
          const materialModifyList = await getDesignMaterialModifyList({
            deviceId: featureId,
            projectId: feature.getProperties().project_id,
            layerType: layerType,
            // deviceType: "string"
          })

          const materiaParams = {
            holeId: feature.getProperties().project_id,
            rest: {
              objectID,
              forProject: 0,
              forDesign: 0,
              state: findenumsValue('SurveyState')[feature.getProperties().state],
              kvLevel: Number.isInteger(feature.getProperties().kv_level)
                ? LevelEnmu[feature.getProperties().kv_level]
                : null,
              materialModifyList: materialModifyList?.content || [],
              layerName,
            },
            getProperties: feature.getProperties(),
          }
          let libIdData = await getlibId_new({ projectId: materiaParams?.getProperties.project_id })
          const decryLibData = handleDecrypto(libIdData)
          if (decryLibData.isSuccess) {
            const resourceLibID = decryLibData?.content

            let materialItemData = await getMaterialItemData({
              resourceLibID,
              ...materiaParams.rest,
              layerName: 'electric_meter',
            })
            if (materialItemData) {
              const materialId = feature.getProperties().material_id
              const currentItem = materialItemData?.find((item) => {
                return item.addFlagID && item.addFlagID === materialId
              })

              if (currentItem) {
                pJSON[p] = currentItem.spec || '' // 材料表中的‘下户线型号’
                // const crlenth = (currentItem.itemNumber ?? 0) + currentItem.unit;
                const crlenth =
                  currentItem.itemNumber === undefined ? '' : currentItem.itemNumber + 'm'

                pJSON['下户线长度'] = crlenth // 材料表中的‘下户线长度’
              } else {
                pJSON[p] = '暂无' // 材料表中的‘下户线型号’
                pJSON['下户线长度'] = '暂无' // 材料表中的‘下户线长度’
              }
            } else {
              pJSON[p] = '暂无' // 材料表中的‘下户线型号’
              pJSON['下户线长度'] = '暂无' // 材料表中的‘下户线长度’
            }
          } else {
            pJSON[p] = '暂无' // 材料表中的‘下户线型号’
            pJSON['下户线长度'] = '暂无' // 材料表中的‘下户线长度’
          }
        }
      }
      if (p === '是否改造') {
        pJSON[p] ? (pJSON[p] = '是') : (pJSON[p] = '否')
      }
      if (p === '是否煤改电') {
        pJSON[p] ? (pJSON[p] = '是') : (pJSON[p] = '否')
      }
      if (p === '户表ID' || p === '电缆沟土建') {
        pJSON[p] = feature.getProperties()
      }
      resData.push({ propertyName: p, data: pJSON[p] || pJSON[p] === 0 ? pJSON[p] : '' })
    }

    // 下户线长度字段为空时不显示
    resData.forEach((item) => {
      if (
        (item.propertyName === '下户线型号' ||
          item.propertyName === '下户线长度' ||
          item.propertyName === '所属节点') &&
        item.data === ''
      ) {
      } else {
        propertiesData.push(item)
      }
    })
    // 点击轨迹点时传输日期数组
    if (elementTypeEnum[layerName] === '轨迹点') {
      propertiesData.push({ propertyName: '所有勘察日期', data: getTrackRecordDateArray() })
      ops.setSurveyModalData({
        resData,
        select: getTrackRecordDateArray(),
        evt: evt.pixel,
      })
      ops.setSurveyModalVisible(true)
      ops.setRightSidebarVisiviabel(false)
    } else {
      ops.setRightSidebarData(propertiesData)
      ops.setRightSidebarVisiviabel(true)
      ops.setSurveyModalVisible(false)
    }

    map.getTargetElement().style.cursor = 'default'

    if (elementTypeEnum[layerName] === '水平拉线') {
      // 勿删，测试反馈的时候用
    }
  })

  chooseCurDayTrack('')

  // if(!setRightSidebarVisiviabelFlag) {
  ops.setRightSidebarVisiviabel(false)
  ops.setSurveyModalVisible(false)
  // }
  loadMediaSign(map)
}

// 当前经纬度映射到HTML节点
export const mapPointermove = (evt: any, map: any) => {
  let coordinate = evt.coordinate
  let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326')
  const x = document.getElementById('currentPositionX')
  const y = document.getElementById('currentPositionY')
  if (x !== null) x.innerHTML = lont[0].toFixed(4)
  if (y !== null) y.innerHTML = lont[1].toFixed(4)
  if (map.getTargetElement().style.cursor === 'wait') return
  map.getTargetElement().style.cursor = 'default'
  let allowed = true
  map.forEachFeatureAtPixel(evt.pixel, function () {
    // if (layer.getSource() instanceof Cluster) {
    //   if (feature.get('features').length > 1) {
    //     let lont = feature.get('features')[0].getGeometry().getCoordinates()
    //     let item = feature
    //       .get('features')
    //       .find((item: any) => item.getGeometry().getCoordinates().toString() !== lont.toString())
    //     if (item) allowed = false
    //   }
    // }
    if (allowed) map.getTargetElement().style.cursor = 'pointer'
    else map.getTargetElement().style.cursor = 'not-allowed'
  })

  if (selectedFeature) {
    // 设置默认样式
    setTrackLayerDefaultStyle(map)
    selectedFeature = null
  }

  let selected = false
  map.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) {
    if (selected) {
      return
    }
    selected = true
    selectedFeature = feature

    // 获取当前图层名称
    let layerName = layer?.get('name')
    // 获取的图层时轨迹点图层
    if (layerName === 'survey_Track' || layerName === 'disclosure_Track') {
      // 获取全部地图图层
      map.getLayers().forEach((item) => {
        if (
          item.get('name') === 'surveyTrackLayers' ||
          item.get('name') === 'disclosureTrackLayers'
        ) {
          // 为该点设置选中样式
          feature.setStyle(trackStyle(isCurDayTrack(feature), true, true))
          // 为整条轨迹线设置选中样式
          // item
          //   .getLayers()
          //   .item(1)
          //   ?.getSource()
          //   .getFeatures()
          //   .forEach((item) => {
          //     if (
          //       item.getProperties().record_date.substr(0, 10) ===
          //       feature.getProperties().record_date.substr(0, 10)
          //     ) {
          //       item.setStyle(trackLineStyle(item, isCurDayTrack(item), true, true))
          //     }
          //   })
        }
      })
    }
    // 获取的图层时轨迹线图层
    else if (layerName === 'survey_TrackLine' || layerName === 'disclosure_TrackLine') {
      // 获取全部地图图层
      map.getLayers().forEach((item) => {
        if (
          item.get('name') === 'surveyTrackLayers' ||
          item.get('name') === 'disclosureTrackLayers'
        ) {
          // 为整条轨迹线设置选中样式
          item
            .getLayers()
            .item(1)
            ?.getSource()
            .getFeatures()
            .forEach((item) => {
              if (
                item.getProperties().record_date.substr(0, 10) ===
                feature.getProperties().record_date.substr(0, 10)
              ) {
                item.setStyle(trackLineStyle(item, isCurDayTrack(item), true, true))
              }
            })
        }
      })
    }
  })
}

// 当前比例尺映射到HTML节点
export const mapMoveend = (evt: any, map: any) => {
  const scaleSize: HTMLSpanElement = document.getElementById('currentScaleSize') as HTMLSpanElement
  if (scaleSize !== null) scaleSize.innerHTML = getScale(map) || ''

  let highlightLayer = getLayerByName('highlightLayer', map.getLayers().getArray())
  if (highlightLayer && highlightLayer.getSource().getFeatures().length > 0) {
    let type = highlightLayer
      .getSource()
      .getFeatures()[0]
      .getGeometry()
      .getType()
      .toLocaleLowerCase()

    if (type.indexOf('point') >= 0) {
      const style = pointStyle(
        highlightLayer.getSource().getFeatures()[0].get('feature_name'),
        highlightLayer.getSource().getFeatures()[0],
        true,
        false,
        map.getView().getResolution()
      )
      highlightLayer.getSource().getFeatures()[0].setStyle(style)
    }
  }
}

/**
 * 按日期筛选勘察轨迹
 * @param currentDate 进行筛选的日期
 */
export const chooseCurDayTrack = (currentDate: string) => {
  trackRecordDate = currentDate
  setTrackLayerDefaultStyle(mapContent)
}

function setTrackLayerDefaultStyle(map: any, locked: boolean = false) {
  map.getLayers().forEach((item) => {
    if (item.get('name') === 'surveyTrackLayers' || item.get('name') === 'disclosureTrackLayers') {
      item
        .getLayers()
        .item(0)
        ?.getSource()
        .getFeatures()
        .forEach((item) => {
          // 为所有轨迹点设置默认样式
          item.setStyle(trackStyle(isCurDayTrack(item), false, locked))
        })
      item
        .getLayers()
        .item(1)
        ?.getSource()
        .getFeatures()
        .forEach((item) => {
          // 为整条轨迹线设置默认样式
          item.setStyle(trackLineStyle(item, isCurDayTrack(item), false, locked))
        })
    }
  })
}
function isCurDayTrack(feature: any) {
  if (trackRecordDate?.length > 0) {
    return new Date(feature.get('record_date')).toLocaleDateString() === trackRecordDate
  } else {
    return true
  }
}
