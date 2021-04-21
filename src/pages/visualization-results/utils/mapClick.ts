import getMappingTagsDictionary from './mappingTagsDictionary';
import { clearHighlightLayer } from './methods';
import { pointStyle, line_style } from './pointStyle';
import { transform } from "ol/proj";
import { getScale } from "./refreshMap";

const mappingTagsDictionary: any = getMappingTagsDictionary()

export const mapClick = (evt: any, map: any, ops: any) => {
    let highlightLayer: any = undefined;
    // const { highlightLayer } = ops;
    clearHighlightLayer();
    let mappingTags, mappingTagValues;
    let selected = false;

    // 遍历选中的数据
    map.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) {
        if (selected)
            return;
        selected = true;

        if (layer.getProperties().name == 'highlightLayer') {
            clearHighlightLayer();
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

        // 弹出右侧属性框
        $('.container__right--attr__detail ul').css({
            height: 'calc(100vh - 46px)'
        });
        $('#selectedFeatureLayers').css({
            height: '0px'
        });

        // 有些想要展示的字段需要通过接口进行查询
        let parmas = {
            'companyId': feature.getProperties().company === undefined ? null : feature.getProperties().company,
            'projectId': feature.getProperties().project_id === undefined ? null : feature.getProperties().project_id,
            'recordId': feature.getProperties().recorder === undefined ? null : feature.getProperties().recorder,
            'surveyId': feature.getProperties().surveyor === undefined ? null : feature.getProperties().surveyor,
            'mainId': feature.getProperties().main_id === undefined ? null : feature.getProperties().main_id,
            'pullLineId': feature.getId().split('.')[1]
        }
        $.ajax({
            headers: {
                Authorization: AuthorizationToken
            },
            url: `http://${webConfig.publicServiceServerIP}${webConfig.publicServiceServerPort}/api/System/GetGisDetail`,
            type: 'POST',
            async: false,
            data: JSON.stringify(parmas),
            contentType: 'application/json;charset=utf-8;',
            dataType: 'json',
            success: function (data) {
                if (data.content) {
                    feature.set('companyName', data.content.companyName)
                    feature.set('projectName', data.content.projectName)
                    feature.set('recorderName', data.content.recordName)
                    feature.set('surveyorName', data.content.surveyName)
                    feature.set('mainName', data.content.mainName)
                    feature.set('modeName', data.content.pullLineModelName)
                }
            }
        })

        var pJSON = {};
        if (feature.get('length'))
            feature.set('length', Number.parseFloat(feature.get('length')).toFixed(2));
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
                                pJSON[mappingTag] = feature.getProperties()[p] != null ? new Date(feature.getProperties()[p]).Format('yyyy-MM-dd hh:mm:ss') : null;
                            break;
                        case 'record_date':
                            pJSON[mappingTag] = feature.getProperties()[p] != null ? new Date(feature.getProperties()[p]).Format('yyyy-MM-dd hh:mm:ss') : null;
                            break;
                        default:
                            pJSON[mappingTag] = feature.getProperties()[p];
                            break;
                    }
                }
            }
        }

        var featureProperties = $('#featureProperties')[0];
        featureProperties.innerHTML = '';
        for (var p in pJSON)
            featureProperties.innerHTML = featureProperties.innerHTML + `<li><span>${p}</span><span>${pJSON[p] || ''}</span></li>`;
        // 查看多媒体功能
        if (layerName == 'tower' || layerName == 'cable' || layerName == 'cable_channel' || layerName == 'transformer' || layerName == 'cable_equipment' || layerName == 'mark') {
            featureProperties.innerHTML += '<li><span>多媒体</span><a id="lookMultimedia" href="javascript:void(0);">查看</a></li>';

            let deviceId = feature.getProperties().id;
            if (!deviceId)
                deviceId = feature.getId().split('.')[1];
            const params = {
                projectId: feature.getProperties().project_id,
                devices: [{
                    category: 2, // 1为勘察，2为预设
                    deviceId: deviceId
                },
                {
                    category: 1, // 1为勘察，2为预设
                    deviceId: deviceId
                },
                {
                    category: 3, // 1为勘察，2为预设
                    deviceId: deviceId
                }
                ]
            }
            $('#lookMultimedia').css({
                color: 'gray',
                cursor: 'default'
            }).text('暂无数据')
            getMedium(params).then(data => {
                if (data.code === 200) {
                    if (data.content.length > 0) {
                        const mediasData = data.content || []
                        const path = duplicateRemoval(mediasData)
                        const html = template('medias', {
                            path
                        })
                        const el = document.querySelector('#mediasContainer');
                        el.innerHTML = html;
                        $('#lookMultimedia').css({
                            color: '#4791F1',
                            cursor: 'pointer'
                        }).text('查看')
                        $('#lookMultimedia').click(function () {
                            $('.media-modal').show()
                        })
                        const imgPath = path.map(item => {
                            return {
                                id: item.id,
                                type: item.type,
                                path: `http://${webConfig.fileStorageServiceServerIP}${webConfig.fileStorageServiceServerPort}/api/Download/GetFileById?fileId=${item.filePath}&securityKey=1201332565548359680&token=${AuthorizationToken}`
                            }
                        })
                        window.sessionStorage.setItem('imgPath', JSON.stringify(imgPath))

                    }
                }
            })
        }

        // 仅有设计图层和拆除图层可以查看相关的材料表
        if (layerType == 'design' || layerType == 'dismantle') {
            // 查看材料表功能
            if (layerName == 'tower' || layerName == 'cable' /*|| layerName == 'cable_channel'*/ || layerName == 'transformer' || layerName == 'cable_equipment' || layerName == 'pull_line') {
                featureProperties.innerHTML += '<li><span>材料表</span><a id="material" href="javascript:void(0);">查看</a></li>';
                getlibId({
                    id: feature.getProperties().project_id.split("_")[0]
                }).then(res => {
                    const resourceLibID = res.libId
                    const objectID = feature.getProperties().mode_id || feature.getProperties().equip_model_id;
                    const materialParams = {
                        objectID,
                        resourceLibID,
                        forProject: 0,
                        forDesign: 0,
                        materialModifyList: []
                    }
                    $('#material').css({
                        color: 'gray',
                        cursor: 'default'
                    }).text('暂无数据');
                    materialParams.layerName = layerName;
                    getMaterialItemData(materialParams).then(res => {
                        if (res.isSuccess) {
                            if (res.content.length > 0) {
                                const enumsData = localStorage.getItem('loadEnumsData')
                                if (enumsData) {
                                    const enums = JSON.parse(enumsData)
                                    const surveyState = enums.filter(item => item.key === 'SurveyState')[0]
                                    const filterData = res.content.filter(item => item.parentID !== -1)
                                    const data = filterData.map(item => {
                                        return {
                                            ...item,
                                            state: feature.getProperties().state,
                                            children: []
                                        }
                                    })
                                    const handlerData = data.reduce((curr, item) => {
                                        const exist = curr.find(currItem => currItem.type === item.type)
                                        if (exist) {
                                            curr.forEach((currExist, index) => {
                                                if (currExist.type === exist.type) {
                                                    curr[index].children.push(item)
                                                }
                                            })
                                        } else {
                                            curr.push(item)
                                        }
                                        return curr
                                    }, [])
                                    const tableData = {
                                        data: handlerData,
                                        totals: handlerData.length
                                    }
                                    $('#material').css({
                                        color: '#4791F1',
                                        cursor: 'pointer'
                                    }).text('查看');
                                    $('#material').click(function () {
                                        $('.media-modal').hide()
                                        $('.material').show()
                                        gridTableInit(tableData, surveyState.value)
                                    })

                                } else {
                                    $('.error').text('网络异常！！！请重新加载。。。').animate({
                                        top: '30px',
                                        opacity: 1
                                    }, 2000, function () {
                                        setTimeout(() => {
                                            $(this).animate({
                                                top: '-200px',
                                                opacity: 0
                                            }, 0)
                                        }, 1000)
                                    });
                                    return;
                                }
                            } else {
                                // gridTableInit({ data: [], totals: 0 }, [])
                            }
                        } else {
                            // gridTableInit({ data: [], totals: 0 }, [])
                        }
                    })
                })
            }
        }

        // 批注功能
        if (layerName == 'tower' || layerName == 'cable' || layerName == 'cable_channel' || layerName == 'transformer' || layerName == 'cable_equipment' || layerName == 'mark') {
            featureProperties.innerHTML += '<li><span>批注</span><a id="createTips" href="javascript:void(0);">创建批注</a></li>';
            // 创建批注
            $('#createTips').click(function () {
                let falg = true;
                for (let p of projects) {
                    if (p.id == feature.getProperties().project_id && p.executor && p.executor == 'true') {
                        $('.textarea').show();
                        $('.close-textarea').click(function () {
                            // console.log('关闭')
                            $('.textarea').hide()
                        })
                        falg = false;
                    }
                }
                if (falg) {
                    $('.error').text('没有创建批注权限').animate({
                        top: '30px',
                        opacity: 1
                    }, 2000, function () {
                        setTimeout(() => {
                            $(this).animate({
                                top: '-200px',
                                opacity: 0
                            }, 0)
                        }, 1000)
                    })
                }
            })
            $('.submit-textarea').off("click").on('click', function () {
                const params = {
                    projectId: feature.getProperties().project_id,
                    content: $('#textarea').attr('value')
                }
                getMessage(params).then(data => {
                    if (data.code === 200) {
                        $('.textarea').hide()
                        $('.error').text('创建成功').animate({
                            top: '30px',
                            opacity: 1
                        }, 2000, function () {
                            setTimeout(() => {
                                $(this).animate({
                                    top: '-200px',
                                    opacity: 0
                                }, 0)
                            }, 1000)
                        })
                    }
                })
            })
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

        // 高亮显示
        if (!highlightLayer) {
            var source = new ol.source.Vector();
            highlightLayer = new ol.layer.Vector({
                name: 'highlightLayer',
                source,
                // declutter: true,
                zIndex: 99
            });
            map.addLayer(highlightLayer);
        } else {
            highlightLayer.getSource().clear();
        }
        let highlightFeatures = [];
        if (layerName == 'line' || layerName == 'user_line') {
            if (feature.getProperties().polyline_id) {
                map.getLayers().getArray().forEach(function (value) {
                    if (typeof (value.getLayers) === 'function') {
                        value.getLayers().getArray().forEach(function (v) {
                            let layerName_ = v.getProperties().name;
                            let layerType_ = layerName_.split('_')[0];
                            layerName_ = layerName_.substring(layerName_.split('_')[0].length + 1, layerName_.length);
                            if ((layerType_ == layerType) && (layerName_ == layerName || layerName_ == 'subline')) {
                                v.getSource().getFeatures().forEach(function (f) {
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

export const mapPointermove = (evt: any, map: any) => {
    let coordinate = evt.coordinate;
    let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    const x = document.getElementById("currentPositionX");
    const y = document.getElementById("currentPositionY");
    x && (x.innerHTML = lont[0].toFixed(4));
    y && (y.innerHTML = lont[1].toFixed(4));
    // setCurrentPosition([lont[0].toFixed(4), lont[1].toFixed(4)]);
}

export const mapMoveend = (evt: any, map: any) =>{
    const scaleSize: HTMLSpanElement = document.getElementById("currentScaleSize") as HTMLSpanElement;
    scaleSize.innerHTML = getScale(map) || "";
    // setScaleSize(getScale(map));
}