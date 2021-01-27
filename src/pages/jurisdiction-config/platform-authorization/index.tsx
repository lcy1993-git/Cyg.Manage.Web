import GeneralTable from "@/components/general-table";
import PageCommonWrap from "@/components/page-common-wrap";
import React from "react";

const PlatformAuthorization:React.FC = () => {

    const columns = [
        
    ]

    return (
        <PageCommonWrap>
            <GeneralTable
                url = "/AuthTemplate/GetPagedList"
                
            />
        </PageCommonWrap>
    )
}

export default PlatformAuthorization;