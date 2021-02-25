import CyFormItem from "@/components/cy-form-item"
import EnumSelect from "@/components/enum-select"
import UrlSelect from "@/components/url-select"
import { AssetsNature, Batch, BuildType, DataSourceType, MajorCategory, Meteorologic, PAttribute, ProjectCategory, ProjectFormType, ProjectNature, ProjectStage, ProjectType, ProjectVoltageClasses, ReformAim, ReformCause, RegionAttribute } from "@/services/project-management/all-project"
import { useUrlSelectData } from "@/utils/hooks"
import { DatePicker, Input, Select } from "antd"
import { isEmpty } from "lodash"
import React, { memo } from "react"


import Rule from "./project-form-rule"

interface CreateProjectFormProps {
    field?: any
    areaId?: string
    company?: string
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = (props) => {
    const {field = {},areaId,company} = props;
    console.log(areaId,company)
    return (
        <>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem {...field} label="项目名称" fieldKey={[field.fieldKey, 'name']} name={isEmpty(field) ? "name" : [field.name, 'name']} labelWidth={120} align="right" rules={Rule.required} required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目分类" fieldKey={[field.fieldKey, 'category']} initialValue={"1"} name={isEmpty(field) ? "category" : [field.name, 'category']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={ProjectCategory} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="项目类型" fieldKey={[field.fieldKey, 'pType']} initialValue={"1"} name={isEmpty(field) ? "pType" : [field.name, 'pType']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={ProjectFormType} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="电压等级" fieldKey={[field.fieldKey, 'kvLevel']} initialValue={"1"} name={isEmpty(field) ? "kvLevel" : [field.name, 'kvLevel']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={ProjectVoltageClasses} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="总投资(万元)" labelWidth={120} align="right" fieldKey={[field.fieldKey, 'totalInvest']} name={isEmpty(field) ? "totalInvest" : [field.name, 'totalInvest']}>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目性质" labelWidth={120} align="right" rules={Rule.required} fieldKey={[field.fieldKey, 'natures']} name={isEmpty(field) ? "natures" : [field.name, 'natures']} required>
                        <EnumSelect enumList={ProjectNature} mode="multiple" placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="项目开始日期" labelWidth={120} align="right" fieldKey={[field.fieldKey, 'startTime']} name={isEmpty(field) ? "startTime" : [field.name, 'startTime']}>
                        <DatePicker placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目结束日期" labelWidth={120} align="right" fieldKey={[field.fieldKey, 'endTime']} name={isEmpty(field) ? "endTime" : [field.name, 'endTime']}>
                        <DatePicker placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="资产性质" fieldKey={[field.fieldKey, 'assetsNature']} initialValue={"1"} name={isEmpty(field) ? "assetsNature" : [field.name, 'assetsNature']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={AssetsNature} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="专业类别" fieldKey={[field.fieldKey, 'majorCategory']} initialValue={"1"} name={isEmpty(field) ? "majorCategory" : [field.name, 'majorCategory']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={MajorCategory} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="是否跨年项目" fieldKey={[field.fieldKey, 'isAcrossYear']} initialValue={"false"} name={isEmpty(field) ? "isAcrossYear" : [field.name, 'isAcrossYear']} labelWidth={120} align="right" rules={Rule.required} required>
                        <Select placeholder="请选择">
                            <Select.Option value="true">是</Select.Option>
                            <Select.Option value="false">否</Select.Option>
                        </Select>
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="改造原因" initialValue={"1"} fieldKey={[field.fieldKey, 'reformCause']} name={isEmpty(field) ? "reformCause" : [field.name, 'reformCause']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={ReformCause} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="建设改造目的" initialValue={"1"} fieldKey={[field.fieldKey, 'reformAim']} name={isEmpty(field) ? "reformAim" : [field.name, 'reformAim']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={ReformAim} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="供电所/班组" fieldKey={[field.fieldKey, 'powerSupply']} name={isEmpty(field) ? "powerSupply" : [field.name, 'powerSupply']} labelWidth={120} align="right" required>
                        <UrlSelect url="/ElectricityCompany/GetPowerSupplys" extraParams={{areaId,company}} paramsMust={["areaId","company"]} requestType="post" placeholder="请选择" titleKey="text" valueKey="value" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="资产所属单位" fieldKey={[field.fieldKey, 'assetsOrganization']} name={isEmpty(field) ? "assetsOrganization" : [field.name, 'assetsOrganization']} labelWidth={120} align="right" rules={Rule.required} required>
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="所属市公司" fieldKey={[field.fieldKey, 'cityCompany']} name={isEmpty(field) ? "cityCompany" : [field.name, 'cityCompany']} labelWidth={120} align="right">
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="区域属性" initialValue={"1"} fieldKey={[field.fieldKey, 'regionAttribute']} name={isEmpty(field) ? "regionAttribute" : [field.name, 'regionAttribute']} labelWidth={120} align="right" rules={Rule.required} required>
                        <EnumSelect enumList={RegionAttribute} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="所属县公司" fieldKey={[field.fieldKey, 'countyCompany']} name={isEmpty(field) ? "countyCompany" : [field.name, 'countyCompany']} labelWidth={120} align="right">
                        <Input placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="建设类型" initialValue={"1"} fieldKey={[field.fieldKey, 'constructType']} name={isEmpty(field) ? "constructType" : [field.name, 'constructType']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={BuildType} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目类别" initialValue={"1"} fieldKey={[field.fieldKey, 'pCategory']} name={isEmpty(field) ? "pCategory" : [field.name, 'pCategory']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={ProjectType} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="项目阶段" initialValue={"1"} fieldKey={[field.fieldKey, 'stage']} name={isEmpty(field) ? "stage" : [field.name, 'stage']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={ProjectStage} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="项目批次" initialValue={"1"} fieldKey={[field.fieldKey, 'batch']} name={isEmpty(field) ? "batch" : [field.name, 'batch']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={Batch} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="项目属性" initialValue={"1"} fieldKey={[field.fieldKey, 'category']} name={isEmpty(field) ? "pAttribute" : [field.name, 'pAttribute']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={PAttribute} placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="气象区" initialValue={"1"} fieldKey={[field.fieldKey, 'category']} name={isEmpty(field) ? "meteorologic" : [field.name, 'meteorologic']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={Meteorologic} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="交底范围(米)" initialValue={"50"} fieldKey={[field.fieldKey, 'disclosureRange']} name={isEmpty(field) ? "disclosureRange" : [field.name, 'disclosureRange']} required labelWidth={120} align="right" rules={Rule.required}>
                        <Input type="number" placeholder="请输入" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="桩位范围(米)" initialValue={"50"} fieldKey={[field.fieldKey, 'pileRange']} name={isEmpty(field) ? "pileRange" : [field.name, 'pileRange']} required labelWidth={120} align="right" rules={Rule.required}>
                        <Input type="number" placeholder="请输入" />
                    </CyFormItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <CyFormItem label="截止日期" fieldKey={[field.fieldKey, 'deadline']} name={isEmpty(field) ? "deadline" : [field.name, 'deadline']} labelWidth={120} align="right">
                        <DatePicker placeholder="请选择" />
                    </CyFormItem>
                </div>
                <div className="flex1">
                    <CyFormItem label="现场数据来源" initialValue={"1"} fieldKey={[field.fieldKey, 'dataSourceType']} name={isEmpty(field) ? "dataSourceType" : [field.name, 'dataSourceType']} required labelWidth={120} align="right" rules={Rule.required}>
                        <EnumSelect enumList={DataSourceType} placeholder="请选择" />
                    </CyFormItem>
                </div>
            </div>
        </>
    )
}

export default memo(CreateProjectForm)