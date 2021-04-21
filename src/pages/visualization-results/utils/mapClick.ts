import getMappingTagsDictionary from './mappingTagsDictionary';
import { pointStyle, line_style } from './pointStyle';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import { transform } from "ol/proj";
import { getScale, clearHighlightLayer, getLayerByName } from "./refreshMap";
import { getGisDetail } from '@/services/visualization-results/visualization-results';

const mappingTagsDictionary: any = getMappingTagsDictionary();

// 格式化输出时间
const format = (fmt: string, date: Date) => { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const mapClick = (evt: any, map: any) => {
    clearHighlightLayer(map);
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
        switch (layerName) {
            case 'cable_channel':
                mappingTags = mappingTagsDictionary.cable_channel.mappingTags;
                mappingTagValues = mappingTagsDictionary.cable_channel.mappingTagValues;
                break;

            case 'cable':
                mappingTags = mappingTagsDictionary.cable.mappingTags;
                mappingTagValues = mappingTagsDictionary.cable.mappingTagValues;
                break;

            case 'tower':
                mappingTags = mappingTagsDictionary.tower.mappingTags;
                mappingTagValues = mappingTagsDictionary.tower.mappingTagValues;
                break;

            case 'transformer':
                mappingTags = mappingTagsDictionary.transformer.mappingTags;
                mappingTagValues = mappingTagsDictionary.transformer.mappingTagValues;
                break;

            case 'cable_equipment':
                mappingTags = mappingTagsDictionary.cable_equipment.mappingTags;
                mappingTagValues = mappingTagsDictionary.cable_equipment.mappingTagValues;
                break;

            case 'line':
            case 'user_line':
                mappingTags = mappingTagsDictionary.line.mappingTags;
                mappingTagValues = mappingTagsDictionary.line.mappingTagValues;
                break;

            case 'pull_line':
                mappingTags = mappingTagsDictionary.pull_line.mappingTags;
                mappingTagValues = mappingTagsDictionary.pull_line.mappingTagValues;
                break;

            case 'Track':
                mappingTags = mappingTagsDictionary.track.mappingTags;
                mappingTagValues = mappingTagsDictionary.track.mappingTagValues;
                break;

            case 'mark':
                mappingTags = mappingTagsDictionary.mark.mappingTags;
                mappingTagValues = mappingTagsDictionary.mark.mappingTagValues;
                break;
            case 'electric_meter':
                mappingTags = mappingTagsDictionary.electric_meter.mappingTags;
                mappingTagValues = mappingTagsDictionary.electric_meter.mappingTagValues;
                break;
            case 'cross_arm':
                mappingTags = mappingTagsDictionary.cross_arm.mappingTags;
                mappingTagValues = mappingTagsDictionary.cross_arm.mappingTagValues;
                break;
            case 'over_head_device':
                mappingTags = mappingTagsDictionary.over_head_device.mappingTags;
                mappingTagValues = mappingTagsDictionary.over_head_device.mappingTagValues;
                break;
            default:
                return;
        }

        // 有些想要展示的字段需要通过接口进行查询
        let parmas = {
            'companyId': feature.getProperties().company === undefined ? null : feature.getProperties().company,
            'projectId': feature.getProperties().project_id === undefined ? null : feature.getProperties().project_id,
            'recordId': feature.getProperties().recorder === undefined ? null : feature.getProperties().recorder,
            'surveyId': feature.getProperties().surveyor === undefined ? null : feature.getProperties().surveyor,
            'mainId': feature.getProperties().main_id === undefined ? null : feature.getProperties().main_id,
            'pullLineId': feature.getId().split('.')[1]
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
                                pJSON[mappingTag] = feature.getProperties()[p] != null ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p])) : null;
                            break;
                        case 'record_date':
                            pJSON[mappingTag] = feature.getProperties()[p] != null ? format('yyyy-MM-dd hh:mm:ss', new Date(feature.getProperties()[p])) : null;
                            break;
                        default:
                            pJSON[mappingTag] = feature.getProperties()[p];
                            break;
                    }
                }
            }
        }
        for (var p in pJSON){
            console.log(p + ' : ' + pJSON[p])
        }
        /**
         * not-resolve 这里应该是需要操作视图
         */
        // showPropertyPanel();

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

export const mapPointermove = (evt: any, map: any, setCurrentPosition: any) => {
    let coordinate = evt.coordinate;
    let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

    setCurrentPosition([lont[0].toFixed(4), lont[1].toFixed(4)]);
}

export const mapMoveend = (evt: any, map: any, setScaleSize: any) => {
    setScaleSize(getScale(map));
}