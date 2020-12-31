import React from "react";
import GeneralTable from "@/components/general-table"

const Index:React.FC = () => {
    return (
        <div>
            <GeneralTable requestUrl="/api/WareHouse/GetPageListAsync" />
        </div>
    )
}

export default Index