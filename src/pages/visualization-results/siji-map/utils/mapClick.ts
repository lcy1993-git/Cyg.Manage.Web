import {
  getDesignMaterialModifyList,
  getGisDetail,
  getlibId_new,
  getMaterialItemData,
} from '@/services/visualization-results/visualization-results'
import { getTrackRecordDateArray } from '../../utils/methods'
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
const AdditionMaterialLayer = ['tower', 'cableHead']
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
const commentLayers = ['tower', 'cable', 'cableEquipment', 'mark', 'transformer']

export const mapClick = async (map: any, feature: any, pixel: any, ops: any) => {
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
              (value: any) => feature.properties.main_id === value.properties.id
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

  // 批注功能
  if (commentLayers.indexOf(layerName) >= 0) {
    pJSON['审阅'] = { id: feature.properties.project_id, feature }
  }
  //杆塔和电缆中间头显示附加材料表
  if (
    layerType == 'survey' ||
    layerType === 'plan' ||
    layerType === 'design' ||
    layerType === 'dismantle'
  ) {
    if (AdditionMaterialLayer.indexOf(layerName) >= 0) {
      let params = {
        type: layerType,
        projectId: feature.properties.project_id,
        deviceId: featureId,
        getProperties: feature.properties,
      }

      pJSON['附加材料表'] = { params }
    }
  }

  // 轨迹线不弹出侧边栏
  if (elementTypeEnum[layerName] === '轨迹线') {
    // map.getTargetElement().style.cursor = 'default'
    return
  }

  // 相应数据到右侧边栏
  const resData = []
  const propertiesData: any = []
  if (elementTypeEnum[layerName] !== '轨迹点') {
    resData.push({ propertyName: '所属图层', data: layerTypeEnum[layerType] + '图层' })
  }
  resData.push({
    propertyName: elementTypeEnum[layerName] === '水平拉线' ? '设备种类' : '元素类型',
    data: elementTypeEnum[layerName],
  })
  for (let p in pJSON) {
    if (p === '杆规格') {
      pJSON[p] = `${feature.properties.rod}*${feature.properties.height}`
    }
    if (p === '呼称高') {
      pJSON[p] = feature.properties.normimalheight
    }
    if (p === '导线相数') {
      pJSON[p] = feature.properties.kv_level === 2 ? '三相' : '两相'
    }
    if (p === '穿孔示意图') {
      let channelId = feature.properties.channel_id
      let f: any = null
      const sources = map ? map.getStyle().sources : []
      Object.keys(sources).forEach((item: any) => {
        if (item.includes(layerType + '_cableChannel')) {
          f = sources[item].data.features.find((value: any) => channelId === value.properties.id)
        }
      })

      pJSON[p] = {
        holeId: feature.properties.id,
        layerType: layerType === 'design' ? 1 : 2,
        title: f.values_.mode,
        layMode: f.values_.lay_mode,
        arrangement: f.values_.arrangement,
      }
    }

    if (p === '方向') {
      let azimuth = feature.properties.azimuth
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
      let fs: any = null
      const sources = map ? map.getStyle().sources : []
      Object.keys(sources).forEach((item: any) => {
        if (item.includes(layerType + 'userLine')) {
          fs = sources[item].data.features.find(
            (value: any) => value.properties.end_id === feature.properties.id
          )
        }
      })
      if (!fs) {
        // 无下户线下户的户表
        // 此处读取无下户线户表的材料表，从中读取‘下户线型号’和‘下户线长度’
        const objectID =
          layerName === 'electric_meter'
            ? feature.properties.entry_id
            : feature.properties.mode_id || feature.properties.equip_model_id
        const materialModifyList = await getDesignMaterialModifyList({
          deviceId: featureId,
          projectId: feature.properties.project_id,
          layerType: layerType,
          // deviceType: "string"
        })

        const materiaParams = {
          holeId: feature.properties.project_id,
          rest: {
            objectID,
            forProject: 0,
            forDesign: 0,
            state: findenumsValue('SurveyState')[feature.properties.state],
            kvLevel: Number.isInteger(feature.properties.kv_level)
              ? LevelEnmu[feature.properties.kv_level]
              : null,
            materialModifyList: materialModifyList?.content || [],
            layerName,
          },
          getProperties: feature.properties,
        }
        let libIdData = await getlibId_new({ projectId: materiaParams?.getProperties.project_id })

        if (libIdData.isSuccess) {
          const resourceLibID = libIdData?.content

          let materialItemData = await getMaterialItemData({
            resourceLibID,
            ...materiaParams.rest,
            layerName: 'electric_meter',
          })
          if (materialItemData.isSuccess) {
            const materialId = feature.properties.material_id
            const currentItem = materialItemData?.content?.find((item: any) => {
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
      evt: pixel,
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

  // chooseCurDayTrack('')

  // if(!setRightSidebarVisiviabelFlag) {
  ops.setRightSidebarVisiviabel(false)
  ops.setSurveyModalVisible(false)
  // }
  // loadMediaSign(map)
}
