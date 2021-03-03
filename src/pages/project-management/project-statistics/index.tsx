import React from "react"
import {areaStatisticsUrl} from "../../../../public/config/request"

const ProjectStatistics:React.FC = () => {
    return (
       
            <iframe width="100%" height="100%" src={areaStatisticsUrl}></iframe>
        
    )
}

export default ProjectStatistics