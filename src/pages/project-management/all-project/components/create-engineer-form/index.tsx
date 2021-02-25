import React, { useState } from "react"
import CyFormItem from "@/components/cy-form-item"
import { DatePicker, Input } from "antd"
import UrlSelect from "@/components/url-select"
import EnumSelect from "@/components/enum-select"
import { FormImportantLevel, ProjectLevel } from "@/services/project-management/all-project"

import Rule from "./engineer-form-rule"

interface CreateEngineerForm {
    exportDataChange?: (exportData: any) => void
}

const CreateEngineerForm: React.FC<CreateEngineerForm> = (props) => {
    const {exportDataChange} = props;

    const [areaId,SetAreaId] = useState<string>("");
    const [libId, setLibId] = useState<string>("");

    const valueChangeEvenet = (prevValues: any, curValues: any): boolean => {
    
        if(prevValues.province !== curValues.province) {
            SetAreaId(curValues.province)
            exportDataChange?.({
                areaId: curValues.province,
                company: curValues.company
            })
        }
        if(prevValues.libId !== curValues.libId) {
            setLibId(curValues.libId)
        }
        if(prevValues.company !== curValues.company) {
            exportDataChange?.({
                areaId: curValues.province,
                company: curValues.company
            })
        }
        return false
    }

    return (
        <>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="工程名称" name="name" labelWidth={120} align="right" rules={Rule.required} required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="区域" name="province" labelWidth={120} align="right" required rules={Rule.required}>
                        <UrlSelect placeholder="请选择" url="/Area/GetList" extraParams={{ pId: "-1" }} titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 ">
                    <CyFormItem label="资源库" name="libId" labelWidth={120} align="right" required rules={Rule.required}>
                        <UrlSelect placeholder="请选择" url="/ResourceLibrary/GetList" extraParams={{ pId: "-1" }} titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="协议库存" name="inventoryOverviewId" labelWidth={120} align="right" required rules={Rule.required}>
                        <UrlSelect url="/InventoryOverview/GetList" placeholder="请先选择资源库" extraParams={{ libId: libId }} paramsMust={["libId"]} titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="利旧库存协议" name="warehouseId" labelWidth={120} align="right" required>
                        <UrlSelect url="/WarehouseOverview/GetList" placeholder="请先选择区域" extraParams={{ areaId: areaId }} paramsMust={["areaId"]} titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem shouldUpdate={valueChangeEvenet} label="编制人" name="compiler" labelWidth={120} align="right" required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex ">
                <div className="flex1">
                    <CyFormItem label="编辑时间" name="compileTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="编制单位" name="organization" labelWidth={120} align="right" required rules={Rule.required}>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 ">
                    <CyFormItem label="工程开始时间" name="startTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="工程结束时间" name="endTime" labelWidth={120} align="right" required rules={Rule.required}>
                        <DatePicker />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1 ">
                    <CyFormItem label="所属公司" name="company" labelWidth={120} align="right" required rules={Rule.required}>
                        <UrlSelect url="/ElectricityCompany/GetListByAreaId" placeholder="请先选择区域" extraParams={{ areaId: areaId }} paramsMust={["areaId"]} titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="重要程度" name="importance" labelWidth={120} align="right" initialValue={"1"} required rules={Rule.required}>
                        <EnumSelect placeholder="请选择" enumList={FormImportantLevel}  />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="计划年度" name="plannedYear" labelWidth={120} align="right" required rules={Rule.required}>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目级别" name="grade" labelWidth={120} align="right" initialValue={"1"} required rules={Rule.required}>
                        <EnumSelect placeholder="请选择" enumList={ProjectLevel}  />
                    </CyFormItem>
                </div>
            </div>
        </>
    )
}

export default CreateEngineerForm