import React from "react"
import {ipArray} from "../../../../public/config/request"

const ProjectStatistics:React.FC = () => {
    const thisHostName = window.location.hostname === "localhost" ? "10.6.1.36" : window.location.hostname;

    const baseUrl = `${document.location.protocol}//${thisHostName}`;

    const port = window.location.hostname === "localhost" ? "21525" : document.location.port;

    const areaStatisticsUrl = ipArray.includes(thisHostName) ? `${baseUrl}:8029/index.html` : `${baseUrl}:${port}/chart/index.html`;

    return (
       
            <iframe width="100%" height="100%" src={areaStatisticsUrl}></iframe>
        
    )
}

export default ProjectStatistics