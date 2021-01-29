import GeneralTable from "@/components/general-table";
import PageCommonWrap from "@/components/page-common-wrap";
import TableSearch from "@/components/table-search";
import { Input, Button } from "antd";
import React, { useState } from "react";

import styles from "./index.less";

const { Search } = Input;

interface RouteListItem {
    name: string,
    id: string,
}

const DictionaryManage: React.FC = () => {
    const tableRef = React.useRef<HTMLDivElement>(null);

    const [searchKeyWord, setSearchKeyWord] = useState<string>("");
    const [routeList, setRouteList] = useState<RouteListItem[]>([
        {
            name: "根目录",
            id: ""
        }
    ]);


    const searchComponent = () => {
        return (
            <TableSearch label="关键词" width="203px">
                <Search value={searchKeyWord} onChange={(e) => setSearchKeyWord(e.target.value)} onSearch={() => tableSearchEvent()} enterButton placeholder="键名" />
            </TableSearch>
        )
    }

    const tableSearchEvent = () => {
        search({
            keyWord: searchKeyWord,
        })
    }

    // 列表刷新
    const refresh = () => {
        if (tableRef && tableRef.current) {
            // @ts-ignore
            tableRef.current.refresh();
        }
    }

    // 列表搜索
    const search = (params: object) => {
        if (tableRef && tableRef.current) {
            // @ts-ignore
            tableRef.current.search(params);
        }
    }

    const keyCellClickEvent = (id: string, name: string) => {
        const copyRouteList = [...routeList];
        copyRouteList.push(
            {
                name,
                id
            }
        )
        setRouteList(copyRouteList);
        setSearchKeyWord("");
        search({
            keyWord: "",
            parentId: id
        })
    }

    const columns = [
        {
            dataIndex: "key",
            index: "key",
            title: "键",
            width: 120,
            render: (text: string, record: any) => {
                return (
                    <span className={styles.dictionaryKeyCell} onClick={() => keyCellClickEvent(record.id ,record.key)}>
                        {record.key}
                    </span>
                )
            }
        },
        {
            dataIndex: "value",
            index: "value",
            title: "值",
            width: 360
        },
        {
            dataIndex: "extensionColumn",
            index: "extensionColumn",
            title: "扩展列",
            width: 180
        },
        {
            dataIndex: "sort",
            index: "sort",
            title: "排序",
            width: 80
        },
        {
            dataIndex: "isDisable",
            index: "isDisable",
            title: "状态",
            width: 100
        },
        {
            dataIndex: "remark",
            index: "remark",
            title: "描述",
        },
    ]

    const tableElement = () => {
        return (
            <>
                <Button type="primary" className="mr7">添加</Button>
                <Button className="mr7">编辑</Button>
                <Button className="mr7">删除</Button>
                <Button className="mr7">导入</Button>
                <Button>导出</Button>
            </>
        )
    }

    const routeItemClickEvent = (id: string, name: string) => {
        const copyRouteList = [...routeList];
        const currentDataIndex = copyRouteList.findIndex((item) => item.id === id);

        if(currentDataIndex !== copyRouteList.length) {
            copyRouteList.splice(currentDataIndex + 1,copyRouteList.length);    
        }
        setRouteList(copyRouteList);
        setSearchKeyWord("");
        search({
            keyWord: "",
            parentId: id
        })
    }

    const routeElement = routeList.map((item) => {
        return (
            <div key={item.id} className={styles.routeItem} onClick={() => routeItemClickEvent(item.id,item.name)}>
                {item.name}/
            </div>
        )
    })

    const titleSlotElement = () => {
        return (
            <div className={styles.routeComponent}>
                <span>/</span>
                {routeElement}
            </div>
        )
    }

    return (
        <PageCommonWrap>
            <GeneralTable
                ref={tableRef}
                titleSlot={titleSlotElement}
                buttonLeftContentSlot={searchComponent}
                buttonRightContentSlot={tableElement}
                needCommonButton={true}
                columns={columns}
                url="/Dictionary/GetPagedList"
                tableTitle="系统字典"
            />
        </PageCommonWrap>
    )
}

export default DictionaryManage