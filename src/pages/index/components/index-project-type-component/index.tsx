import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import ProjectType from "../project-type";

interface IndexPorjectTypeProps {
    componentProps?: string[]
}

const IndexProjectProps:React.FC<IndexPorjectTypeProps> = (props) => {
    const {currentAreaId,currentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <ProjectType areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
        </>
    )
}

export default IndexProjectProps