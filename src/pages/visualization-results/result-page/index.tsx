import React from "react"
import {visualUrl} from "../../../../public/config/request"

const VisualizationResults:React.FC = () => {
    return (
        <iframe width="100%" height="100%" src={`${visualUrl}?token=${localStorage.getItem("Authorization")}`}></iframe>
    )
}

export default VisualizationResults;