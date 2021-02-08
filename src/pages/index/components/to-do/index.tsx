import React from "react"
import ChartBox from "../chart-box"
import ToDoItem from "../to-do-item"

const ToDo: React.FC = () => {
    return (
        <ChartBox title="待处理事务">
            <div className="flex">
                <div className="flex1">
                    <ToDoItem icon="wait-review" number={10} status={"待评审"} />
                </div>
                <div className="flex1">
                    <ToDoItem icon="wait-plan" number={10} status={"待安排"} />
                </div>
                <div className="flex1">
                    <ToDoItem icon="other" number={10} status={"其他消息"} />
                </div>

            </div>
        </ChartBox>
    )
}

export default ToDo