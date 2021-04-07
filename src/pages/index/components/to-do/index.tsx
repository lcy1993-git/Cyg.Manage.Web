import { getToDoStatistics } from "@/services/index"
import { useRequest } from "ahooks"
import React from "react"
import ChartBox from "../chart-box"
import ToDoItem from "../to-do-item"

interface ToDoProps { 
    componentProps?: string[]
    areaId?: string
    areaLevel?: string
}

const ToDo: React.FC<ToDoProps> = (props) => {

    const { componentProps = ["wait", "arrange", "other"],areaId,areaLevel} = props;

    const { data: toDoStatisticsInfo } = useRequest(() => getToDoStatistics({areaCode: areaId,areaType: areaLevel}), {
        pollingWhenHidden: false
    })

    return (
        <ChartBox title="待处理事务">
            <div className="flex">
                {
                    componentProps.includes("wait") &&
                    <div className="flex1">
                        <ToDoItem icon="wait-review" number={toDoStatisticsInfo?.awaitKnot ?? 0} status={"待结项"} />
                    </div>
                }
                {
                    componentProps.includes("arrange") &&
                    <div className="flex1">
                        <ToDoItem icon="wait-plan" number={toDoStatisticsInfo?.awaitAllot ?? 0} status={"待安排"} />
                    </div>
                }
                {
                    componentProps.includes("other") &&
                    <div className="flex1">
                        <ToDoItem icon="other" number={0} status={"其他消息"} />
                    </div>
                }
            </div>
        </ChartBox>
    )
}

export default ToDo