import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import ProjectProgress from "../project-progress";

interface IndexToDoComponentProps {
    componentProps?: string[]
}

const IndexProjectProgressComponent:React.FC<IndexToDoComponentProps> = (props) => {
    const {currentAreaInfo} = useContext(IndexContext);

    return (
        <>
            <ProjectProgress currentAreaInfo={currentAreaInfo} {...props} />
        </>
    )
}

export default IndexProjectProgressComponent;