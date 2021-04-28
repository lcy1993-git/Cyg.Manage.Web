import React, { useState, useEffect, useRef } from "react";
import { AreaInfo, getMapRegisterData, getMapStatisticsData, MapStatisticsData } from "@/services/index"
import { useMount, useRequest, useSize } from "ahooks";

import styles from "./index.less"

import * as echarts from 'echarts';
import "echarts/lib/chart/map";
import 'echarts/lib/component/tooltip';

import { cityCodeObject } from "./map-info";
import ChartBox from "../chart-box";

import ProjectNumberIcon from "@/assets/image/index/project-number.png";
import { isArray } from "lodash";
import { useMemo } from "react";
import { Button, message } from "antd";
import { exportHomeStatisticData } from "@/services/operation-config/cockpit";

interface MapChartComponentProps {
    currentAreaInfo: AreaInfo
    setCurrentAreaInfo: (areaInfo: any) => void
}

const MapChartComponent: React.FC<MapChartComponentProps> = (props) => {
    const { setCurrentAreaInfo, currentAreaInfo } = props;

    const [activeCityCode, setActiveCityCode] = useState<string>();
    const [activeAreaCode, setActiveAreaCide] = useState<string>();

    const [requestExportLoading, setRequestExportLoading] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement>(null);

    const size = useSize(divRef);

    let myChart: any = null;

    const { run: getMapData } = useRequest(getMapRegisterData, {
        manual: true
    });

    const { run: getStatisticData, data: mapStatisticData = [] } = useRequest(getMapStatisticsData, {
        manual: true
    })

    const projectTotalNumber = useMemo(() => {
        return mapStatisticData?.reduce((sum, item) => {
            return sum + item.projectQuantity;
        }, 0)
    }, [JSON.stringify(mapStatisticData)])


    const getMapOption = (mapName: string, getMapStatisticData: MapStatisticsData[]) => {
        const mapShowData = getMapStatisticData?.map((item) => {
            return {
                name: item.area,
                value: item.projectQuantity,
                selected: false
            }
        })
        return {
            tooltip: {
                trigger: "item",
                formatter: function (params: any) {
                    const { name } = params;
                    const nameIndex = getMapStatisticData?.findIndex((item) => item.area === name);
                    if (nameIndex > -1) {
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
                roam:false,
                //layoutCenter: ["50%", "50%"], //地图位置
                layoutSize: "100%",
                geoIndex: 1,
                selectedMode: false,
                itemStyle: {
                    normal: {
                        borderWidth: .8, //区域边框宽度
                        borderColor: '#74AC91', //区域边框颜色
                        areaColor: "#00483C", //区域颜色
                        label: {
                            show: false
                        }
                    },
                    emphasis: {
                        borderWidth: .8,
                        borderColor: '#74AC91',
                        areaColor: "", //区域颜色
                        label: {
                            show: false
                        },
                    },
                    select : {
                        borderWidth: .8,
                        borderColor: '#74AC91',
                        areaColor: "", //区域颜色
                        label: {
                            show: false
                        },
                    }
                },
                data: mapShowData,
                zlevel: 100
            }],
            dataRange: {
                x: "-10000px",
                y: "-10000px",
                splitList: [
                    { start: 1000, color: "#FEB12A" },
                    { start: 100, end: 1000, color: "#D4FD50" },
                    { start: 10, end: 100, color: "#2AFE97" },
                    { start: 1, end: 10, color: "#2CFFFE" },
                ]
            },
        }
    }

    const firstMapInitChartEvent = async () => {
        const statisticData = await getStatisticData({ areaCode: "", areaType: "1" })
        if (statisticData && isArray(statisticData) && statisticData.length === 1) {
            const provinceStatisticData = await getStatisticData({ areaCode: statisticData[0].areaCode, areaType: "2" })
            initChart(statisticData[0].areaCode, provinceStatisticData, "2")
            setActiveCityCode(statisticData[0].areaCode)
        } else {
            initChart("100000", statisticData, "1")
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
            myChart.off("mouseover");
            myChart.on("click", async (params: any) => {
                const { name } = params;
                if (cityCodeObject[name]) {
                    // 新增需求，有项目数量的时候才可以下钻
                    const chooseAreaDataIndex = getMapStatisticData.findIndex((item) => item.area === name);
                    if(chooseAreaDataIndex === -1) {
                        return
                    }
                    if(!getMapStatisticData[chooseAreaDataIndex].projectQuantity) {
                        return
                    }
                    const statisticData = await getStatisticData({ areaCode: cityCodeObject[name], areaType: String(parseFloat(currentAreaLevel) + 1) });
                    initChart(cityCodeObject[name], statisticData, String(parseFloat(currentAreaLevel) + 1))
                    if (parseFloat(currentAreaLevel!) + 1 === 2) {
                        setActiveCityCode(cityCodeObject[name])
                    }
                    if (parseFloat(currentAreaLevel!) + 1 === 3) {
                        setActiveAreaCide(cityCodeObject[name])
                    }
                    setCurrentAreaInfo({
                        areaId: cityCodeObject[name],
                        areaLevel: String(parseFloat(currentAreaLevel!) + 1)
                    })
                }
            })

            myChart.on("mouseover", function (params) {
                myChart.dispatchAction({
                    type: 'downplay'
                });
                // if (params.data && params.data.value != undefined) {
                //     myChart.dispatchAction({
                //         type: 'downplay'
                //     });
                // }
            });
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
        initChart("100000", statisticData, "1");

        setActiveCityCode("");
        setActiveAreaCide("");

        setCurrentAreaInfo({
            areaId: "",
            areaLevel: "1"
        })
    }

    const cityClickEvent = async () => {
        if (!activeCityCode) {
            return
        }
        const statisticData = await getStatisticData({ areaCode: activeCityCode, areaType: "2" })
        initChart(activeCityCode, statisticData, "2");
        setActiveAreaCide("");
        setCurrentAreaInfo({
            areaId: activeCityCode,
            areaLevel: "2"
        })
    }

    const areaClickEvent = async () => {
        if (!activeAreaCode) {
            return
        }
        const statisticData = await getStatisticData({ areaCode: activeAreaCode, areaType: "2" })
        initChart(activeAreaCode, statisticData, "2");

        setCurrentAreaInfo({
            areaId: activeAreaCode,
            areaLevel: "3"
        })
    }

    // 导出配置数据
    const exportHomeStatisticEvent = async () => {
        try {
            setRequestExportLoading(true);
            const res = await exportHomeStatisticData({
                areaCode: currentAreaInfo.areaId!,
                areaType: currentAreaInfo.areaLevel!,
                ganttChartLimit: 1000,
            });
            let blob = new Blob([res], {
                type: 'application/vnd.ms-excel;charset=utf-8',
            });
            let finalyFileName = `首页统计图表.xlsx`;
            // for IE
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
            } else {
                // for Non-IE
                let objectUrl = URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.href = objectUrl;
                link.setAttribute('download', finalyFileName);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
            message.success('导出成功');
        } catch (msg) {
            console.error(msg);
        } finally {
            setRequestExportLoading(false);
        }
    };

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

    useEffect(() => {
        if (size.width || size.height) {
            const myEvent = new Event("resize");
            window.dispatchEvent(myEvent)
        }
    }, [JSON.stringify(size)])

    useMount(() => {
        firstMapInitChartEvent()
    })

    return (
        <div className={styles.mapChartComponent}>
            <div className={styles.mapChartComponentTipInfo}>
                <div className={styles.mapChartComponentProjectNumber}>
                    <ChartBox tltleWidthLevel="big" title="当前项目数量" titleAlign="left">
                        <div className={styles.projectTotalNumber}>
                            <div className="flex1 flex">
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
                            <div className={styles.exportButton}>
                                <Button loading={requestExportLoading} type="primary" onClick={exportHomeStatisticEvent}>
                                    导出
                                </Button>
                            </div>
                        </div>
                    </ChartBox>
                </div>
                <div className="flex1"></div>
                <div className={styles.mapChartComponentProjectAreaTab}>
                    <span className={`${styles.areaSpan} ${styles.hasChoose}`} onClick={provinceClickEvent}>
                        省
                    </span>
                    <span className={`${styles.splineIcon} ${activeCityCode ? styles.hasChoose : ""}`}>
                        &gt;
                    </span>
                    <span className={`${styles.areaSpan} ${activeCityCode ? styles.hasChoose : ""}`} onClick={cityClickEvent}>
                        市
                    </span>
                    <span className={`${styles.splineIcon} ${activeAreaCode ? styles.hasChoose : ""}`}>
                        &gt;
                    </span>
                    <span className={`${styles.areaSpan} ${activeAreaCode ? styles.hasChoose : ""}`} onClick={areaClickEvent}>
                        县
                    </span>
                </div>
            </div>
            <div className={styles.mapStatisticContent}>
                <div className={styles.mapStatisticContentDataSplit}>
                    <div className={styles.dataSplitContent}>
                        <div className={styles.dataSplitContentHalo}></div>
                        <div className={styles.dataSplitMenu}>
                            <div className={styles.dataSplitMenuItem}>
                                <span className={`${styles.dataSplitMenuItemIcon} ${styles.orange}`}></span>
                                <span className={styles.dataSplitMenuItemContent}>
                                    1000 - 1000+
                                </span>
                            </div>
                            <div className={styles.dataSplitMenuItem}>
                                <span className={`${styles.dataSplitMenuItemIcon} ${styles.lightGreen}`}></span>
                                <span className={styles.dataSplitMenuItemContent}>
                                    100 - 1000
                                </span>
                            </div>
                            <div className={styles.dataSplitMenuItem}>
                                <span className={`${styles.dataSplitMenuItemIcon} ${styles.green}`}></span>
                                <span className={styles.dataSplitMenuItemContent}>
                                    10 - 100
                                </span>
                            </div>
                            <div className={styles.dataSplitMenuItem}>
                                <span className={`${styles.dataSplitMenuItemIcon} ${styles.blue}`}></span>
                                <span className={styles.dataSplitMenuItemContent}>
                                    0 - 10
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mapConent} ref={divRef} />
            </div>
        </div>
    )
}

export default MapChartComponent