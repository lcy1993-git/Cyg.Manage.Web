import BarChart from "@/components/bar-chart";
import React from "react";
import * as echarts from "echarts/lib/echarts"
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import styles from "./index.less"

const PersonnelLoad:React.FC = () => {
    const tabData = [
        {
            id: "person",
            name: "员工"
        },
        {
            id: "array",
            name: "部组"
        },
        {
            id: "company",
            name: "公司"
        }
    ]

    const option = {
        grid: {
            left: 60,
            bottom: 30,
            top: 20
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#74AC91"
                }
            },
            axisLabel: {
                lineStyle: {
                    color: "#74AC91"
                }
            },
            splitLine: {
                lineStyle: {
                    color: "#74AC91"
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['员工一', '员工二', '员工三', '员工四', '员工五'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#74AC91"
                }
            }
        },
        series: [{
            data: [120, 200, 150, 80, 70],
            type: 'bar',
            itemStyle: {
                normal: {
                    color: function () {
                        return new echarts.graphic.LinearGradient(0, 0, 1, 0,
                            [
                                {
                                    offset: 0,
                                    color: "#00481E" // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#2AFE97" // 100% 处的颜色
                                }
                            ])
                    }
                }
            },
        }]
    };
    return (
        <ChartBox title="人员负荷">
            <div className={styles.personnelLoad}>
                <div className={styles.personnelLoadCondition}>
                    <div className="flex1"></div>
                    <div className={styles.personnelLoadTab}>
                        <ChartTab data={tabData} defaultValue="person" />
                    </div>
                </div>
                <div className={styles.personnelLoadChart}>
                    <BarChart options={option} />
                </div>
            </div>
        </ChartBox>
    )
}

export default PersonnelLoad