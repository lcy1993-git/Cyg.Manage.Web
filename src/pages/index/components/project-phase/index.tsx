import AnnularFighure from "@/components/annular-fighure";
import React from "react";
import ChartBox from "../chart-box";

const ProjectPhase:React.FC = () => {

    const option = {
        tooltip: {
            trigger: 'item'
        },
        grid: {
            top: 20,
        },
        color: ["#26DDFD","#2AFE97","#FDFA88","#21CEBE","#D1CB38","#399A3D"],
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['35%', '65%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    color: "#74AC91",

                },
                emphasis: {
                    
                },
                labelLine: {
                    show: true,
                    lineStyle: {
                        color: "#74AC91"
                    }
                },
                data: [
                    {value: 1048, name: '勘察中'},
                    {value: 735, name: '已勘察'},
                    {value: 580, name: '设计中'},
                    {value: 484, name: '待内审'},
                    {value: 300, name: '设计完成'},
                    {value: 300, name: '结项中'},
                ]
            }
        ]
    }

    return (
        <ChartBox title="项目阶段">
            <AnnularFighure options={option} />
        </ChartBox>
    )
}

export default ProjectPhase