import BarChart from "@/components/bar-chart";
import React from "react";
import ChartBox from "../chart-box";

const CostInformation: React.FC = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        color: ["#2AFE97","#FDFA88"],
        legend: {
            data: ['工程总价/万元', '设计费/万元'],
            right: 20,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {
                lineHeight: 16,
                color: "#74AC91"
            }
        },
        grid: {
            left: 40,
            right: 10,
            bottom: 50,
            top: 35
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
                show: true,
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
        xAxis: {
            type: 'category',
            data: ['项目名称一', '项目名称一', '项目名称一', '项目名称一', '项目名称一', '项目名称一'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#74AC91"
                }
            }
        },
        series: [
            {
                name: '工程总价/万元',
                type: 'bar',
                data: [20, 40, 80, 120, 63, 25],
                
            },
            {
                name: '设计费/万元',
                type: 'bar',
                data: [15, 30, 48, 21, 35, 25],
                
            }
        ]
    }
    return (
        <ChartBox title="造价信息">
            <div style={{ width: "100%", height: "100%" }}>
                <BarChart options={option} />
            </div>

        </ChartBox>
    )
}

export default CostInformation