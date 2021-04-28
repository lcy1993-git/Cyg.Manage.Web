import getMappingTagsDictionary from './localData/mappingTagsDictionary';
import { pointStyle, line_style } from './localData/pointStyle';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import { transform } from "ol/proj";
import { getScale, clearHighlightLayer, getLayerByName } from "./methods";
import { getGisDetail, getlibId, getMedium, getMaterialItemData } from '@/services/visualization-results/visualization-results';
import { format } from './utils'

const mappingTagsDictionary: any = getMappingTagsDictionary();

// 格式化输出时间
// const format = (fmt: string, date: Date) => { //author: meizz 
//     var o = {
//         "M+": date.getMonth() + 1, //月份 
//         "d+": date.getDate(), //日 
//         "h+": date.getHours(), //小时 
//         "m+": date.getMinutes(), //分 
//         "s+": date.getSeconds(), //秒 
//         "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
//         "S": date.getMilliseconds() //毫秒 
//     };
//     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (var k in o)
//         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }

const mediaLayers = ['tower', 'cable', 'cable_channel', 'transformer', 'cable_equipment', 'mark', 'electric_meter'];
const materiaLayers = ['tower', 'cable', 'transformer', 'cable_equipment', 'pull_line'];
const commentLayers = ['tower', 'cable', 'cable_channel', 'transformer', 'cable_equipment', 'mark'];
export const mapClick = (evt: any, map: any, ops: any) => {
    clearHighlightLayer(map);
    ops.setRightSidebarVisiviabel(false);
    let mappingTags, mappingTagValues;
    let selected = false;

    // 遍历选中的数据
    map.forEachFeatureAtPixel(evt.pixel, async function (feature: any, layer: any) {
        if (selected)
            return;
        selected = true;

        if (layer.getProperties().name == 'highlightLayer') {
            clearHighlightLayer(map);
            return;
        }

        // 判断选中的图层类型
        let layerType = layer.getProperties().name.split('_')[0];
        if (layerType) {
            switch (layerType) {
                case 'survey':
                    feature.set('layerType', 1);
                    break;
                case 'plan':
                    feature.set('layerType', 2);
                    break;
                case 'design':
                    feature.set('layerType', 3);
                    break;
                case 'dismantle':
                    feature.set('layerType', 4);
                    break;
                default:
                    feature.set('layerType', null)
            }
        } else {
            feature.set('layerType', null)
        }

        let layerName = layer.getProperties().name;
        layerName = layerName.substring(layerName.split('_')[0].length + 1, layerName.length);
        // 映射图层相对应的字段
        mappingTags = mappingTagsDictionary[layerName.toLocaleLowerCase()].mappingTags;
        mappingTagValues = mappingTagsDictionary[layerName.toLocaleLowerCase()].mappingTagValues;

        let featureId = feature.getProperties().id;
        if (!featureId)
            featureId = feature.getId().split('.')[1];
        // 有些想要展示的字段需要通过接口进行查询
        let parmas = {
            'companyId': feature.getProperties().company === undefined ? null : feature.getProperties().company,
            'projectId': feature.getProperties().project_id === undefined ? null : feature.getProperties().project_id,
            'recordId': feature.getProperties().recorder === undefined ? null : feature.getProperties().recorder,
            'surveyId': feature.getProperties().surveyor === undefined ? null : feature.getProperties().surveyor,
            'mainId': feature.getProperties().main_id === undefined ? null : feature.getProperties().main_id,
            'pullLineId': featureId
        }
        await getGisDetail(parmas).then((data: any) => {
            if (data.content) {
                feature.set('companyName', data.content.companyName)
                feature.set('projectName', data.content.projectName)
                feature.set('recorderName', data.content.recordName)
                feature.set('surveyorName', data.content.surveyName)
                feature.set('mainName', data.content.mainName)
                feature.set('modeName', data.content.pullLineModelName)
            }
        })

        var pJSON = {};
        // 遍历属性，进行一一匹配
        for (var p in feature.getProperties()) {
            if (mappingTags != undefined && mappingTags[p] != undefined) {
                var mappingTag = mappingTags[p];
                if (mappingTagValues != undefined && mappingTagValues[p] != undefined) {
                    pJSON[mappingTag] = mappingTagValues[p][feature.getProperties()[p]];
                } else {
                    switch (p) {
                        case 'company':
                            pJSON[mappingTag] = feature.getProperties()['companyName'];
                            break;
                        case 'project_id':
                            pJSON[mappingTag] = feature.getProperties()['projectName'];
                            break;
                        case 'recorder':
                            pJSON[mappingTag] = feature.getProperties()['recorderName'];
                            break;
                        case 'surveyor':
                            pJSON[mappingTag] = feature.getProperties()['surveyorName'];
                            break;
                        case 'main_id':
                            pJSON[mappingTag] = feature.getProperties()['mainName'];
                            break;
                        case 'mode_id':
                            pJSON[mappingTag] = feature.getProperties()['modeName'];
                            break;
                        case 'survey_time':
                            if (layer.getProperties().name.split('_')[0] !== 'design')
                                pJSON[mappingTag] = feature.getProperties()[p] ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p])) : null;
                            break;
                        case 'record_date':
                            pJSON[mappingTag] = feature.getProperties()[p] ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p])) : null;
                            break;
                        case 'azimuth':
                            pJSON[mappingTag] = feature.getProperties()[p] ? feature.getProperties()[p]?.toFixed(2) : 0;
                            break;
                        default:
                            pJSON[mappingTag] = feature.getProperties()[p];
                            break;
                    }
                }
            }
        }

        // 查看多媒体功能
        if (mediaLayers.indexOf(layerName) >= 0) {
            let params = {
                projectId: feature.getProperties().project_id,
                devices: [{
                    category: 1, // 1为勘察，2为预设
                    deviceId: featureId
                }
                ]
            }
            if (layerType) {
                switch (layerType) {
                    case 'survey':
                        params.devices[0].category = 1;
                        break;
                    case 'plan':
                        params.devices[0].category = 4;
                        break;
                    case 'design':
                        params.devices[0].category = 2;
                        break;
                    case 'dismantle':
                        params.devices[0].category = 3;
                        break;
                }
            }
            await getMedium(params).then((data: any) => {
                pJSON['多媒体'] = data.content || []
            })
        }
        // 仅有设计图层和拆除图层可以查看相关的材料表
        if (layerType === 'design' || layerType === 'dismantle') {
            // 查看材料表
            if (materiaLayers.indexOf(layerName) >= 0) {
                await getlibId({ id: feature.getProperties().project_id }).then(async (data: any) => {
                    const resourceLibID = data.content.libId
                    const objectID = feature.getProperties().mode_id || feature.getProperties().equip_model_id;
                    const materialParams: any = {
                        objectID,
                        resourceLibID,
                        forProject: 0,
                        forDesign: 0,
                        materialModifyList: []
                    }
                    materialParams.layerName = layerName;
                    await getMaterialItemData(materialParams).then((res: any) => {
                        pJSON['材料表'] = [];
                        if (res.isSuccess) {
                            const filterData = res.content.filter((item: any) => item.parentID !== -1)
                            const data = filterData.map((item: any) => {
                                return {
                                    ...item,
                                    state: feature.getProperties().state,
                                    children: []
                                }
                            })
                            const handlerData = data.reduce((curr: any, item: any) => {
                                const exist = curr.find((currItem: any) => currItem.type === item.type)
                                if (exist) {
                                    curr.forEach((currExist: any, index: any) => {
                                        if (currExist.type === exist.type) {
                                            curr[index].children.push(item)
                                        }
                                    })
                                } else {
                                    curr.push(item)
                                }
                                return curr
                            }, [])
                            pJSON['材料表'] = handlerData;
                        }
                    })
                })
            }
        }

        // 批注功能
        if (commentLayers.indexOf(layerName) >= 0) {
            pJSON['批注'] = { id: feature.getProperties().project_id };
        }

        // 相应数据到右侧边栏
        const resData = [];
        for (let p in pJSON) {
          resData.push({ propertyName: p, data: pJSON[p] || "" })
        }
        ops.setRightSidebarVisiviabel(true);
        ops.setRightSidebarData(resData);

        // 地物图层不需要高亮
        if (layer.getProperties().name.indexOf('mark') > -1)
            return;

        // 轨迹图层也无高亮
        if (layer.getProperties().name.indexOf('Track') > -1)
            return;

        let highlightLayer = getLayerByName('highlightLayer', map.getLayers().getArray())
        // 高亮显示
        if (!highlightLayer) {
            var source = new VectorSource();
            highlightLayer = new Vector({
                source,
                zIndex: 99
            });
            highlightLayer.set('name', 'highlightLayer')
            map.addLayer(highlightLayer);
        }
        let highlightFeatures = [];
        if (layerName == 'line' || layerName == 'user_line') {
            let layerTypeValue = feature.getProperties().layerType;
            if (feature.getProperties().polyline_id) {
                map.getLayers().getArray().forEach(function (value: any) {
                    if (typeof (value.getLayers) === 'function') {
                        value.getLayers().getArray().forEach(function (v: any) {
                            let layerName_ = v.getProperties().name;
                            let layerType_ = layerName_.split('_')[0];
                            layerName_ = layerName_.substring(layerName_.split('_')[0].length + 1, layerName_.length);
                            if ((layerType_ == layerType) && (layerName_ == layerName || layerName_ == 'subline')) {
                                v.getSource().getFeatures().forEach(function (f: any) {
                                    if (f.getProperties().polyline_id == feature.getProperties().polyline_id) {
                                        f.set('layerType', layerTypeValue);
                                        highlightFeatures.push(f);
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                highlightFeatures.push(feature);
            }

        } else {
            highlightFeatures.push(feature);
        }
        highlightFeatures.forEach(function (feature_) {
            // 判断类型(点线面)
            let featureClone = feature_.clone();
            let type = featureClone.getGeometry().getType().toLocaleLowerCase();
            let highlightStyle;
            if (type.indexOf('point') >= 0) {
                highlightStyle = pointStyle(layer.getProperties().name, featureClone, true);
            } else {
                highlightStyle = line_style(featureClone, true, layerType);
            }

            featureClone.setStyle(highlightStyle);
            highlightLayer.getSource().addFeature(featureClone);
        })
        highlightLayer.setVisible(true);
    });

}

// 当前经纬度映射到HTML节点
export const mapPointermove = (evt: any, map: any) => {
    let coordinate = evt.coordinate;
    let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    const x = document.getElementById("currentPositionX");
    const y = document.getElementById("currentPositionY");
    if( x !== null) x.innerHTML = lont[0].toFixed(4);
    if( y !== null) y.innerHTML = lont[0].toFixed(4);
}

// 当前比例尺映射到HTML节点
export const mapMoveend = (evt: any, map: any) => {
    const scaleSize: HTMLSpanElement = document.getElementById("currentScaleSize") as HTMLSpanElement;
    if(scaleSize !== null) scaleSize.innerHTML = getScale(map) || "";
}