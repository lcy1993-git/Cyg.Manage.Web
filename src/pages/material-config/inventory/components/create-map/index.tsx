import { getResourceLibId } from "@/services/material-config/inventory";
import { useControllableValue, useRequest } from "ahooks";
import { Modal,Input,Button } from "antd"
import React, { useState } from "react"
import { SetStateAction } from "react";
import { Dispatch } from "react";
import styles from "./index.less";
import GeneralTable from "@/components/general-table";
import TableSearch from "@/components/table-search";
import { useGetSelectData } from "@/utils/hooks";

interface CreateMapProps {
    inventoryOverviewId: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent?: () => void
}

const { Search } = Input;

const CreateMap: React.FC<CreateMapProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    const { inventoryOverviewId = "" } = props;

    const {data: resourceData} = useRequest(() => getResourceLibId(inventoryOverviewId),{
        ready: !!inventoryOverviewId,
        refreshDeps: [inventoryOverviewId]
    })

    const {data: areaData} = useGetSelectData({url: "/Inventory/GetInventoryAreaList",extraParams: {inventoryOverviewId}},{ready: !!inventoryOverviewId, refreshDeps: [inventoryOverviewId]})

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
    ]

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
                    <Search
                        placeholder=""
                        enterButton
                    />
                </TableSearch>
            </div>
        )
    }

    return (
        <Modal title="创建映射" visible={state as boolean} bodyStyle={{ paddingTop: "0px", paddingBottom: "10px", height: "880px", overflowY: "auto", backgroundColor: "#F7F7F7"}} width="90%" destroyOnClose footer={[
            <Button key="cancle" onClick={() => setState(false)}>
                取消
            </Button>,
            <Button key="save" type="primary">
                保存
            </Button>,
        ]} onCancel={() => setState(false)}>
            <div className={styles.mapForm}>
                <div className={styles.resourceTable}>
                    {
                        resourceData?.resourceLibId &&
                        <GeneralTable defaultPageSize={20} columns={resourceLibColumns} extractParams={{ resourceLibId: resourceData?.resourceLibId }} buttonLeftContentSlot={resourceLibSearch} url="/Material/GetPageList" requestSource="resource" tableTitle="资源库列表" />
                    }
                </div>
                <div className={styles.resultTable}>
                    <div className={styles.currentMapTable}>
                    <GeneralTable columns={inventoryTableColumns} buttonLeftContentSlot={inventoryTableSearch} url="/Inventory/GetMappingInventoryList" requestSource="resource" extractParams={{ inventoryOverviewId: inventoryOverviewId,area: "-1",materialId: "1329753980238946305"}} tableTitle="协议库存表" />
                    </div>
                    <div className={styles.inventoryTable}>
                        <GeneralTable columns={inventoryTableColumns} buttonLeftContentSlot={inventoryTableSearch} url="/Inventory/GetMappingInventoryList" requestSource="resource" extractParams={{ inventoryOverviewId: inventoryOverviewId,area: "-1",materialId: "1329753980238946305"}} tableTitle="协议库存表" />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CreateMap