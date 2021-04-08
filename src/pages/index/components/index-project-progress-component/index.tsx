import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import ProjectProgress from "../project-progress";

interface IndexToDoComponentProps {
    componentProps?: string[]
}

const IndexProjectProgressComponent:React.FC<IndexToDoComponentProps> = (props) => {
    const {currentAreaId,currentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <ProjectProgress areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
        </>
    )
}

export default IndexProjectProgressComponent;