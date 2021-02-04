import React, { useRef, useEffect } from "react";
import styles from "./index.less";

import bgSrc from "@/assets/image/index/bg.png";
import chartBg from "@/assets/image/index/chartbak.jpg"

import xinjiang from "./json/xinjiang.json";

import * as echarts from 'echarts';
import 'echarts-gl'

const Index: React.FC = () => {

    const main2 = useRef(null);

    let initChart = () => {
        let element = document.getElementById('main');
        echarts.registerMap("xinjiang", xinjiang)
        let myChart = echarts.init(element as HTMLDivElement);


        let option = {
            geo3D: {
                type: 'map',
                map: "xinjiang",
                roam: true,
                geoIndex: 1,
                zoom: 1,  //地图的比例
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: '#000000'  //字体颜色
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#000000'  //选中后的字体颜色
                        }
                    }
                },
                
                itemStyle: {
                    borderWidth: 1,
                    borderType: "solid",
                    borderColor: "#666"
                },
                shading: 'realistic',
                realisticMaterial: {
                    detailTexture: chartBg,
                    roughness: 0,
                    metalness: 0
                },
                light: {
                    main: {}
                }

            },
        };
        myChart.setOption(option);
    };

    useEffect(() => {
        initChart();
    });

    return (
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }}>
            <div>

            </div>
            <div style={{ width: "1200px", height: "800px", marginLeft: "240px"}}>
                <div id={'main'} style={{ height: 800 }} />
            </div>
            <div>

            </div>
        </div>
    )
}

export default Index