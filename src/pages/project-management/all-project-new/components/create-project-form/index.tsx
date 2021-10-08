import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import { getProjectInfo } from '@/services/project-management/all-project';
import { useGetProjectEnum } from '@/utils/hooks';
import { useMount, useRequest } from 'ahooks';
import { DatePicker, Input, InputNumber, Select } from 'antd';
import { isEmpty, isNumber } from 'lodash';
import moment, { Moment } from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { useMemo } from 'react';

import Rule from './project-form-rule';

interface CreateProjectFormProps {
  field?: any;
  areaId?: string;
  company?: string;
  companyName?: string;
  status?: number;
  projectId?: string;
  form?: any;
  engineerStart?: Moment;
  engineerEnd?: Moment;
  copyFlag?: number[];
  setCopyFlag?: (value: number[]) => void;
  index?: number;
  isInherit?: boolean;
  isEdit?: boolean;
  pointVisible?: boolean;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = (props) => {
  const {
    field = {},
    areaId,
    company,
    companyName,
    pointVisible,
    status,
    projectId,
    form,
    engineerStart,
    engineerEnd,
    copyFlag,
    index,
    isInherit = false,
    isEdit = false,
    setCopyFlag,
  } = props;

  const [startDate, setStartDate] = useState<Moment>();
  const [endDate, setEndDate] = useState<Moment>();
  const [dataSourceType, setDataSourceType] = useState<number>();
  const [disRangeValue] = useState<number>();
  const [pileRangeValue] = useState<number>();

  const { data: projectInfo, run } = useRequest(getProjectInfo, {
    onSuccess: () => {
      setStartDate(moment(projectInfo?.startTime));
      setEndDate(moment(projectInfo?.endTime));
    },
    manual: true,
  });

  useMount(() => {
    projectId && run(projectId);
  });

  const disableDate = (current: any) => {
    return current < moment('2010-01-01') || current > moment('2051-01-01');
  };

  useEffect(() => {
    if (!isInherit) {
      setDataSourceType(Number(projectInfo?.dataSourceType));
    } else {
      setDataSourceType(
        Number(projectInfo?.dataSourceType) === 1 ? 0 : Number(projectInfo?.dataSourceType),
      );
    }
  }, [JSON.stringify(projectInfo)]);

  const {
    projectCategory,
    projectPType,
    projectKvLevel,
    projectNature,
    projectAssetsNature,
    projectMajorCategory,
    projectReformCause,
    projectReformAim,
    projectRegionAttribute,
    projectConstructType,
    projectClassification,
    projectStage,
    projectBatch,
    projectAttribute,
    meteorologicLevel,
    projectDataSourceType,
  } = useGetProjectEnum();

  // 如果是继承，那么筛掉value是1的选项
  const handleProjectDataSourceType = useMemo(() => {
    if ((projectDataSourceType && pointVisible) || (isInherit && projectDataSourceType)) {
      return projectDataSourceType.filter((item: any) => item.value !== 1);
    }
    return [];
  }, [projectDataSourceType, pointVisible, isInherit]);

  const handleProjectStage = useMemo(() => {
    if (isNumber(projectInfo?.stage) && projectStage && isInherit) {
      return projectStage.filter((item: any) => item.value > projectInfo?.stage);
    }
    return [];
  }, [projectStage, isInherit, projectInfo]);

  const keyPressEvent = (e: any) => {
    //只要输入的内容是'+-eE'  ，就阻止元素发生默认的行为
    const invalidChars = ['-', '+', 'e', 'E'];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            {...field}
            label="项目名称"
            fieldKey={[field.fieldKey, 'name']}
            name={isEmpty(field) ? 'name' : [field.name, 'name']}
            labelWidth={120}
            align="right"
            rules={Rule.name}
            required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目分类"
            fieldKey={[field.fieldKey, 'category']}
            initialValue={1}
            name={isEmpty(field) ? 'category' : [field.name, 'category']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectCategory}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目类型"
            fieldKey={[field.fieldKey, 'pType']}
            initialValue={1}
            name={isEmpty(field) ? 'pType' : [field.name, 'pType']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectPType}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="电压等级"
            fieldKey={[field.fieldKey, 'kvLevel']}
            initialValue={1}
            name={isEmpty(field) ? 'kvLevel' : [field.name, 'kvLevel']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectKvLevel}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="总投资(万元)"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'totalInvest']}
            name={isEmpty(field) ? 'totalInvest' : [field.name, 'totalInvest']}
            rules={Rule.total}
          >
            <Input
              type="number"
              placeholder="请输入"
              min={0}
              defaultValue={0}
              onKeyPress={keyPressEvent}
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目性质"
            labelWidth={120}
            align="right"
            rules={Rule.natures}
            fieldKey={[field.fieldKey, 'natures']}
            name={isEmpty(field) ? 'natures' : [field.name, 'natures']}
            required
          >
            <UrlSelect
              defaultData={projectNature}
              mode="multiple"
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目开始日期"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'startTime']}
            name={isEmpty(field) ? 'startTime' : [field.name, 'startTime']}
            required
            dependencies={['startTime', 'endTime']}
            rules={[
              { required: true, message: '项目开始日期不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    moment(new Date(value).getTime()).isBefore(moment(endDate)) ||
                    !value ||
                    !getFieldValue('startTime') ||
                    !endDate
                  ) {
                    if (
                      getFieldValue('startTime')
                        ? moment(new Date(value).getTime()).isAfter(
                            engineerStart
                              ? engineerStart
                              : new Date(getFieldValue('startTime')).getTime(),
                          ) ||
                          moment(new Date(value).getTime()).isSame(
                            engineerStart
                              ? engineerStart
                              : new Date(getFieldValue('startTime')).getTime(),
                            'day',
                          )
                        : true
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject('"项目开始日期"不得早于"工程开始日期"');
                  }
                  return Promise.reject('"项目开始日期"必须早于"项目结束日期"');
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="请选择"
              onChange={(value: any) => {
                setStartDate(value);
              }}
              disabledDate={disableDate}
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目结束日期"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'endTime']}
            name={isEmpty(field) ? 'endTime' : [field.name, 'endTime']}
            dependencies={['endTime', 'startTime']}
            required
            rules={[
              { required: true, message: '项目结束日期不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    moment(new Date(value).getTime()).isAfter(moment(startDate)) ||
                    !value ||
                    !getFieldValue('startTime') ||
                    !startDate
                  ) {
                    if (
                      getFieldValue('endTime')
                        ? moment(new Date(value).getTime()).isBefore(
                            engineerEnd
                              ? engineerEnd
                              : new Date(getFieldValue('endTime')).getTime(),
                          ) ||
                          moment(new Date(value).getTime()).isSame(
                            engineerEnd
                              ? engineerEnd
                              : new Date(getFieldValue('endTime')).getTime(),
                            'day',
                          )
                        : true
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject('“项目结束日期”不得晚于“工程结束日期”');
                  }

                  return Promise.reject('"项目结束日期"必须晚于"项目开始日期"');
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="请选择"
              disabledDate={disableDate}
              format={'yyyy-MM-DD'}
              onChange={(value: any) => {
                setEndDate(value);
              }}
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="资产性质"
            fieldKey={[field.fieldKey, 'assetsNature']}
            initialValue={1}
            name={isEmpty(field) ? 'assetsNature' : [field.name, 'assetsNature']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectAssetsNature}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="专业类别"
            fieldKey={[field.fieldKey, 'majorCategory']}
            initialValue={1}
            name={isEmpty(field) ? 'majorCategory' : [field.name, 'majorCategory']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectMajorCategory}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="是否跨年项目"
            fieldKey={[field.fieldKey, 'isAcrossYear']}
            initialValue={'false'}
            name={isEmpty(field) ? 'isAcrossYear' : [field.name, 'isAcrossYear']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <Select placeholder="请选择">
              <Select.Option value="true">是</Select.Option>
              <Select.Option value="false">否</Select.Option>
            </Select>
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="改造原因"
            initialValue={1}
            fieldKey={[field.fieldKey, 'reformCause']}
            name={isEmpty(field) ? 'reformCause' : [field.name, 'reformCause']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectReformCause}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="建设改造目的"
            initialValue={1}
            fieldKey={[field.fieldKey, 'reformAim']}
            name={isEmpty(field) ? 'reformAim' : [field.name, 'reformAim']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectReformAim}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="供电所/班组"
            rules={Rule.powerSupply}
            fieldKey={[field.fieldKey, 'powerSupply']}
            name={isEmpty(field) ? 'powerSupply' : [field.name, 'powerSupply']}
            labelWidth={120}
            align="right"
            required
          >
            <UrlSelect
              url="/ElectricityCompany/GetPowerSupplys"
              extraParams={{ areaId, company }}
              paramsMust={['areaId', 'company']}
              requestType="post"
              placeholder="请选择"
              valuekey="value"
              titlekey="text"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="资产所属单位"
            fieldKey={[field.fieldKey, 'assetsOrganization']}
            name={isEmpty(field) ? 'assetsOrganization' : [field.name, 'assetsOrganization']}
            labelWidth={120}
            align="right"
            rules={Rule.assetsOrganization}
            required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="所属市公司"
            fieldKey={[field.fieldKey, 'cityCompany']}
            name={isEmpty(field) ? 'cityCompany' : [field.name, 'cityCompany']}
            labelWidth={120}
            align="right"
            rules={Rule.wordsLimit}
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="区域属性"
            initialValue={1}
            fieldKey={[field.fieldKey, 'regionAttribute']}
            name={isEmpty(field) ? 'regionAttribute' : [field.name, 'regionAttribute']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectRegionAttribute}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="所属县公司"
            fieldKey={[field.fieldKey, 'countyCompany']}
            name={isEmpty(field) ? 'countyCompany' : [field.name, 'countyCompany']}
            labelWidth={120}
            align="right"
            rules={Rule.wordsLimit}
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="建设类型"
            initialValue={1}
            fieldKey={[field.fieldKey, 'constructType']}
            name={isEmpty(field) ? 'constructType' : [field.name, 'constructType']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectConstructType}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目类别"
            initialValue={1}
            fieldKey={[field.fieldKey, 'pCategory']}
            name={isEmpty(field) ? 'pCategory' : [field.name, 'pCategory']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectClassification}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目阶段"
            initialValue={2}
            fieldKey={[field.fieldKey, 'stage']}
            name={isEmpty(field) ? 'stage' : [field.name, 'stage']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={isInherit ? handleProjectStage : projectStage}
              valuekey="value"
              disabled={isEdit}
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目批次"
            initialValue={1}
            fieldKey={[field.fieldKey, 'batch']}
            name={isEmpty(field) ? 'batch' : [field.name, 'batch']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectBatch}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目属性"
            initialValue={1}
            fieldKey={[field.fieldKey, 'category']}
            name={isEmpty(field) ? 'pAttribute' : [field.name, 'pAttribute']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectAttribute}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="气象区"
            initialValue={1}
            fieldKey={[field.fieldKey, 'category']}
            name={isEmpty(field) ? 'meteorologic' : [field.name, 'meteorologic']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={meteorologicLevel}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="截止日期"
            fieldKey={[field.fieldKey, 'deadline']}
            name={isEmpty(field) ? 'deadline' : [field.name, 'deadline']}
            labelWidth={120}
            align="right"
          >
            <DatePicker placeholder="请选择" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="现场数据来源"
            initialValue={0}
            fieldKey={[field.fieldKey, 'dataSourceType']}
            name={isEmpty(field) ? 'dataSourceType' : [field.name, 'dataSourceType']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            {status == 1 || status == 14 || status == undefined ? (
              <UrlSelect
                defaultData={
                  pointVisible || isInherit ? handleProjectDataSourceType : projectDataSourceType
                }
                valuekey="value"
                titlekey="text"
                placeholder="请选择"
                onChange={(value: any) => {
                  if (value === 2 || value === 1) {
                    if (field.fieldKey === undefined) {
                      form.resetFields(['disclosureRange', 'pileRange']);

                      // form.setFieldsValue({ disclosureRange: undefined, pileRange: undefined });
                    } else {
                      const projectsInfo = form.getFieldValue('projects');
                      const newProjectsInfo = projectsInfo.map((item: any, ind: number) => {
                        if (ind === index) {
                          return { ...item, disclosureRange: undefined, pileRange: undefined };
                        }
                        return item;
                      });
                      form.setFieldsValue({ projects: newProjectsInfo });
                    }
                  }
                  setDataSourceType(value);
                  if (isNumber(index)) {
                    const copyData = [...copyFlag!];
                    // console.log(index)
                    copyData.splice(index!, 1, value);
                    // console.log(copyData)
                    setCopyFlag?.(copyData);
                  }
                }}
              />
            ) : (
              <UrlSelect
                defaultData={projectDataSourceType}
                disabled
                valuekey="value"
                titlekey="text"
                placeholder="请选择"
              />
            )}
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          {dataSourceType === 2 || (copyFlag && copyFlag[index] && copyFlag[index] === 2) ? (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                disabled
                placeholder="“无需现场数据”项目，免设置此条目"
                style={{ width: '100%' }}
                value={disRangeValue}
              />
            </CyFormItem>
          ) : dataSourceType === 1 || (copyFlag && copyFlag[index] && copyFlag[index] === 1) ? (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                disabled
                placeholder="“点位导入”项目，免设置此条目"
                style={{ width: '100%' }}
                value={disRangeValue}
              />
            </CyFormItem>
          ) : (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              dependencies={['dataSourceType']}
              required
              align="right"
              rules={[
                {
                  required: true,
                  message: '交底范围不能为空',
                },
                () => ({
                  validator(_, value) {
                    console.log(value);

                    if (value <= 99999 && value > -1) {
                      return Promise.resolve();
                    }
                    if (form.getFieldValue('dataSourceType') === 1) {
                      console.log(1);

                      return Promise.resolve();
                    }
                    if (value > 99999) {
                      return Promise.reject('请填写0~99999以内的整数');
                    }
                    return Promise.resolve();
                  },
                }),
                {
                  pattern: /^[0-9]\d*$/,
                  message: '请输入正整数',
                },
              ]}
            >
              <Input
                type="number"
                placeholder="请输入交底范围"
                style={{ width: '100%' }}
                value={disRangeValue}
                onKeyPress={keyPressEvent}
              />
            </CyFormItem>
          )}
        </div>
        <div className="flex1 flowHidden">
          {dataSourceType === 2 || (copyFlag && copyFlag[index] && copyFlag[index] === 2) ? (
            <CyFormItem
              label="桩位范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                value={pileRangeValue}
                disabled
                placeholder="“无需现场数据”项目，免设置此条目"
                style={{ width: '100%' }}
              />
            </CyFormItem>
          ) : dataSourceType === 1 || (copyFlag && copyFlag[index] && copyFlag[index] === 1) ? (
            <CyFormItem
              label="桩位范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                value={pileRangeValue}
                disabled
                placeholder="“点位导入”项目，免设置此条目"
                style={{ width: '100%' }}
              />
            </CyFormItem>
          ) : (
            <CyFormItem
              label="桩位范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              required
              labelWidth={120}
              align="right"
              rules={[
                {
                  required: true,
                  message: '桩位范围不能为空',
                },
                () => ({
                  validator(_, value) {
                    if (value <= 99999 && value > -1) {
                      return Promise.resolve();
                    }
                    if (value > 99999) {
                      return Promise.reject('请填写1~99999以内的整数');
                    }
                    return Promise.resolve();
                  },
                }),
                {
                  pattern: /^[0-9]\d*$/,
                  message: '请输入正整数',
                },
              ]}
            >
              <Input
                type="number"
                placeholder="请输入桩位范围"
                style={{ width: '100%' }}
                onKeyPress={keyPressEvent}
              />
            </CyFormItem>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(CreateProjectForm);
