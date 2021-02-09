import AnnularFighure from "@/components/annular-fighure";
import React from "react";
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import styles from "./index.less";

const ProjectType: React.FC = () => {

    const tabData = [
        {
            id: "classify",
            name: "项目分类"
        },
        {
            id: "type",
            name: "项目类别"
        },
        {
            id: "stage",
            name: "项目阶段"
        },
        {
            id: "bulidType",
            name: "建设类型"
        },
        {
            id: "level",
            name: "电压等级"
        },
    ]

    const option = {
        title: {
            text: '30%',  //图形标题，配置在中间对应效果图的80%
            left: "center",
            top: "41%",
            textStyle: {
                color: "#74AC91",
                fontSize: 12,
                align: "center",
                fontWight: 100
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['60%', '80%'],  //设置内外环半径,两者差值越大，环越粗
                hoverAnimation: false,　 //移入图形是否放大
                labelLine: {
                    normal: {  //label线不显示
                        show: false
                    }
                },
                data: [
                    {
                        value: 30,
                        itemStyle: {
                            normal: {
                                color: '#2AFE97',
                            }
                        }
                    },
                    {
                        value: 70,
                        itemStyle: {
                            normal: {
                                color: '#004260'
                            }
                        }
                    }
                ]
            }
        ]
    }

    const option1 = {
        title: {
            text: '30%',  //图形标题，配置在中间对应效果图的80%
            left: "center",
            top: "41%",
            textStyle: {
                color: "#74AC91",
                fontSize: 12,
                align: "center",
                fontWight: 100
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['60%', '80%'],  //设置内外环半径,两者差值越大，环越粗
                hoverAnimation: false,　 //移入图形是否放大
                labelLine: {
                    normal: {  //label线不显示
                        show: false
                    }
                },
                data: [
                    {
                        value: 30,
                        itemStyle: {
                            normal: {
                                color: '#FDFA88',
                            }
                        }
                    },
                    {
                        value: 70,
                        itemStyle: {
                            normal: {
                                color: '#004260'
                            }
                        }
                    }
                ]
            }
        ]
    }

    const option2 = {
        title: {
            text: '30%',  //图形标题，配置在中间对应效果图的80%
            left: "center",
            top: "41%",
            textStyle: {
                color: "#74AC91",
                fontSize: 12,
                align: "center",
                fontWight: 100
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['60%', '80%'],  //设置内外环半径,两者差值越大，环越粗
                hoverAnimation: false,　 //移入图形是否放大
                labelLine: {
                    normal: {  //label线不显示
                        show: false
                    }
                },
                data: [
                    {
                        value: 30,
                        itemStyle: {
                            normal: {
                                color: '#21CEBE',
                            }
                        }
                    },
                    {
                        value: 70,
                        itemStyle: {
                            normal: {
                                color: '#004260'
                            }
                        }
                    }
                ]
            }
        ]
    }

    return (
        <ChartBox title="项目类型">
            <div className={styles.projectType}>
                <div className={styles.projectTypeControl}>
                    <div className="flex1" />
                    <div className={styles.projectTypeControlTab}>
                        <ChartTab data={tabData} defaultValue="classify" />
                    </div>
                </div>
                <div className={styles.projectTypeChart}>
                    <div style={{width: "33.3%"}}>
                        <AnnularFighure options={option} />
                    </div>
                    <div style={{width: "33.3%"}}>
                        <AnnularFighure options={option1} />
                    </div>
                    <div style={{width: "33.3%"}}>
                        <AnnularFighure options={option2} />
                    </div>
                </div>
            </div>
        </ChartBox>
    )
}

export default ProjectType