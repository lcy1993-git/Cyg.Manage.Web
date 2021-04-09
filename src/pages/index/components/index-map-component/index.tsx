import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import MapChartComponent from "../map-chart-component";

interface IndexMapComponentProps {
    componentProps?: string[]
}

const IndexMapComponent:React.FC<IndexMapComponentProps> = (props) => {
    const {currentAreaInfo,setCurrentAreaInfo} = useContext(IndexContext);

    return (
        <>
            <MapChartComponent currentAreaInfo={currentAreaInfo} setCurrentAreaInfo={setCurrentAreaInfo} {...props} />
        </>
    )
}

export default IndexMapComponent