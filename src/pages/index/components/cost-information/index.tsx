import BarChart from "@/components/bar-chart";
import { getBuildType } from "@/services/index";
import * as echarts from "echarts/lib/echarts"
import { useRequest } from "ahooks";
import React from "react";
import ChartBox from "../chart-box";

const CostInformation: React.FC = () => {

    const { data: projectNatures } = useRequest(() => getBuildType(), {
        pollingWhenHidden: false
    })

    const dataArray = projectNatures?.map((item) => item.key);

    const valueArray = projectNatures?.map((item) => item.value);

    const option = {
        grid: {
            left: 60,
            bottom: 50,
            top: 20
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: dataArray,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#74AC91"
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#74AC91'
                },
                fontSize: 10,
                align: "center",
            },
        },
        yAxis: {
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
                    color: "#355345",
                    type: "dashed"
                }
                
            }
        },
        series: [{
            data: valueArray,
            type: 'bar',
            itemStyle: {
                normal: {
                    color: function (params: any) {
                        let colorList = [
                            ['#104444','#26FDEC'],
                            ['#104444','#2AFE97'],
                            ['#104444','#26DDFD'],
                            ['#104444','#26DDFD'],
                        ]
                        let index = params.dataIndex
                 
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                            [
                                {
                                    offset: 0,
                                    color: colorList[index][0] // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: colorList[index][1] // 100% 处的颜色
                                }
                            ])
                    }
                }
            },
        }]
    };
    
    return (
        <ChartBox title="建设类型">
            <div style={{ width: "100%", height: "100%" }}>
                <BarChart options={option} />
            </div>

        </ChartBox>
    )
}

export default CostInformation