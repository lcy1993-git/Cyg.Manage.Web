import {
  getDesignMaterialModifyList,
  getGisDetail,
} from '@/services/visualization-results/visualization-results'
import getMappingTagsDictionary, { findenumsValue } from './localData/mappingTagsDictionary'
import { format } from './utils'

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
const LevelEnmu = ['无', '220V', '380V', '10kV']
const elementTypeEnum = {
  tower: '杆塔',
  cable: '电缆井',
  cableEquipment: '电气设备',
  mark: '地物',
  transformer: '变压器',
  overHeadDevice: '柱上设备',
  line: '线路' || '电缆',
  cableChannel: '电缆通道',
  electricMeter: '户表',
  crossArm: '横担',
  hole: '电缆剖面',
  userLine: '下户线',
  faultIndicator: '故障指示器',
  pullLine: '拉线',
  zeroGuy: '水平拉线',
  brace: '撑杆',
  Track: '轨迹点',
  TrackLine: '轨迹线',
  cableHead: '电缆中间头',
}
const householdLayers = ['electricMeter']
const mediaLayers = ['tower', 'cable', 'cableEquipment', 'electricMeter', 'mark']
const materiaLayers = [
  'tower',
  'transformer',
  'overHeadDevice',
  'pullLine',
  'electricMeter',
  'crossArm',
  'userLine',
  'cableChannel',
  'faultIndicator',
  'zeroGuy',
]

export const mapClick = async (map: any, feature: any) => {
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
  let mappingTags: any
  let mappingTagValues: any
  const layerId = feature.layer.id
  const layerType = layerId.split('_')[0]
  const layerName = layerId.split('_')[1]
  feature.properties.layerType = layerTypeIDEnum[layerType]
  console.log(feature)

  console.log(map.getStyle())
  switch (layerType) {
    case 'survey':
    case 'plan':
      mappingTags =
        mappingTagsDictionary[layerName]?.mappingTags1 ||
        mappingTagsDictionary[layerName]?.mappingTags
      break
    case 'design':
    case 'dismantle':
      if (layerName === 'line') {
        elementTypeEnum[layerName] = feature.properties.is_cable ? '电缆' : '线路'
        mappingTags = feature.properties.is_cable
          ? mappingTagsDictionary[layerName]?.mappingTags3
          : mappingTagsDictionary[layerName]?.mappingTags2
      } else {
        mappingTags =
          mappingTagsDictionary[layerName]?.mappingTags2 ||
          mappingTagsDictionary[layerName]?.mappingTags
      }
      break
  }
  // 映射图层相对应的字段
  mappingTagValues = mappingTagsDictionary[layerName]?.mappingTagValues

  let featureId = feature.properties.id
  // if (!featureId) featureId = feature.getId().split('.')[1];
  // 有些想要展示的字段需要通过接口进行查询
  let parmas = {
    layerType: layerTypeIDEnum[layerType],
    companyId: feature.properties.company === undefined ? null : feature.properties.company,
    projectId: feature.properties.project_id === undefined ? null : feature.properties.project_id,
    recordId: feature.properties.recorder === undefined ? null : feature.properties.recorder,
    surveyId: feature.properties.surveyor === undefined ? null : feature.properties.surveyor,
    pullLineId: featureId,
  }

  await getGisDetail(parmas).then((data: any) => {
    if (data.content) {
      feature.properties.companyName = data.content.companyName
      feature.properties.projectName = data.content.projectName
      feature.properties.recorderName = data.content.recordName
      feature.properties.surveyorName = data.content.surveyName
      feature.properties.modeName = data.content.pullLineModelName
    }
  })

  var pJSON = {}
  for (var p in mappingTags) {
    var mappingTag = mappingTags[p]
    if (mappingTagValues != undefined && mappingTagValues[p] != undefined) {
      pJSON[mappingTag] = mappingTagValues[p][feature.properties[p]]
    } else {
      switch (p) {
        case 'voltage':
          let voltages = {
            无: '无',
            V220: '220V',
            V380: '380V',
            KV10: '10KV',
          }
          pJSON[mappingTag] = voltages[feature.properties['voltage']]
          break
        case 'company':
          pJSON[mappingTag] = feature.properties['companyName']
          break
        case 'project_id':
          pJSON[mappingTag] = feature.properties['projectName']
          break
        case 'recorder':
          pJSON[mappingTag] = feature.properties['recorderName']
          break

        case 'surveyor':
          if (layerType == 'design' || layerType == 'dismantle') mappingTag = '设计人员'
          pJSON[mappingTag] = feature.properties['surveyorName']
          break
        // case 'main_id':
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['main_id']),
        //     `pdd:${layerType}_tower`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       pJSON[mappingTag] = data.features[0].properties.code
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        //   break
        // case 'sub_id':
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['sub_id']),
        //     `pdd:${layerType}_tower`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       pJSON[mappingTag] = data.features[0].properties.code
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        // break
        // case 'start_id':
        //   let startItem = lineTowerType.find(
        //     (item) => item.key === feature.properties.start_node_type
        //   )
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['start_id']),
        //     `pdd:${layerType}_${startItem?.value}`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       pJSON[mappingTag] = data.features[0].properties.code
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        //   break
        // case 'end_id':
        //   let endItem = lineTowerType.find(
        //     (item) => item.key === feature.properties.end_node_type
        //   )
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['end_id']),
        //     `pdd:${layerType}_${endItem?.value}`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       pJSON[mappingTag] = data.features[0].properties.code
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        //   break
        // case 'parent_id':
        //   let parentLayer = 'tower'
        //   let parentName = feature.properties['parent_name']
        //   if (parentName?.startsWith('ElectricMeter')) {
        //     parentLayer = 'electric_meter'
        //   } else if (parentName?.startsWith('CableDevice')) {
        //     parentLayer = 'cable_equipment'
        //   }
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['parent_id']),
        //     `pdd:${layerType}_${parentLayer}`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       parentLayer === 'electric_meter'
        //         ? (pJSON[mappingTag] = data.features[0].properties.name)
        //         : (pJSON[mappingTag] = data.features[0].properties.code)
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        //   break
        // case 'parent_line_id':
        //   await loadLayer(
        //     getCustomXmlData('id', feature.properties['parent_id']),
        //     `pdd:${layerType}_line`
        //   ).then((data: any) => {
        //     if (data.features && data.features.length === 1) {
        //       pJSON[mappingTag] = data.features[0].properties.name
        //     } else {
        //       pJSON[mappingTag] = ''
        //     }
        //   })
        //   break
        case 'mode_id':
          pJSON[mappingTag] = feature.properties['modeName']
          break
        case 'survey_time':
          if (layerType !== 'design')
            pJSON[mappingTag] = feature.properties[p]
              ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.properties[p]))
              : null
          break
        case 'record_date':
          pJSON[mappingTag] = feature.properties[p]
            ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.properties[p]))
            : null
          break
        case 'length':
          if (feature.properties.length)
            pJSON[mappingTag] = Number(feature.properties.length).toFixed(2)
          else
            pJSON[mappingTag] = Number(feature.properties[p])
              ? Number(feature.properties[p]).toFixed(2)
              : 0
          break
        case 'azimuth':
          pJSON[mappingTag] = Number(feature.properties[p])
            ? Number(feature.properties[p])?.toFixed(2)
            : 0
          if (layerName === 'tower') {
            pJSON[mappingTag] = feature.properties[p]
          }
          break
        case 'capacity':
          if (feature.properties[p].indexOf('kVA') >= 0)
            pJSON[mappingTag] = feature.properties[p].substr(3) + 'kVA'
          break
        default:
          pJSON[mappingTag] = feature.properties[p]
          break
      }
    }
  }

  // 查看多媒体功能
  if (layerType === 'survey' || layerType === 'plan') {
    if (mediaLayers.indexOf(layerName) >= 0) {
      let params = {
        projectId: feature.properties.project_id,
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
    }
  }

  if (
    layerType === 'survey' ||
    layerType === 'plan' ||
    layerType === 'design' ||
    layerType === 'dismantle'
  ) {
    if (householdLayers.indexOf(layerName) >= 0) {
      let params = {
        type: layerType,
        projectId: feature.properties.project_id,
        deviceId: featureId,
        getProperties: feature.properties,
      }

      pJSON['入户线'] = { params }
    }
  }

  // 仅有设计图层和拆除图层可以查看相关的材料表
  if (layerType === 'design' || layerType === 'dismantle') {
    // 查看材料表
    if (materiaLayers.indexOf(layerName) >= 0) {
      const materialModifyList = await getDesignMaterialModifyList({
        deviceId: featureId,
        projectId: feature.properties.project_id,
        layerType: layerType,
        // deviceType: "string"
      })

      const objectID =
        layerName === 'electricMeter'
          ? feature.properties.entry_id
          : feature.properties.mode_id ||
            feature.properties.equip_model_id ||
            feature.properties.model_id

      if (!feature.properties.kv_level) {
        const sources = map ? map.getStyle().sources : []
        Object.keys(sources).forEach((item: any) => {
          if (item.includes(layerType + '_tower')) {
            const fs = sources[item].data.features.find(
              feature.properties.main_id === item.properties.id
            )
            if (fs) {
              feature.properties.kv_level = fs.properties.kv_level
            }
          }
        })
      }

      let voltagelevel = {
        无: 0,
        V220: 1,
        V380: 2,
        KV10: 3,
      }
      if (feature.properties.voltage)
        feature.set('kv_level', voltagelevel[feature.properties.voltage])

      pJSON['材料表'] = {
        params: {
          holeId: feature.properties.project_id,
          projectId: feature.properties.project_id,
          deviceId: featureId,
          type: layerType,
          rest: {
            objectID,
            forProject: 0,
            forDesign: 0,
            state: findenumsValue('SurveyState')[feature.properties.state],
            materialModifyList: materialModifyList?.content || [],
            layerName,
            kvLevel: Number.isInteger(feature.properties.kv_level)
              ? LevelEnmu[feature.properties.kv_level]
              : null,
          },
          getProperties: feature.properties,
        },
      }
    }
  }

  console.log(pJSON)
}
