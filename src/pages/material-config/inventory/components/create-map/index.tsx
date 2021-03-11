import { getAreaList, getHasMapData, getResourceLibId, saveMapData } from "@/services/material-config/inventory";
import { useControllableValue, useRequest } from "ahooks";
import { Modal, Input, Button, Select, Table, message } from "antd"
import React, { useMemo, useRef, useState } from "react"
import { SetStateAction } from "react";
import { Dispatch } from "react";
import styles from "./index.less";
import GeneralTable from "@/components/general-table";
import TableSearch from "@/components/table-search";
import CommonTitle from "@/components/common-title";
import EmptyTip from "@/components/empty-tip";

interface CreateMapProps {
    inventoryOverviewId: string;
    visible: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
    changeFinishEvent?: () => void;
}

const { Search } = Input;

const CreateMap: React.FC<CreateMapProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
    const [activeMaterialId, setActiveMaterialId] = useState<string>("");
    const [activeInventoryAreaId, setActiveInventoryAreaId] = useState<string>("-1");
    const [activeHasMapAreaId, setActiveHasMapAreaId] = useState<string>("-1");
    const [hasMapTableShowData, setHasMapTableShowData] = useState<any[]>([]);
    const [inventorySelectArray, setInventorySelectArray] = useState<any[]>([]);
    const [mapTableSelectArray , setMapTableSelectArray] = useState<any[]>([]);

    const resourceTableRef = useRef<HTMLDivElement>(null);
    const inventoryTableRef = useRef<HTMLDivElement>(null);
    const { inventoryOverviewId = '' } = props;

    const { data: resourceData } = useRequest(() => getResourceLibId(inventoryOverviewId), {
        ready: !!inventoryOverviewId,
        refreshDeps: [inventoryOverviewId]
    })

    const { data: areaList = [] } = useRequest(() => getAreaList(inventoryOverviewId), { ready: !!inventoryOverviewId, refreshDeps: [inventoryOverviewId] });
    const { data: hasMapData = [], run: getMapData} = useRequest(() => getHasMapData({ inventoryOverviewId, materialId: activeMaterialId, area: activeHasMapAreaId }),
        {
            ready: !!inventoryOverviewId, refreshDeps: [inventoryOverviewId, activeMaterialId, activeHasMapAreaId], onSuccess: () => {
                setHasMapTableShowData(hasMapData)
            }
        });

    const areaOptions = useMemo(() => {
        return areaList.map((item) => ({
            label: item === "" ? "无" : item,
            value: item
        }))
    }, [JSON.stringify(areaList)])

    const resourceLibColumns = [
        {
            dataIndex: 'materialId',
            index: 'materialId',
            title: '编号',
            width: 180,
        },
        {
            dataIndex: 'category',
            index: 'category',
            title: '类型',
            width: 180,
        },
        {
            dataIndex: 'materialName',
            index: 'materialName',
            title: '名称',
            width: 320,
        },
        {
            dataIndex: 'spec',
            index: 'spec',
            title: '规格型号',
            width: 320,
        },
        {
            dataIndex: 'unit',
            index: 'unit',
            title: '单位',
            width: 140,
        },
        {
            dataIndex: 'pieceWeight',
            index: 'pieceWeight',
            title: '单重(kg)',
            width: 180,
        },
        {
            dataIndex: 'unitPrice',
            index: 'unitPrice',
            title: '单价(元)',
            width: 180,
        },

        {
            dataIndex: 'materialType',
            index: 'materialType',
            title: '类别',
            width: 180,
        },
    ];

    const inventoryTableColumns = [
        {
            dataIndex: 'materialCode',
            index: 'materialCode',
            title: '物料编号',
            width: 180,
        },
        {
            dataIndex: 'materialName',
            index: 'materialName',
            title: '物料描述',
            width: 180,
        },
        {
            dataIndex: 'orderPrice',
            index: 'orderPrice',
            title: '订单净价',
            width: 80,
        },
        {
            dataIndex: 'area',
            index: 'area',
            title: '区域',
            width: 80,
        },
        {
            dataIndex: 'demandCompany',
            index: 'demandCompany',
            title: '需求公司',
            width: 140,
        },
        {
            dataIndex: 'measurementUnit',
            index: 'measurementUnit',
            title: '计量单位',
            width: 80,
        },
    ];

    const hasMapTableColumns = [
        {
            dataIndex: 'materialCode',
            index: 'materialCode',
            title: '物料编号',
            width: 180,
        },
        {
            dataIndex: 'materialName',
            index: 'materialName',
            title: '物料描述',
            width: 180,
        },
        {
            dataIndex: 'orderPrice',
            index: 'orderPrice',
            title: '订单净价',
            width: 80,
        },
        {
            dataIndex: 'area',
            index: 'area',
            title: '区域',
            width: 80,
        },
        {
            dataIndex: 'demandCompany',
            index: 'demandCompany',
            title: '需求公司',
            width: 140,
        },
        {
            dataIndex: 'measurementUnit',
            index: 'measurementUnit',
            title: '计量单位',
            width: 80,
        },
        {
            dataIndex: 'func',
            index: 'func',
            title: '创建方式',
            width: 80,
        },
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

    const inventoryTableSearch = () => {
        return (
            <div className="flex">
                <TableSearch width="208px">
                    <Search
                        placeholder="物料编号/需求公司"
                        enterButton

                    />
                </TableSearch>
                <TableSearch width="128px">
                    <Select options={areaOptions} placeholder="区域" value={activeInventoryAreaId} onChange={(value) => inventoryTableSelectChange(value as string)} style={{ width: "100%" }} />
                </TableSearch>
            </div>
        )
    }

    const inventoryTableAddButton = () => {
        return (
            <Button type="primary" onClick={() => addEvent()}>
                添加
            </Button>
        )
    }

    const hasMapTableSearch = () => {
        return (
            <div className="flex">
                <TableSearch width="208px">
                    <Search
                        placeholder="物料编号/需求公司"
                        enterButton
                    />
                </TableSearch>
                <TableSearch width="128px">
                    <Select options={areaOptions} value={activeHasMapAreaId} onChange={(value) => setActiveHasMapAreaId(value as string)} placeholder="区域" style={{ width: "100%" }} />
                </TableSearch>
            </div>
        )
    }

    const inventoryTableSelectChange = (value: string) => {
        setActiveInventoryAreaId(value as string)
        if (inventoryTableRef && inventoryTableRef.current) {
            // @ts-ignore
            inventoryTableRef.current.refresh();
        }
    }

    const resourceTableChangeEvent = (data: any) => {
        if (data && data.length > 0) {
            setActiveMaterialId(data[0].id);
            if (inventoryTableRef && inventoryTableRef.current) {
                // @ts-ignore
                inventoryTableRef.current.searchByParams({
                    materialId: data[0].id,
                    inventoryOverviewId,
                    area: activeInventoryAreaId
                });
            }
        }
    }

    const addEvent = () => {
        const copyData = [...inventorySelectArray];
        const copyHasMapData = [...hasMapData];

        copyData.forEach((item) => {
            if (copyHasMapData.findIndex((ite) => ite.id === item.id) === -1) {
                copyHasMapData.push({ ...item, type: "add" })
            }
        })

        setHasMapTableShowData(copyHasMapData)
    }

    const removeEvent = () => {
        const copyArrayIds = [...mapTableSelectArray];
        const copyHasData = [...hasMapTableShowData];

        const newArray = copyHasData.filter((item) => !copyArrayIds.includes(item.id));

        setHasMapTableShowData(newArray)
    }

    const hasMapSelection = {
        onChange: (values: any[], selectedRows: any[]) => {
            setMapTableSelectArray(selectedRows.map((item) => item["id"]));
        },
    };

    const saveEvent = async () => {
        // 相比之前的数据，多出来的是增加的， 少的就是减少的
        const copyHasMapData = [...hasMapData];
        const copyHasShowMapData = [...hasMapTableShowData];

        const checkedIdList = copyHasShowMapData.filter((item) => copyHasMapData.findIndex((ite) => item.id === ite.id) === -1).map((item) => item.id);
        const uncheckedIdList = copyHasMapData.filter((item) => copyHasShowMapData.findIndex((ite) => item.id === ite.id) === -1).map((item) => item.id);

        await saveMapData({
            inventoryOverviewId,
            materialId: activeMaterialId,
            checkedIdList,
            uncheckedIdList
        })
        message.success("信息保存成功");
        getMapData();
    }

    return (
        <Modal title="创建映射" visible={state as boolean} bodyStyle={{ padding: "0px 10px 10px 10px", height: "880px", overflowY: "auto", backgroundColor: "#F7F7F7" }} width="90%" destroyOnClose footer={[
            <Button key="cancle" onClick={() => setState(false)}>
                取消
            </Button>,
            <Button key="save" type="primary" onClick={() => saveEvent()}>
                保存
            </Button>
        ]} onCancel={() => setState(false)}>
            <div className={styles.mapForm}>
                <div className={styles.resourceTable}>
                    {
                        resourceData?.resourceLibId &&
                        <GeneralTable ref={resourceTableRef} defaultPageSize={20} getSelectData={resourceTableChangeEvent} columns={resourceLibColumns} extractParams={{ resourceLibId: resourceData?.resourceLibId }} buttonLeftContentSlot={resourceLibSearch} url="/Material/GetPageList" requestSource="resource" tableTitle="资源库列表" />
                    }
                </div>
                <div className={styles.resultTable}>
                    <div className={styles.currentMapTable}>
                        <div className={styles.currentMapTableButtonContent}>
                            <div className="flex1">
                                {hasMapTableSearch()}
                            </div>
                            <div>
                                <Button onClick={() => removeEvent()}>
                                    移除
                                </Button>
                            </div>
                        </div>
                        <div className={styles.currentMapTableTitle}>
                            <CommonTitle>当前映射关系</CommonTitle>
                        </div>
                        <div className={styles.currentMapTableContent}>
                            <Table locale={{
                                emptyText: <EmptyTip className="pt20 pb20" />,
                            }}
                                dataSource={hasMapTableShowData}
                                bordered={true}
                                rowKey={"id"}
                                pagination={false}
                                rowSelection={{
                                    type: "checkbox",
                                    columnWidth: '38px',
                                    selectedRowKeys: mapTableSelectArray,
                                    ...hasMapSelection
                                }}
                                columns={hasMapTableColumns} />
                        </div>
                    </div>
                    <div className={styles.inventoryTable}>
                        <GeneralTable ref={inventoryTableRef} getSelectData={(data) => setInventorySelectArray(data)} buttonRightContentSlot={inventoryTableAddButton} type="checkbox" columns={inventoryTableColumns} buttonLeftContentSlot={inventoryTableSearch} url="/Inventory/GetMappingInventoryList" requestSource="resource" extractParams={{ inventoryOverviewId: inventoryOverviewId, area: activeInventoryAreaId, materialId: activeMaterialId }} tableTitle="协议库存表" />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CreateMap;
