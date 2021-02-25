import ReadonlyItem from "@/components/readonly-item";
import moment from "moment";
import React, { Dispatch, SetStateAction } from "react"

import styles from "./index.less"

interface ProjectBaseInfoProps {
    projectInfo: any
}

const ProjectBaseInfo: React.FC<ProjectBaseInfoProps> = (props) => {

    const { projectInfo } = props;

    return (
        <div className={styles.projectBaseInfo}>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目名称" labelWidth={100}>
                        {
                            projectInfo?.name
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="立项日期" labelWidth={100}>
                        {
                            projectInfo?.createdOn ? moment(projectInfo?.createdOn).format("YYYY-MM-DD") : ""
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="状态" labelWidth={100}>
                        {
                            projectInfo?.stateInfo.showStatusText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="身份" labelWidth={100}>
                        {
                            projectInfo?.libName
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="分类" labelWidth={100}>
                        {
                            projectInfo?.categoryText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="立项组织" labelWidth={100}>
                        {
                            projectInfo?.createdCompanyName
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="勘察评审状态" labelWidth={100}> 
                        {
                            projectInfo?.name
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="勘察评审状态" labelWidth={100}>
                        {
                            projectInfo?.libName
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="电压等级" labelWidth={100}>
                        {
                            projectInfo?.kvLevelText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="类型" labelWidth={100}>
                        {
                            projectInfo?.pTypeText
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目性质" labelWidth={100}>
                        {
                            projectInfo?.natures
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="总投资(万元)" labelWidth={100}>
                        {
                            projectInfo?.totalInvest
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="专业类别" labelWidth={100}>
                        {
                            projectInfo?.majorCategoryText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="项目日期" labelWidth={100}>
                        {
                            projectInfo?.startTime
                        }
                        -
                        {
                            projectInfo?.endTime
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="资产性质" labelWidth={100}>
                        {
                            projectInfo?.assetsNatureText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="改造原因" labelWidth={100}>
                        {
                            projectInfo?.reformCauseText
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="跨年项目" labelWidth={100}>
                        {
                            projectInfo?.isAcrossYear
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="供电所/班组" labelWidth={100}>
                        {
                            projectInfo?.powerSupply
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="改造目的" labelWidth={100}>
                        {
                            projectInfo?.reformAimText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="资产所属单位" labelWidth={100}>
                        {
                            projectInfo?.assetsOrganization
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="所属市公司" labelWidth={100}>
                        {
                            projectInfo?.cityCompany
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="区域属性" labelWidth={100}>
                        {
                            projectInfo?.regionAttribute
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="建筑类型" labelWidth={100}>
                        {
                            projectInfo?.constructType
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="所属县公司" labelWidth={100}>
                        {
                            projectInfo?.countyCompany
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目阶段" labelWidth={100}>
                        {
                            projectInfo?.stageText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="项目类别" labelWidth={100}>
                        {
                            projectInfo?.majorCategoryText
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目属性" labelWidth={100}>
                        {
                            projectInfo?.pAttributeText
                        }
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="项目批次" labelWidth={100}>
                        {
                            projectInfo?.batchText
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="交底范围" labelWidth={100}>
                        {
                            projectInfo?.disclosureRange
                        }
                        (米)
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="气象区" labelWidth={100}>
                        {
                            projectInfo?.meteorologicText
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="桩位范围(米)" labelWidth={100}>
                        {
                            projectInfo?.pileRange
                        }
                        (米)
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="截止日期" labelWidth={100}>
                        {
                            projectInfo?.deadline
                        }
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="现场数据来源" labelWidth={100}>
                        {
                            projectInfo?.dataSourceTypeText
                        }
                    </ReadonlyItem>
                </div>
            </div>
        </div>
    )
}

export default ProjectBaseInfo