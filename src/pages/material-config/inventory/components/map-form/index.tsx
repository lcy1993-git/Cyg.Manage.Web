import GeneralTable from "@/components/general-table";
import React, { useReducer } from "react"

import {MapFormContext,mapFormReducer,defaultState} from "./context";

import styles from "./index.less";

const MapForm:React.FC = () => {
    const [state, dispatch] = useReducer(mapFormReducer, defaultState);

    const resourceLibColumns = [
        {}
    ]

    return (
        <MapFormContext.Provider value={{state, dispatch: dispatch}}>
            <div className={styles.mapForm}>
                <div className={styles.resourceTable}>
                    <GeneralTable columns={resourceLibColumns} url="/Material/GetPageList" requestSource="resource" tableTitle="资源库列表" />
                </div>
                <div className={styles.resultTable}>
                    <div className={styles.currentMapTable}>
                        <GeneralTable columns={resourceLibColumns} url="/Inventory/GetHasMappingInventoryList" requestSource="resource" tableTitle="当前映射关系" />
                    </div>
                    <div className={styles.inventoryTable}>
                        <GeneralTable columns={resourceLibColumns} url="/Inventory/GetMappingInventoryList" requestSource="resource" tableTitle="协议库表" />
                    </div>
                </div>
            </div>
        </MapFormContext.Provider>
    )
}

export default MapForm