import AnnularFighure from "@/components/annular-fighure";
import * as echarts from "echarts/lib/echarts";
import { getProjectStatus } from "@/services/index";
import { useRequest } from "ahooks";
import React, { useMemo } from "react";
const ProjectStatusBar: React.FC = () => {

    const { data: projectStatus } = useRequest(() => getProjectStatus(), {
        pollingWhenHidden: false
    })

    const option = useMemo(() => {
      
      const dataArray = projectStatus?.map((item) => item.key);
      const valueArray = projectStatus?.map((item) => item.value);

      return {
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
                formatter:function(params: any) {
                    let newParamsName = "";
                    let paramsNameNumber = params.length;
                    let provideNumber = 3;  //一行显示几个字
                    let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                    if (paramsNameNumber > provideNumber) {
                        for (let p = 0; p < rowNumber; p++) {
                            let tempStr = "";
                            let start = p * provideNumber;
                            let end = start + provideNumber;
                            if (p == rowNumber - 1) {
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;
                        }
  
                    } else {
                        newParamsName = params;
                    }
                    return newParamsName ;
                },
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
                    color: function () {
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                            [
                                {
                                    offset: 0,
                                    color: "#104444" // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#26FDEC" // 100% 处的颜色
                                }
                            ])
                    }
                }
            },
        }]
      };
      
    }, [JSON.stringify(projectStatus)])
    return (
      <AnnularFighure options={option} />
    )
}

export default ProjectStatusBar;