import React from "react";
import emptyImageSrc from "@/assets/image/empty.png";
import { Empty } from "antd";

interface EmptyTipProps {
    description?: string | React.ReactNode
    className?:string
}

const EmptyTip:React.FC<EmptyTipProps> = (props) => {
    const {description = "没有找到匹配的记录",className} = props;
    return (
        <Empty
            image={emptyImageSrc}
            description= {description}
            className={className}
        >
            {props.children }
        </Empty>
    )
}

export default EmptyTip