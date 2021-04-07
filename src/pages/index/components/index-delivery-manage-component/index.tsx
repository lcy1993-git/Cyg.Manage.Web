import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import DeliveyManage from "../delivery-manage";

interface IndexToDoComponentProps {
    componentProps?: string[]
}

const IndexToDoComponent:React.FC<IndexToDoComponentProps> = (props) => {
    const {currentAreaId,currentAreaLevel} = useContext(IndexContext);

    return (
        <>
            <DeliveyManage areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
        </>
    )
}

export default IndexToDoComponent