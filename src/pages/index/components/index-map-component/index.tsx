import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import MapChartComponent from "../map-chart-component";

interface IndexMapComponentProps {
    componentProps?: string[]
}

const IndexMapComponent:React.FC<IndexMapComponentProps> = (props) => {
    const {setCurrentAreaInfo} = useContext(IndexContext);

    return (
        <>
            <MapChartComponent setCurrentAreaInfo={setCurrentAreaInfo} {...props} />
        </>
    )
}

export default IndexMapComponent