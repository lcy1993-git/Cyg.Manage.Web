import CyTag from '@/components/cy-tag';
import ReadonlyItem from '@/components/readonly-item';
import moment from 'moment';
import uuid from 'node-uuid';
import React from 'react';

import styles from './index.less';

interface ProjectBaseInfoProps {
    projectInfo: any;
}

const ProjectBaseInfo: React.FC<ProjectBaseInfoProps> = (props) => {
    const { projectInfo } = props;
    const tagElement = (projectInfo?.identitys ?? [])
        .filter((item: any) => item.text)
        .map((item: any) => {
            return (
                <CyTag className="mr7" key={uuid.v1()}>
                    {item.text}
                </CyTag>
            );
        });

    const natureElement = (projectInfo?.natures ?? []).map((item: any) => {
        return (
            <CyTag className="mr7" key={uuid.v1()}>
                {item.text}
            </CyTag>
        );
    });

    return (
        <div className={styles.projectBaseInfo}>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目名称" labelWidth={100}>
                        {projectInfo?.name}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="立项日期" labelWidth={100}>
                        {projectInfo?.createdOn
                            ? moment(projectInfo?.createdOn).format('YYYY-MM-DD HH:mm:ss')
                            : ''}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="状态" labelWidth={100}>
                        {projectInfo?.stateInfo.showStatusText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="身份" labelWidth={100}>
                        {tagElement}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="分类" labelWidth={100}>
                        {projectInfo?.categoryText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="立项组织" labelWidth={100}>
                        {projectInfo?.createdCompanyName}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="勘察评审状态" labelWidth={100}>
                        {projectInfo?.stateInfo?.isResetSurvey ? '已评审' : '未评审'}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="电压等级" labelWidth={100}>
                        {projectInfo?.kvLevelText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="类型" labelWidth={100}>
                        {projectInfo?.pTypeText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="项目性质" labelWidth={100}>
                        {natureElement}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="总投资(万元)" labelWidth={100}>
                        {projectInfo?.totalInvest}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="专业类别" labelWidth={100}>
                        {projectInfo?.majorCategoryText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目日期" labelWidth={100}>
                        {projectInfo?.startTime ? moment(projectInfo?.startTime).format('YYYY-MM-DD') : ''}至
                        {projectInfo?.endTime ? moment(projectInfo?.endTime).format('YYYY-MM-DD') : ''}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="资产性质" labelWidth={100}>
                        {projectInfo?.assetsNatureText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="改造原因" labelWidth={100}>
                        {projectInfo?.reformCauseText}
                    </ReadonlyItem>
                </div>

                <div className="flex1">
                    <ReadonlyItem label="跨年项目" labelWidth={100}>
                        {projectInfo?.isAcrossYear ? '是' : '否'}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="供电所/班组" labelWidth={100}>
                        {projectInfo?.powerSupplyText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="改造目的" labelWidth={100}>
                        {projectInfo?.reformAimText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="资产所属单位" labelWidth={100}>
                        {projectInfo?.assetsOrganization}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="所属市公司" labelWidth={100}>
                        {projectInfo?.cityCompany ? projectInfo?.cityCompany : '无'}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="区域属性" labelWidth={100}>
                        {projectInfo?.regionAttributeText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="建筑类型" labelWidth={100}>
                        {projectInfo?.constructTypeText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="所属县公司" labelWidth={100}>
                        {projectInfo?.countyCompany ? projectInfo?.countyCompany : '无'}
                    </ReadonlyItem>
                </div>

                <div className="flex1">
                    <ReadonlyItem label="项目阶段" labelWidth={100}>
                        {projectInfo?.stageText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目类别" labelWidth={100}>
                        {projectInfo?.pCategoryText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="项目属性" labelWidth={100}>
                        {projectInfo?.pAttributeText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="项目批次" labelWidth={100}>
                        {projectInfo?.batchText}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="气象区" labelWidth={100}>
                        {projectInfo?.meteorologicText}
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="交底范围" labelWidth={100}>
                        {projectInfo?.disclosureRange}
                        (米)
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="桩位范围(米)" labelWidth={100}>
                        {projectInfo?.pileRange}
                        (米)
                    </ReadonlyItem>
                </div>
            </div>
            <div className="flex">
                <div className="flex1">
                    <ReadonlyItem label="截止日期" labelWidth={100}>
                        {projectInfo?.deadline ? moment(projectInfo?.deadline).format('YYYY-MM-DD') : ''}
                    </ReadonlyItem>
                </div>
                <div className="flex1">
                    <ReadonlyItem label="现场数据来源" labelWidth={100}>
                        {projectInfo?.dataSourceTypeText}
                    </ReadonlyItem>
                </div>
            </div>
        </div>
    );
};

export default ProjectBaseInfo;
