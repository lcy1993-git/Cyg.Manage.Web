import { getToDoStatistics } from "@/services/index"
import { useRequest } from "ahooks"
import React from "react"
import ChartBox from "../chart-box"
import ToDoItem from "../to-do-item"



const ToDo: React.FC = () => {

    const {data: toDoStatisticsInfo} = useRequest(() => getToDoStatistics(),{
        pollingWhenHidden: false
    })

    return (
        <ChartBox title="待处理事务">
            <div className="flex">
                <div className="flex1">
                    <ToDoItem icon="wait-review" number={toDoStatisticsInfo?.awaitKnot ?? 0} status={"待结项"} />
                </div>
                <div className="flex1">
                    <ToDoItem icon="wait-plan" number={toDoStatisticsInfo?.awaitAllot ?? 0} status={"待安排"} />
                </div>
                <div className="flex1">
                    <ToDoItem icon="other" number={0} status={"其他消息"} />
                </div>
            </div>
        </ChartBox>
    )
}

export default ToDo