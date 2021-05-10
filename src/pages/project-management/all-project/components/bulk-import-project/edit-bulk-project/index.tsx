import React, { Dispatch, SetStateAction } from 'react';
import { DatePicker, Input, Modal, Select } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
// import DataSelect from '@/components/data-select';
// import EnumSelect from '@/components/enum-select';
import city from '@/assets/local-data/area';
import moment from 'moment';
import Rule from './project-form-rule';
import { useControllableValue } from 'ahooks';
import { useGetProjectEnum, useGetSelectData } from '@/utils/hooks';

interface EditBulkProjectProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  libSelectData: any;
  cityData: any;
  currentInfo: any;
  areaChangeEvent: any;
}

const EditBulkProject: React.FC<EditBulkProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

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

  const saveCurrentEngineer = () => {};

  const closeModalEvent = () => {
    setState(false);
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title="批量立项"
        width="45%"
        visible={state as boolean}
        onOk={() => saveCurrentEngineer()}
        onCancel={() => closeModalEvent()}
      >
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目名称"
              name="name"
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
              initialValue={1}
              name='category'
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectCategory}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目类型"
              initialValue={1}
              name='pType'
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectPType}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="电压等级"
              initialValue={1}
              name='kvLevel'
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectKvLevel}
                valueKey="value"
                titleKey="text"
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
              name='totalInvest'
            >
              <Input placeholder="请输入" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目性质"
              labelWidth={120}
              align="right"
              rules={Rule.required}
              name='natures'
              required
            >
              <UrlSelect
                defaultData={projectNature}
                mode="multiple"
                valueKey="value"
                titleKey="text"
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
              name='startTime'
            >
              <DatePicker placeholder="请选择" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目结束日期"
              labelWidth={120}
              align="right"
              name='endTime'
            >
              <DatePicker placeholder="请选择" />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="资产性质"
              initialValue={1}
              name='assetsNature' 
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectAssetsNature}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="专业类别"
              initialValue={1}
              name='majorCategory' 
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectMajorCategory}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="是否跨年项目"
              initialValue={'false'}
              name='isAcrossYear' 
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
              name= 'reformCause'
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectReformCause}
                valueKey="value"
                titleKey="text"
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
              name= 'reformAim' 
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectReformAim}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="供电所/班组"
              rules={Rule.required}
              name='powerSupply'
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
                titleKey="text"
                valueKey="value"
              />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="资产所属单位"
              name='assetsOrganization'
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <Input placeholder="请输入" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="所属市公司"
              name='cityCompany' 
              labelWidth={120}
              align="right"
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
              name='regionAttribute' 
              labelWidth={120}
              align="right"
              rules={Rule.required}
              required
            >
              <UrlSelect
                defaultData={projectRegionAttribute}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="所属县公司"
              name= 'countyCompany'
              labelWidth={120}
              align="right"
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
              name='constructType' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectConstructType}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目类别"
              initialValue={1}
              name= 'pCategory' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectClassification}
                valueKey="value"
                titleKey="text"
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
              name='stage' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectStage}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目批次"
              initialValue={1}
              name='batch' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectBatch}
                valueKey="value"
                titleKey="text"
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
              name='pAttribute'
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectAttribute}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="气象区"
              initialValue={1}
              name='meteorologic' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={meteorologicLevel}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="交底范围(米)"
              initialValue={'50'}
              name='disclosureRange' 
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <Input type="number" placeholder="请输入" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="桩位范围(米)"
              initialValue={'50'}
              name='pileRange'
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <Input type="number" placeholder="请输入" />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="截止日期"
              name='deadline' 
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
              name= 'dataSourceType'
              required
              labelWidth={120}
              align="right"
              rules={Rule.required}
            >
              <UrlSelect
                defaultData={projectDataSourceType}
                valueKey="value"
                titleKey="text"
                placeholder="请选择"
              />
            </CyFormItem>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditBulkProject;
