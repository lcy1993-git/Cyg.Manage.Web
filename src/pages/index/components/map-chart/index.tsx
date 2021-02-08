import React,{useEffect,useRef} from "react";

import xinjiang from "../../json/xinjiang.json";

import * as echarts from 'echarts';
import "echarts/lib/chart/map";
import 'echarts/lib/component/tooltip';



const MapChart:React.FC = () => {

    const divRef = useRef<HTMLDivElement>(null);

    const initChart = () => {
        if (divRef && divRef.current) {
            echarts.registerMap("xinjiang", xinjiang)
            let myChart = echarts.init(divRef.current as HTMLDivElement);
            let option = {
                tooltip: {
                    trigger: "item",
                },
                series: [{
                    type: 'map',
                    map: 'xinjiang',
                    tooltip: {
                        show: true
                    },
                    layoutCenter: ["50%", "50%"], //地图位置
                    layoutSize: '100%',
                    roam: true,
                    geoIndex: 1,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(255, 255, 255, 0.6)',
                            borderWidth: 0.8,
                            borderType: "dotted",
                            areaColor: {
                                type: 'linear',
                                x: 0,
                                y: 1500,
                                x2: 1000,
                                y2: 0,
                                colorStops: [{
                                    offset: 0.4,
                                    color: '#00481E' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#2AFE97' // 100% 处的颜色
                                }],
                                global: true // 缺省为 false
                            },
                        },
                        emphasis: {
                            areaColor: "#2AFE97",
                            label: {
                                show: false
                            }
                        }
                    },
                    zlevel: 100
                }],
            };
            // @ts-ignore
            myChart.setOption(option);
        }

    };

    useEffect(() => {
        initChart();
    });

    return (
        <div style={{width: "100%", height: "100%"}}  ref={divRef} />
    )
}

export default MapChart