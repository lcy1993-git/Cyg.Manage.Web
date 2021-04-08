import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import ProjectSituation from "../project-schedule-status";

interface IndexToDoComponentProps {
    componentProps?: string[]
}

const IndexProjectSituationComponent:React.FC<IndexToDoComponentProps> = (props) => {
    const {currentAreaId,currentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <ProjectSituation areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
        </>
    )
}

export default IndexProjectSituationComponent;