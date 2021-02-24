import React from "react"

const VisualizationResults:React.FC = () => {
    return (
        <iframe width="100%" height="100%" src={`http://10.6.1.36:8021/index.html?token=${localStorage.getItem("Authorization")}`}></iframe>
    )
}

export default VisualizationResults