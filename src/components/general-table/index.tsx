import React from "react";
import { useRequest } from "umi";
import {tableCommonRequest} from "@/services/table"
import {Table,Pagination, message} from "antd"
import styles from "./index.less";

interface GeneralTableProps {
    requestUrl: string,
    rowClickEvent?: (record: any) => void
    extractParams?: object
    buttonLeftContent?: () => React.ReactNode

}

const withGeneralTable = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (props: P & GeneralTableProps) => {
    const {requestUrl,rowClickEvent,extractParams,buttonLeftContent, ...rest} = props;

    const {data, run} = useRequest(() => tableCommonRequest({url: requestUrl, extraParams: extractParams, PageIndex: 1, PageSize: 20}),{
        ready: !!requestUrl,
        refreshDeps: [JSON.stringify(extractParams)]
    });

    const refreshTable = () => {
        run();
        message.success("刷新成功");
    }

    const fullScreen = () => {

    }


    return (
        <div className={styles.cyGeneralTable}>
            <div className={styles.cyGeneralTableButtonContent}>
               <div>
                    {buttonLeftContent?.()}
               </div>
               <div className={styles.cyGeneralTableCommonButton}> 
                    <span>刷新</span>
                    <span>全屏</span>
                    <span>视图</span>
                    <span>设置</span>
               </div>
            </div>
            <WrapperComponent pagination={false} {...rest as unknown as P} />
            <div className={styles.cyGeneralTablePaging}>
                <Pagination defaultCurrent={1} total={500} />
            </div>
        </div>
    )
}

export default withGeneralTable(Table);