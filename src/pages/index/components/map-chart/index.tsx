import React,{useEffect,useRef} from "react";

import xinjiang from "../../json/xinjiang.json";

import * as echarts from 'echarts';
import "echarts/lib/chart/map";
import 'echarts/lib/component/tooltip';
import { useRequest, useSize } from "ahooks";
import { getMapStatisticsData } from "@/services/index";

const MapChart:React.FC = () => {

    const {data: mapData = []} = useRequest(() => getMapStatisticsData(), {
        onSuccess: () => {
            initChart();
        }
    });

    const divRef = useRef<HTMLDivElement>(null);
    let myChart:any = null;

    const option = {
        tooltip: {
            trigger: "item",
            formatter: function(params: any) {  
                const {name} = params;
                const nameIndex = mapData?.findIndex((item) => item.area === name);
                if(nameIndex > -1) {
                    return `
                        ${name} <br />
                        项目数量: ${mapData[nameIndex].engineerQuantity}
                    `
                }
                return `
                    ${name} <br />
                    项目数量: 0
                `
            }  
        },
        series: [{
            type: 'map',
            map: 'xinjiang',
            tooltip: {
                show: true
            },
            layoutCenter: ["50%", "50%"], //地图位置
            layoutSize: '100%',
            roam: false,
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
                            color: '#005A4F' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#00DECD' // 100% 处的颜色
                        }],
                        global: true // 缺省为 false
                    },
                },
                emphasis: {
                    areaColor: {
                        type: 'linear',
                        x: 0,
                        y: 2,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0.1,
                            color: '#18A59B' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#2AF8DE' // 100% 处的颜色
                        }],
                    },
                    label: {
                        show: false
                    }
                }
            },
            zlevel: 100
        }],
    };

    const size = useSize(divRef);

    const initChart = () => {
        if (divRef && divRef.current) {
            echarts.registerMap("xinjiang", xinjiang)
            myChart = echarts.init(divRef.current as HTMLDivElement);
            
            // @ts-ignore
            myChart.setOption(option);
        }

    };

    const resize = () => {
        if(myChart) {
            setTimeout(() => {
                myChart.resize()
            },100)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
			if (!divRef.current) { // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
		        window.removeEventListener('resize', resize);
		        return;
		    }else {
                resize()
            }
		});
       
        () => {
            window.removeEventListener('resize', resize);
        }
    });

    useEffect(() => {
        if(size.width) {
            const myEvent = new Event("resize");
            window.dispatchEvent(myEvent)
        }
    }, [JSON.stringify(size)])

    return (
        <div style={{width: "100%", height: "100%"}}  ref={divRef} />
    )
}

export default MapChart