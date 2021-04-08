import React, { useState, useCallback, useEffect, useRef } from "react";
import { getMapRegisterData, getMapStatisticsData, MapStatisticsData } from "@/services/index"
import { useMount, useRequest } from "ahooks";

import styles from "./index.less"

import * as echarts from 'echarts';
import "echarts/lib/chart/map";
import 'echarts/lib/component/tooltip';

import { cityCodeObject } from "./map-info";
import ChartBox from "../chart-box";

import ProjectNumberIcon from "@/assets/image/index/project-number.png";
import { isArray } from "lodash";
import { useMemo } from "react";
import { message } from "antd";

interface MapChartComponentProps {
    setCurrentAreaInfo: (areaInfo: any) => void
}

const MapChartComponent: React.FC<MapChartComponentProps> = (props) => {
    const [activeAreaLevel, setActiveAreaLevel] = useState<string>("1");
    const {setCurrentAreaInfo } = props;

    const [activeCityCode, setActiveCityCode] = useState<string>();
    const [activeAreaCode, setActiveAreaCide] = useState<string>();

    const divRef = useRef<HTMLDivElement>(null);
    let myChart: any = null;

    const { run: getMapData} = useRequest(getMapRegisterData, {
        manual: true
    });

    const { run: getStatisticData, data: mapStatisticData = []} = useRequest(getMapStatisticsData, {
        manual: true
    })

    const projectTotalNumber = useMemo(() => {
        return mapStatisticData?.reduce((sum, item) => {
            return sum + item.projectQuantity;
        }, 0)
    }, [JSON.stringify(mapStatisticData)])

    const getMapOption = (mapName: string, getMapStatisticData: MapStatisticsData[]) => {
        return {
            tooltip: {
                trigger: "item",
                formatter: function (params: any) {
                    const { name } = params;
                    const nameIndex = getMapStatisticData?.findIndex((item) => item.area === name);
                    if(nameIndex > -1) {
                        return `
                            ${name} <br />
                            项目数量: ${getMapStatisticData[nameIndex!].projectQuantity}
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
                map: mapName,
                tooltip: {
                    show: true
                },
                layoutCenter: ["50%", "50%"], //地图位置
                layoutSize: '97%',
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
        }
    }

    const firstMapInitChartEvent = async () => {
        const statisticData = await getStatisticData({ areaCode: "", areaType: "1" })
        if(statisticData && isArray(statisticData) && statisticData.length === 1) {
            const provinceStatisticData = await getStatisticData({ areaCode: statisticData[0].areaCode, areaType: "2" })
            initChart(statisticData[0].areaCode, provinceStatisticData,"2")
            setActiveAreaLevel("2")
        }else {
            initChart("100000", statisticData, "1")
            setActiveAreaLevel("1")
        }
    }

    const initChart = async (currentAreaId: string, getMapStatisticData: MapStatisticsData[], currentAreaLevel: string) => {
        //setAreaId(areaId);
        const option = getMapOption(currentAreaId, getMapStatisticData);
        const resData = await getMapData(currentAreaId);

        if (divRef && divRef.current) {
            echarts.registerMap(currentAreaId, resData)
            myChart = echarts.init(divRef.current as HTMLDivElement);
            // @ts-ignore
            myChart.setOption(option);
            myChart.off("click");
            myChart.on("click", async (params: any) => {
                const { name } = params;
                if(cityCodeObject[name]) {
                    const statisticData = await getStatisticData({ areaCode: cityCodeObject[name], areaType: String(parseFloat(currentAreaLevel) + 1) });
                    initChart(cityCodeObject[name],statisticData,String(parseFloat(currentAreaLevel) + 1))
                    if(parseFloat(currentAreaLevel!) + 1 === 2) {
                        setActiveCityCode(cityCodeObject[name])
                    }
                    if(parseFloat(currentAreaLevel!) + 1 === 3) {
                        setActiveAreaCide(cityCodeObject[name])
                    }
                    setCurrentAreaInfo({
                        areaId: cityCodeObject[name],
                        areaLevel: String(parseFloat(currentAreaLevel!) + 1)
                    })
                }
            })
        }
    };

    const resize = () => {
        if (myChart) {
            setTimeout(() => {
                myChart.resize()
            }, 100)
        }
    }

    const provinceClickEvent = async () => {
        const statisticData = await getStatisticData({ areaCode: "", areaType: "1" })
        initChart("100000",statisticData,"1");

        setActiveAreaLevel("1");

        setCurrentAreaInfo({
            areaId: "",
            areaLevel: "1"
        })
    }

    const cityClickEvent = async () => {
        if(!activeCityCode) {
            message.error("您没有选择过市级统计");
            return
        }
        const statisticData = await getStatisticData({ areaCode: activeCityCode, areaType: "2" })
        initChart(activeCityCode,statisticData,"2");
        setActiveAreaLevel("2");
        setCurrentAreaInfo({
            areaId: activeCityCode,
            areaLevel: "2"
        })
    }

    const areaClickEvent = async () => {
        if(!activeAreaCode) {
            message.error("您没有选择过县级统计");
            return
        }
        const statisticData = await getStatisticData({ areaCode: activeAreaCode, areaType: "2" })
        initChart(activeAreaCode,statisticData,"2");

        setActiveAreaLevel("3");
        setCurrentAreaInfo({
            areaId: activeAreaCode,
            areaLevel: "3"
        })
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (!divRef.current) { // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
                window.removeEventListener('resize', resize);
                return;
            } else {
                resize()
            }
        });

        () => {
            window.removeEventListener('resize', resize);
        }
    });

    useMount(() => {
        firstMapInitChartEvent()
    })

    return (
        <div className={styles.mapChartComponent}>
            <div className={styles.mapChartComponentTipInfo}>
                <div className={styles.mapChartComponentProjectNumber}>
                    <ChartBox tltleWidthLevel="big" title="当前项目数量" titleAlign="left">
                        <div className={styles.projectTotalNumber}>
                            <div className={styles.projectTotalNumberIcon}>
                                <img src={ProjectNumberIcon} />
                            </div>
                            <div className={styles.projectTotalNumberShow}>
                                {projectTotalNumber}
                            </div>
                            <div className={styles.projectTotalNumberUnit}>
                                个
                            </div>
                        </div>
                    </ChartBox>
                </div>
                <div className="flex1"></div>
                <div className={styles.mapChartComponentProjectAreaTab}>
                    <span className={`${styles.areaSpan} ${activeAreaLevel === "1" ? styles.active : ""}`} onClick={provinceClickEvent}>
                        省
                    </span>
                    <span className={styles.splineIcon}>
                        &gt;
                    </span>
                    <span className={`${styles.areaSpan} ${activeAreaLevel === "2" ? styles.active : ""}`} onClick={cityClickEvent}>
                        市
                    </span>
                    <span className={styles.splineIcon}>
                        &gt;
                    </span>
                    <span className={`${styles.areaSpan} ${activeAreaLevel === "3" ? styles.active : ""}`} onClick={areaClickEvent}>
                        县
                    </span>
                </div>
            </div>
            <div className={styles.mapConent} ref={divRef} />
        </div>
    )
}

export default MapChartComponent