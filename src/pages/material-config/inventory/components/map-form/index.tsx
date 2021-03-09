import GeneralTable from "@/components/general-table";
import TableSearch from "@/components/table-search";
import React from "react";

import { Input } from "antd";

import styles from "./index.less";

const { Search } = Input;

const MapForm: React.FC = () => {

    const resourceLibColumns = [
        {}
    ]

    const resourceLibSearch = () => {
        return (
            <TableSearch width="208px">
                <Search
                    placeholder="物料编号/名称"
                    enterButton

                />
            </TableSearch>
        )
    }

    return (

        <div className={styles.mapForm}>
            <div className={styles.resourceTable}>
                <GeneralTable columns={resourceLibColumns} buttonLeftContentSlot={resourceLibSearch} url="/Material/GetPageList" requestSource="resource" tableTitle="资源库列表" />
            </div>
            <div className={styles.resultTable}>
                <div className={styles.currentMapTable}>

                </div>
                <div className={styles.inventoryTable}>

                </div>
            </div>
        </div>

    )
}

export default MapForm