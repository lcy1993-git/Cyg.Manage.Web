import React from "react"
import {webConfig} from "@/global"

const ProjectStatistics:React.FC = () => {
    const thisHostName = window.location.hostname === "localhost" ? "10.6.1.40" : window.location.hostname;

    const baseUrl = `${document.location.protocol}//${thisHostName}`;

    const port = window.location.hostname === "localhost" ? "21528" : document.location.port;

    const {areaStatisticsUrl} = webConfig;

    return (
       
            <iframe width="100%" height="100%" src={`${baseUrl}:${port}${areaStatisticsUrl}`}></iframe>
        
    )
}

export default ProjectStatistics