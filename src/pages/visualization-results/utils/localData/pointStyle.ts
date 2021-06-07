import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import ClassStyle from 'ol/style/Style';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape';
import Circle from 'ol/style/Circle';
import { Color } from 'ol/color';
import { ColorLike } from 'ol/colorlike';
import Icon from 'ol/style/Icon';

import Styles from './Styles';
import '@/assets/icon/webgisIconFont.css';
import markImageSrc1 from "@/assets/image/webgis/img_地物_道路.png";
import markImageSrc2 from "@/assets/image/webgis/img_地物_河流.png";
import markImageSrc3 from "@/assets/image/webgis/img_地物_湖塘.png";
import markImageSrc4 from "@/assets/image/webgis/img_地物_房屋.png";
import markImageSrc5 from "@/assets/image/webgis/img_地物_房屋.png";
import markImageSrc6 from "@/assets/image/webgis/img_地物_电力线.png";
import markImageSrc7 from "@/assets/image/webgis/img_地物_通讯线.png";
import markImageSrc8 from "@/assets/image/webgis/img_地物_其他.png";
import { Feature } from 'ol';

export interface Options {
    color?: Color | ColorLike;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    lineDash?: number[];
    lineDashOffset?: number;
    miterLimit?: number;
    width?: number;
}

// 点样式
const pointStyle = function (type: string, feature: Feature, selected: any) {
    let iconFont = 'webgisIconFont';
    let iconFontText;

    let size, fillSize, strokeSize, color, fillColor, strokeColor;
    let imageStyle, style, regular;
    let backgroundColor: string | undefined = undefined;
    let azimuth = feature.getProperties().azimuth || 0;
    let isDismantle;

    if(type.indexOf('mark') >= 0){
        style = mark_style(feature);
        if (selected) {
            imageStyle = new Circle({
                radius: 17,
                stroke: new Stroke({
                    color: 'rgba(249, 149, 52, 1)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(249, 149, 52, 1)'
                })
            })
            style = [new ClassStyle({
                image: imageStyle,
            }), style]
        }
        return style;
    }
    if (type == 'design_pull_line') {
        size = 26;
        let textFillColor = '#366871';
        if (selected) {
            size = 28;
            textFillColor = 'rgba(249, 149, 52, 1)';
        }
        style = new ClassStyle({
            text: new Text({
                font: 'Normal ' + size + 'px ' + iconFont,
                text: '\ue884',
                rotation: (feature.getProperties().azimuth + 90) * (Math.PI / 180) * -1,
                offsetY: 13,
                fill: new Fill({
                    color: textFillColor
                }),
                stroke: new Stroke({
                    color: 'rgba(255,255,255,0.5)'
                })
            })
        });
        return style;
    }

    if (type.indexOf('cable_head') >= 0) {
        let text, size, color;
        if (feature.getProperties().type == '电缆终端') {
            text = '\ue88b';
            size = '18'
        } else {
            text = '\ue889';
            size = '25'
        }

        if (feature.getProperties().kv_level == 1)
            color = 'rgba(145, 145, 255, 1)';
        else if (feature.getProperties().kv_level == 2)
            color = 'rgba(158, 227, 24, 1)';
        else if (feature.getProperties().kv_level == 3)
            color = 'rgba(0, 255, 216, 1)';
        else if (feature.getProperties().kv_level == 4)
            color = 'rgba(255, 175, 110, 1)';
        else
            color = 'red';
        style = new ClassStyle({
            text: new Text({
                font: 'Normal ' + size + 'px webgisIconFont',
                text,
                fill: new Fill({
                    color
                }),
                rotation: (feature.getProperties().azimuth) * (Math.PI / 180) * -1
            })
        })
        return style;
    }

    let value = type.substring(type.split('_')[0].length + 1, type.length);
    size = Styles[value].size;
    backgroundColor = Styles[value].backgroundColor;
    fillSize = Styles[value].fillSize;
    strokeSize = Styles[value].strokeSize;
    color = Styles[value].color;
    fillColor = Styles[value].fillColor;
    strokeColor = Styles[value].strokeColor;

    if (value == 'tower') { // 杆塔样式
        switch (feature.getProperties().symbol_id.toString()) {
            case '0':
                iconFontText = '\ue823';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
                break;
            case '111':
                iconFontText = '\ue86d';
                break;
            case '112':
                iconFontText = '\ue871';
                break;
            case '113':
                iconFontText = '\ue869';
                break;
            case '114':
                iconFontText = '\ue870';
                break;
            case '115':
                iconFontText = '\ue863';
                break;

            case '121':
                iconFontText = '\ue84f';
                break;
            case '122':
                iconFontText = '\ue85b';
                break;
            case '123':
                iconFontText = '\ue849';
                break;
            case '124':
                iconFontText = '\ue85a';
                break;
            case '125':
                iconFontText = '\ue84a';
                break;

            case '131':
                iconFontText = '\ue845';
                break;
            case '132':
                iconFontText = '\ue844';
                break;
            case '133':
                iconFontText = '\ue855';
                break;
            case '134':
                iconFontText = '\ue837';
                break;
            case '135':
                iconFontText = '\ue82a';
                break;

            case '141':
                iconFontText = '\ue86d';
                isDismantle = true;
                break;
            case '142':
                iconFontText = '\ue871';
                isDismantle = true;
                break;
            case '143':
                iconFontText = '\ue869';
                isDismantle = true;
                break;
            case '144':
                iconFontText = '\ue870';
                isDismantle = true;
                break;
            case '145':
                iconFontText = '\ue863';
                isDismantle = true;
                break;
            default:
                iconFontText = '\ue823';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'transformer') { // 变压器样式
        switch (feature.getProperties().symbol_id.toString()) {
            case '11':
                iconFontText = '\ue843';
                break;
            case '12':
                iconFontText = '\ue864';
                break;
            case '13':
                iconFontText = '\ue834';
                break;
            case '14':
                iconFontText = '\ue843';
                isDismantle = true;
                break;
            default:
                iconFontText = '\ue83c';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'cable') { // 电缆井样式
        switch (feature.getProperties().symbol_id.toString()) {
            case '111':
                iconFontText = '\ue876';
                break;
            case '112':
                iconFontText = '\ue875';
                break;
            case '113':
                iconFontText = '\ue85e';
                break;
            case '114':
                iconFontText = '\ue86f';
                break;

            case '121':
                iconFontText = '\ue861';
                break;
            case '122':
                iconFontText = '\ue86a';
                break;
            case '123':
                iconFontText = '\ue840';
                break;
            case '124':
                iconFontText = '\ue857';
                break;

            case '131':
                iconFontText = '\ue838';
                break;
            case '132':
                iconFontText = '\ue847';
                break;
            case '133':
                iconFontText = '\ue82e';
                break;
            case '134':
                iconFontText = '\ue83e';
                break;

            case '141':
                iconFontText = '\ue876';
                isDismantle = true;
                break;
            case '142':
                iconFontText = '\ue875';
                isDismantle = true;
                break;
            case '143':
                iconFontText = '\ue85e';
                isDismantle = true;
                break;
            case '144':
                iconFontText = '\ue86f';
                isDismantle = true;
                break;
            default:
                iconFontText = '\ue826';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'cable_equipment') { // 电力设备样式
        switch (feature.getProperties().symbol_id.toString()) {
            case '111':
                iconFontText = '\ue866';
                break;
            case '112':
                iconFontText = '\ue851';
                break;
            case '113':
                iconFontText = '\ue839';
                break;
            case '114':
                iconFontText = '\ue866';
                isDismantle = true;
                break;

            case '121':
                iconFontText = '\ue86e';
                break;
            case '122':
                iconFontText = '\ue852';
                break;
            case '123':
                iconFontText = '\ue831';
                break;
            case '124':
                iconFontText = '\ue86e';
                isDismantle = true;
                break;

            case '131':
                iconFontText = '\ue873';
                break;
            case '132':
                iconFontText = '\ue85f';
                break;
            case '133':
                iconFontText = '\ue83f';
                break;
            case '134':
                iconFontText = '\ue873';
                isDismantle = true;
                break;

            case '141':
                iconFontText = '\ue867';
                break;
            case '142':
                iconFontText = '\ue858';
                break;
            case '143':
                iconFontText = '\ue832';
                break;
            case '144':
                iconFontText = '\ue867';
                isDismantle = true;
                break;

            case '151':
                iconFontText = '\ue860';
                break;
            case '152':
                iconFontText = '\ue848';
                break;
            case '153':
                iconFontText = '\ue82f';
                break;
            case '154':
                iconFontText = '\ue860';
                isDismantle = true;
                break;

            case '161':
                iconFontText = '\ue865';
                break;
            case '162':
                iconFontText = '\ue842';
                break;
            case '163':
                iconFontText = '\ue829';
                break;
            case '164':
                iconFontText = '\ue865';
                isDismantle = true;
                break;

            case '171':
                iconFontText = '\ue86b';
                break;
            case '172':
                iconFontText = '\ue853';
                break;
            case '173':
                iconFontText = '\ue835';
                break;
            case '174':
                iconFontText = '\ue86b';
                isDismantle = true;
                break;

            case '181':
                iconFontText = '\ue868';
                break;
            case '182':
                iconFontText = '\ue84d';
                break;
            case '183':
                iconFontText = '\ue836';
                break;
            case '184':
                iconFontText = '\ue868';
                isDismantle = true;
                break;

            default:
                iconFontText = '\ue825';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'electric_meter') { // 户表
        if (feature.getProperties().type == 1) { // 单相表箱
            if (feature.getProperties().state == 1) // 原有
                iconFontText = '\ue878';
            else if (feature.getProperties().state == 2) // 新建
                iconFontText = '\ue850';
            else if (feature.getProperties().state == 3) // 利旧
                iconFontText = '\ue82b';
            else if (feature.getProperties().state == 4) { // 拆除
                iconFontText = '\ue850';
                isDismantle = true;
            }
            else {
                iconFontText = '\ue888';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
            }

        } else if (feature.getProperties().type == 2) { // 三相表箱
            if (feature.getProperties().state == 1) // 原有
                iconFontText = '\ue86c';
            else if (feature.getProperties().state == 2) // 新建
                iconFontText = '\ue854';
            else if (feature.getProperties().state == 3) // 利旧
                iconFontText = '\ue841';
            else if (feature.getProperties().state == 4){ // 拆除
                iconFontText = '\ue854';
                isDismantle = true;
            }
            else {
                iconFontText = '\ue888';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
            }
        } else {
            iconFontText = '\ue888';
            size = Styles[value].empty.size;
            fillSize = Styles[value].empty.fillSize;
            strokeSize = Styles[value].empty.strokeSize;
            color = Styles[value].empty.color;
            fillColor = Styles[value].empty.fillColor;
            strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'fault_indicator') { // 故障指示器样式
        switch (feature.getProperties().state) {
            // case '0':
            //     iconFontText = '\xe87d';
            //     break;
            case 1:
                iconFontText = '\ue88e';
                break;
            case 2:
                iconFontText = '\ue88d';
                break;
            case 3:
                iconFontText = '\ue88f';
                break;
            case 4:
                iconFontText = '\ue88d';
                isDismantle = true;
                break;
            default:
                iconFontText = '\ue87d';
                size = Styles[value].empty.size;
                fillSize = Styles[value].empty.fillSize;
                strokeSize = Styles[value].empty.strokeSize;
                color = Styles[value].empty.color;
                fillColor = Styles[value].empty.fillColor;
                strokeColor = Styles[value].empty.strokeColor;
        }
    }

    if (value == 'cross_arm') { // 横担
        if (feature.getProperties().type == null)
            iconFontText = '\ue824';
        else if (feature.getProperties().type == '两线墙装门型支架' || feature.getProperties().type == '四线墙装门型支架') { // 门型支架
            if (feature.getProperties().state == 1) // 原有
                iconFontText = '\ue87b';
            else if (feature.getProperties().state == 2) // 新建
                iconFontText = '\ue84e';
            else if (feature.getProperties().state == 3) // 利旧
                iconFontText = '\ue830';
            else if (feature.getProperties().state == 4) { // 拆除
                iconFontText = '\ue84e';
                isDismantle = true;
            }
            else {
                iconFontText = '\ue824';
            }

        } else {
            if (feature.getProperties().state == 1) // 原有
                iconFontText = '\ue872';
            else if (feature.getProperties().state == 2) // 新建
                iconFontText = '\ue856';
            else if (feature.getProperties().state == 3) // 利旧
                iconFontText = '\ue83b';
            else if (feature.getProperties().state == 4) { // 拆除
                iconFontText = '\ue856';
                isDismantle = true;
            }
            else {
                iconFontText = '\ue824';
            }
        }
    }

    if (value == 'hole') { // 穿孔
        iconFontText = '\ue84c';
    }

    if (value == 'over_head_device') { // 杆上设备
        regular = true;
        if (feature.getProperties().type < 6)
            azimuth += 90;
        if (feature.getProperties().state == null)
            iconFontText = '\ue828'; // 未选型柱上物
        else if (feature.getProperties().state == 1) { // 原有
            if (feature.getProperties().type == 2) //  柱上熔断器
                iconFontText = '\ue874';
            else if (feature.getProperties().type == 3) // 柱上断路器
                iconFontText = '\ue87a';
            else if (feature.getProperties().type == 4) // 柱上隔离开关
                iconFontText = '\ue87c';
            else if (feature.getProperties().type == 5) // 柱上避雷器
                iconFontText = '\ue877';
            else if (feature.getProperties().type == 7) // 电力引下
                iconFontText = '\ue885';
            else if (feature.getProperties().type == 8) // 无功补偿
                iconFontText = '\ue894';
            else if (feature.getProperties().type == 9) // 高压计量
                iconFontText = '\ue87e';
            else if (feature.getProperties().type == 10) // PT
                iconFontText = '\ue883';
            else {
                iconFontText = '\ue828';
            }

        }
        else if (feature.getProperties().state == 2) { // 新建
            if (feature.getProperties().type == 2) //  柱上熔断器
                iconFontText = '\ue85c';
            else if (feature.getProperties().type == 3) // 柱上断路器
                iconFontText = '\ue859';
            else if (feature.getProperties().type == 4) // 柱上隔离开关
                iconFontText = '\ue85d';
            else if (feature.getProperties().type == 5) // 柱上避雷器
                iconFontText = '\ue862';
            else if (feature.getProperties().type == 7) // 电力引下
                iconFontText = '\ue886';
            else if (feature.getProperties().type == 8) // 无功补偿
                iconFontText = '\ue892';
            else if (feature.getProperties().type == 9) // 高压计量
                iconFontText = '\ue882';
            else if (feature.getProperties().type == 10) // PT
                iconFontText = '\ue890';
            else {
                iconFontText = '\ue828';
            }

        } else if (feature.getProperties().state == 3) { // 利旧
            if (feature.getProperties().type == 2) //  柱上熔断器
                iconFontText = '\ue83d';
            else if (feature.getProperties().type == 3) // 柱上断路器
                iconFontText = '\ue846';
            else if (feature.getProperties().type == 4) // 柱上隔离开关
                iconFontText = '\ue84b';
            else if (feature.getProperties().type == 5) // 柱上避雷器
                iconFontText = '\ue83a';
            else if (feature.getProperties().type == 7) // 电力引下
                iconFontText = '\ue893';
            else if (feature.getProperties().type == 8) // 无功补偿
                iconFontText = '\ue881';
            else if (feature.getProperties().type == 9) // 高压计量
                iconFontText = '\ue880';
            else if (feature.getProperties().type == 10) // PT
                iconFontText = '\ue891';
            else {
                iconFontText = '\ue828';
            }

        } else if (feature.getProperties().state == 4) { // 拆除
            isDismantle = true;
            if (feature.getProperties().type == 2) //  柱上熔断器
                iconFontText = '\ue85c';
            else if (feature.getProperties().type == 3) // 柱上断路器
                iconFontText = '\ue859';
            else if (feature.getProperties().type == 4) // 柱上隔离开关
                iconFontText = '\ue85d';
            else if (feature.getProperties().type == 5) // 柱上避雷器
                iconFontText = '\ue862';
            else if (feature.getProperties().type == 7) // 电力引下
                iconFontText = '\ue886';
            else if (feature.getProperties().type == 8) // 无功补偿
                iconFontText = '\ue892';
            else if (feature.getProperties().type == 9) // 高压计量
                iconFontText = '\ue882';
            else if (feature.getProperties().type == 10) // PT
                iconFontText = '\ue890';
            else {
                iconFontText = '\ue828';
            }
        }
    }

    if (selected) { // 选中样式
        size = Styles[value].selected.size;
        backgroundColor = Styles[value].selected.backgroundColor;
        fillSize = Styles[value].selected.fillSize;
        strokeSize = Styles[value].selected.strokeSize;
        color = Styles[value].selected.color;
        fillColor = Styles[value].selected.fillColor;
        strokeColor = Styles[value].selected.strokeColor;
    }

    if (regular) {
        imageStyle = new RegularShape({
            points: 4,
            radius: strokeSize,
            rotation: (azimuth - 45) * (Math.PI / 180) * -1,
            fill: new Fill({
                color: fillColor
            })
        })
    } else {
        imageStyle = new Circle({
            radius: strokeSize / 2,
            stroke: new Stroke({
                color: strokeColor,
                width: (strokeSize - fillSize) / 2
            }),
            fill: new Fill({
                color: fillColor
            })
        })
    }

    style = new ClassStyle({
        image: imageStyle,
        text: new Text({
            font: 'Normal ' + size + 'px ' + iconFont,
            text: iconFontText,
            fill: new Fill({
                color
            }),
            stroke: new Stroke({
                color: backgroundColor,
                width: 2
            }),
            rotation: azimuth * (Math.PI / 180) * -1,
        })
    })
    if (type.split('_')[0] == 'dismantle' || isDismantle) {
        let dismantleColor = 'rgba(255, 0, 0, 1)';
        let dismantleStyle = new ClassStyle({
            text: new Text({
                font: 'Normal ' + strokeSize + 'px ' + iconFont,
                text: '\ue833',
                fill: new Fill({
                    color: dismantleColor,
                }),
                stroke: new Stroke({
                    color: dismantleColor,
                    width: 1
                })
            })
        });
        return [style, dismantleStyle];
    } else
        return style;
}
// 线样式
const line_style = function (feature: Feature, select: any, layerType: any) {
    let style = Styles.line[feature.getProperties().symbol_id];
    if (!style)
        style = Styles.line["1013"];
    let strokeOpts: Options = {
        color: style.color,
        lineCap: 'butt',
        width: Styles.line.default.width
    };
    if (style.lineDash) {
        /**
         * @psj 这里原生写法报错
         */
        strokeOpts.lineDash = style.lineDash;
    }
    let backgroundColor = Styles.line.default.backgroundColor;
    let styleParams, selectColor,fontColor;
    if (select) {
        selectColor = Styles.line.selected.color;
        strokeOpts.color = selectColor;
        backgroundColor = Styles.line.selected.backgroundColor;
        // styleParams = {
        //     stroke: new Stroke(strokeOpts)
        // };
        fontColor = 'rgba(249, 149, 52, 1)';
    } else {
        selectColor = style.color;
        fontColor = '#E8FCF8';
    }
    styleParams = {
        stroke: new Stroke(strokeOpts),
        text: new Text({
            // text: feature.getProperties().mode + '   ' + dis.toFixed(2) + 'm',
            text: feature.getProperties().lable,
            textAlign: 'center',
            font: 'bold 12px Source Han Sans SC', //字体与大小
            placement: 'line',
            // offsetX: 30,
            offsetY: 20,
            fill: new Fill({ //文字填充色
                color: fontColor
            }),
            stroke: new Stroke({ //文字边界宽度与颜色
                color: 'rgba(21, 32, 32, 1)',
                width: 2
            })
        })
    }
    let style_ = new ClassStyle(styleParams);
    strokeOpts.color = backgroundColor;
    strokeOpts.width = Styles.line.selected.width;
    let backgroundStyle = new ClassStyle({
        stroke: new Stroke(strokeOpts)
    })
    let styles = [backgroundStyle, style_];
    if(style.isDismantle){
        let dismantleStyle = new ClassStyle({
            text: new Text({
                font: 'Normal 22px webgisIconFont',
                text: '\ue82c',
                fill: new Fill({
                    color: 'red',
                }),
                stroke: new Stroke({
                    color: 'red',
                    width: 1
                })
            })
        });
        styles.push(dismantleStyle);
    }
    if (style.img) {
        let text;
        if (style.img.indexOf("220") > -1)
            text = Styles.line.selected.text1;
        else
            text = Styles.line.selected.text2;
        styles.push(
            new ClassStyle({
                text: new Text({
                    placement: 'line',
                    font: 'Normal 30px webgisIconFont',
                    text,
                    fill: new Fill({
                        color: selectColor
                    }),
                })
            })
        );
    }
    return styles;
}

// 电缆通道样式
const cable_channel_styles = function (feature: Feature) {
    let obj = Styles.line.cableChannel;
    let backgroundStyle = new ClassStyle({
        stroke: new Stroke({
            color: obj.backgroundColor,
            lineCap: 'butt',
            width: obj.width + 2
        })
    });
    let style = new ClassStyle({
        stroke: new Stroke({
            color: obj.color,
            lineCap: 'butt',
            width: obj.width
        }),
        text: new Text({
            text: feature.getProperties().lable,
            textAlign: 'center',
            font: 'bold 12px Source Han Sans SC', //字体与大小
            placement: 'line',
            // offsetX: 30,
            offsetY: 20,
            fill: new Fill({ //文字填充色
                color: '#ECDEF8'
            }),
            stroke: new Stroke({ //文字边界宽度与颜色
                color: 'rgba(24, 24, 24, 0.85)',
                // opacity: 0.85,
                width: 2
            })
        })
    });
    return [backgroundStyle, style];
}

// 辅助线样式
const fzx_styles = function () {
    let obj = Styles.line.fzx;
    let strokeOpts: Options = {
        color: obj.color,
        lineCap: 'butt',
        width: obj.width,
    };
    if (obj.lineDash)
        strokeOpts.lineDash = [6];
    let style = new ClassStyle({
        stroke: new Stroke(strokeOpts)
    });
    return style;

}

// 地物样式
const mark_style = function (feature: Feature) {
    let iconUrl;
    switch (feature.getProperties().type.toString()) {
        case '1':
            iconUrl = markImageSrc1;
            break;
        case '2':
            iconUrl = markImageSrc2;
            break;
        case '3':
            iconUrl = markImageSrc3;
            break;
        case '4':
            iconUrl = markImageSrc4;
            break;
        case '5':
            iconUrl = markImageSrc5;
            break;
        case '6':
            iconUrl = markImageSrc6;
            break;
        case '7':
            iconUrl = markImageSrc7;
            break;
        default:
            iconUrl = markImageSrc8;

    }

    var style = new ClassStyle({
        image: new Icon({
            src: iconUrl
            // size: [24, 24], // 图片大小
            // anchor: [11, 11] // 图片位置
        })
    });
    return style;
}
export {
    pointStyle,
    line_style,
    cable_channel_styles,
    fzx_styles,
    mark_style
}