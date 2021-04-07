import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import ToDo from "../to-do";

interface IndexToDoComponentProps {
    componentProps?: string[]
}

const IndexToDoComponent:React.FC<IndexToDoComponentProps> = (props) => {
    const {currentAreaId,currentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <ToDo areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
        </>
    )
}

export default IndexToDoComponent