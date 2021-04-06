import React, { useMemo } from "react"
import { useRequest } from "ahooks"
import barChartsOptions from '../../utils/barChartsOption';
import BarChart from "@/components/bar-chart";
import { getProjectBuliding } from "@/services/index"
import uuid from "node-uuid"
import AnnularFighure from "@/components/annular-fighure"
import styles from "./index.less"

interface IProps {
  type: "bar" | "pie"
}

const ProjectClassify: React.FC<IProps> = ({type = "pie"}) => {
    const { data: projectBuilding } = useRequest(() => getProjectBuliding(), {
        pollingWhenHidden: false
    })

    const chartColor = [
        "#2AFE97", "#FDFA88", "#21CEBE", "#4DA944"
    ];

    if (!projectBuilding) return null;
  
    const sum = projectBuilding?.reduce((sum, item) => {
        return sum + item.value;
    },0) ?? 1;
    let chartElement = null;
    if (type === "pie") {
      chartElement = projectBuilding?.map((item, index) => {
        const proportion = ((item.value / sum) * 100).toFixed(2) + "%"
        const option = {
            title: {
                text: proportion,  //图形标题，配置在中间对应效果图的80%
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
                    radius: ['55%', '70%'],   //设置内外环半径,两者差值越大，环越粗
                    hoverAnimation: false,　 //移入图形是否放大
                    labelLine: {
                        normal: {  //label线不显示
                            show: false
                        }
                    },
                    data: [
                        {
                            value: item.value,
                            itemStyle: {
                                normal: {
                                    color: chartColor[index],
                                }
                            }
                        },
                        {
                            value: (sum - item.value),
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
            <div className={styles.chartItem} key={uuid.v1()}>
                <AnnularFighure options={option} />
                <div className={styles.title}>
                    {item.key}
                </div>
            </div>
        )
      })
    } else if (type === "bar") {
      const optionBar = barChartsOptions(projectBuilding!)
      chartElement = optionBar ? <BarChart options={optionBar} /> : null;
    }

    return (
        <>
            {chartElement}
        </>
    )
}

export default ProjectClassify