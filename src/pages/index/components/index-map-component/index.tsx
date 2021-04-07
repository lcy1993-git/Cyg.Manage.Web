import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import MapChartComponent from "../map-chart-component";

interface IndexMapComponentProps {
    componentProps?: string[]
}

const IndexMapComponent:React.FC<IndexMapComponentProps> = (props) => {
    const {setCurrentAreaId,setCurrentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <MapChartComponent setCurrentAreaId={setCurrentAreaId} setCurrentAreaLevel={setCurrentAreaLevel} {...props} />
        </>
    )
}

export default IndexMapComponent