import React, { useCallback, useEffect, useState } from "react"
import CyFormItem from "@/components/cy-form-item"
import { DatePicker, Input } from "antd"
import EnumSelect from "@/components/enum-select"
import { FormImportantLevel, ProjectLevel } from "@/services/project-management/all-project"

import Rule from "./engineer-form-rule"
import { useGetSelectData } from "@/utils/hooks"
import DataSelect from "@/components/data-select"

interface CreateEngineerForm {
    exportDataChange?: (exportData: any) => void,
    areaId?: string
    libId?: string
    form?: any
}

const CreateEngineerForm: React.FC<CreateEngineerForm> = (props) => {
    const { exportDataChange, areaId: province, libId: inputLibId, form } = props;

    const [areaId, setAreaId] = useState<string>("");
    const [libId, setLibId] = useState<string>("");

    const { data: areaSelectData = []} = useGetSelectData({ url: "/Area/GetList", extraParams: { pId: "-1" } });
    const { data: libSelectData = []} = useGetSelectData({ url: "/ResourceLibrary/GetList", extraParams: { pId: "-1" } });
    const { data: inventoryOverviewSelectData = []} = useGetSelectData({ url: "/InventoryOverview/GetList", extraParams: { libId: libId } }, { ready: !!libId, refreshDeps: [libId] });
    const { data: warehouseSelectData = []} = useGetSelectData({ url: "/WarehouseOverview/GetList", extraParams: { areaId: areaId } }, { ready: !!areaId, refreshDeps: [areaId] });
    const { data: companySelectData = []} = useGetSelectData({ url: "/ElectricityCompany/GetListByAreaId", extraParams: { areaId: areaId },titleKey:"text",valueKey: "text" }, { ready: !!areaId, refreshDeps: [areaId] });

    const valueChangeEvenet = useCallback(
        (prevValues: any, curValues: any) => {
            if (prevValues.province !== curValues.province) {
                setAreaId(curValues.province)
                exportDataChange?.({
                    areaId: curValues.province,
                    company: curValues.company,
                    companyName: companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? ""
                })
                // 因为发生了改变，所以之前选择的应该重置
                // if (form) {
                //     const warehouseId = curValues.warehouseId;
                //     const company = curValues.company;
                    
                //     const hasWarehouseId = warehouseSelectData.findIndex((item: any) => item.value === warehouseId)
                //     const hasCompany = companySelectData.findIndex((item: any) => item.value === company)
    
                //     if(hasWarehouseId === -1) {
                //         form.setFieldsValue({
                //             warehouseId: undefined
                //         })
                //     }
    
                //     if(hasCompany === -1) {
                //         form.setFieldsValue({
                //             company: undefined
                //         })
                //     }
                // }
            }
            if (prevValues.libId !== curValues.libId) {
                setLibId(curValues.libId)
                // if (form) {
                //     const inventoryOverviewId = curValues.inventoryOverviewId;
    
                //     const hasInventoryOverviewId = inventoryOverviewSelectData.findIndex((item: any) => item.value === inventoryOverviewId);
    
                //     if(hasInventoryOverviewId === -1) {
                //         form.setFieldsValue({
                //             inventoryOverviewId: undefined,
                //         })
                //     }
                // }
            }
            if (prevValues.company !== curValues.company) {
                exportDataChange?.({
                    areaId: curValues.province,
                    company: curValues.company,
                    companyName: companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? ""
                })
            }
            return false
        },
        [],
    )

    useEffect(() => {
        if (province) {
            setAreaId(province)
        }
        if (inputLibId) {
            setLibId(inputLibId)
        }
    }, [province, inputLibId])


    return (
        <>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="工程名称" name="name" labelWidth={120} align="right" rules={Rule.required} required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="区域" name="province" labelWidth={120} align="right" required rules={Rule.required}>
                        <DataSelect placeholder="请选择" options={areaSelectData} />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="资源库" name="libId" labelWidth={120} align="right" required rules={Rule.required}>
                        <DataSelect placeholder="请选择" options={libSelectData} />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="协议库存" name="inventoryOverviewId" labelWidth={120} align="right" required rules={Rule.required}>
                        <DataSelect options={inventoryOverviewSelectData} placeholder="请先选择资源库" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="利旧库存协议" name="warehouseId" labelWidth={120} align="right" required>
                        <DataSelect options={warehouseSelectData} placeholder="请先选择区域" />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem shouldUpdate={valueChangeEvenet} label="编制人" name="compiler" labelWidth={120} align="right" required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex ">
                <div className="flex1 flowHidden">
                    <CyFormItem label="编辑时间" name="compileTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="编制单位" name="organization" labelWidth={120} align="right" required rules={Rule.required}>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="工程开始时间" name="startTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="工程结束时间" name="endTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="所属公司" name="company" labelWidth={120} align="right" required rules={Rule.required}>

                        <DataSelect options={companySelectData} placeholder="请先选择区域" />

                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="重要程度" name="importance" labelWidth={120} align="right" initialValue={"1"} required rules={Rule.required}>
                        <EnumSelect placeholder="请选择" enumList={FormImportantLevel} />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 flowHidden">
                    <CyFormItem label="计划年度" name="plannedYear" labelWidth={120} align="right" required rules={Rule.required}>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1 flowHidden">
                    <CyFormItem label="项目级别" name="grade" labelWidth={120} align="right" initialValue={"1"} required rules={Rule.required}>
                        <EnumSelect placeholder="请选择" enumList={ProjectLevel} />
                    </CyFormItem>
                </div>
            </div>
        </>
    )
}

export default CreateEngineerForm