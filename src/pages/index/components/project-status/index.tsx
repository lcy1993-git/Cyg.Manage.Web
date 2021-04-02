import AnnularFighure from "@/components/annular-fighure";
import { getProjectStatus } from "@/services/index";
import { useRequest } from "ahooks";
import React, { useMemo } from "react";
import ChartBox from "../chart-box";

const ProjectStatus: React.FC = () => {

    const { data: projectStatus } = useRequest(() => getProjectStatus(), {
        pollingWhenHidden: false
    });

    const option = useMemo(() => {
      if (!projectStatus) return undefined;
        const defaultOption = {
            tooltip: {
                trigger: 'item'
            },
            grid: {
                top: 20,
            },
            color: ["#26DDFD", "#2AFE97", "#FDFA88", "#21CEBE", "#D1CB38", "#399A3D"],
            series: [
                {
                    type: 'pie',
                    minAngle: 2,
                    radius: ['35%', '65%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        color: "#74AC91",
                        position: "outer"
                    },
                    emphasis: {

                    },
                    labelLine: {
                        show: true,
                        lineStyle: {
                            color: "#74AC91"
                        }
                    },
                    data: []
                }
            ]
        }
        if (projectStatus) {
            const handleArray = projectStatus.map((item) => {
                return {
                    value: item.value,
                    name: item.key
                }
            })
            //@ts-ignore
            defaultOption.series[0].data = handleArray;
        }
        return defaultOption
    }, [JSON.stringify(projectStatus)])


    return (
        <ChartBox title="项目状态">
            {
              option &&
              <AnnularFighure options={option}
            />}
        </ChartBox>
    )
}

export default ProjectStatus