import React, { Dispatch, SetStateAction } from 'react';
import { Button, Cascader, DatePicker, Input, Modal } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import DataSelect from '@/components/data-select';
import EnumSelect from '@/components/enum-select';
import { FormImportantLevel, ProjectLevel } from '@/services/project-management/all-project';
import city from '@/assets/local-data/area';
import moment from 'moment';
import Rule from './engineer-form-rule';
import { useControllableValue } from 'ahooks';

interface EditBulkEngineerProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  libSelectData: any;
  cityData: any;
  libChangeEvent: (value, index) => void;
  currentInfo: any;
  areaChangeEvent: any;
}

const EditBulkEngineer: React.FC<EditBulkEngineerProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libSelectData, cityData, libChangeEvent, currentInfo, areaChangeEvent } = props;
  console.log(currentInfo);

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
              label="工程名称"
              name="name"
              labelWidth={120}
              align="right"
              // rules={Rule.required}
              required
            >
              <Input placeholder="请输入" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="区域"
              name="province"
              labelWidth={120}
              align="right"
              required
              // rules={Rule.required}
            >
              <Cascader options={cityData} placeholder="请选择区域" />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="资源库"
              name="libId"
              labelWidth={120}
              align="right"
              required
              // rules={Rule.required}
            >
              <DataSelect
                value={currentInfo?.libId}
                placeholder="请选择"
                options={libSelectData}
                onChange={(value) => libChangeEvent(value,currentInfo?.id)}
              />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="协议库存"
              name="inventoryOverviewId"
              labelWidth={120}
              align="right"
              required
              // rules={Rule.required}
            >
              {/* <DataSelect
              value={currentInfo.inventoryOverviewId}
                options={}
                placeholder="请先选择资源库"
              /> */}
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="利旧库存协议"
              name="warehouseId"
              labelWidth={120}
              align="right"
              required
              // rules={Rule.required}
            >
              {/* <DataSelect options={warehouseSelectData} placeholder="请先选择区域" /> */}
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              // shouldUpdate={valueChangeEvenet}
              label="编制人"
              name="compiler"
              labelWidth={120}
              align="right"
              required
              rules={Rule.required}
            >
              <Input placeholder="请输入" />
            </CyFormItem>
          </div>
        </div>
        <div className="flex ">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="编制时间"
              name="compileTime"
              initialValue={moment()}
              labelWidth={120}
              align="right"
              required
              rules={Rule.required}
            >
              <DatePicker />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="编制单位"
              name="organization"
              labelWidth={120}
              align="right"
              required
              rules={Rule.required}
            >
              <Input placeholder="请输入" />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="工程开始时间"
              name="startTime"
              labelWidth={120}
              align="right"
              required
              rules={Rule.required}
            >
              <DatePicker />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="工程结束时间"
              name="endTime"
              labelWidth={120}
              align="right"
              required
              rules={Rule.required}
            >
              <DatePicker />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="所属公司"
              name="company"
              labelWidth={120}
              align="right"
              required
              // rules={Rule.required}
            >
              {/* <DataSelect options={companySelectData} placeholder="请先选择区域" /> */}
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="重要程度"
              name="importance"
              labelWidth={120}
              align="right"
              initialValue={'1'}
              required
              rules={Rule.required}
            >
              <EnumSelect placeholder="请选择" enumList={FormImportantLevel} />
            </CyFormItem>
          </div>
        </div>
        <div className="flex">
          <div className="flex1 flowHidden">
            <CyFormItem
              label="计划年度"
              name="plannedYear"
              labelWidth={120}
              align="right"
              initialValue={new Date().getFullYear()}
              required
              rules={Rule.required}
            >
              <Input type="number" placeholder="请输入" />
            </CyFormItem>
          </div>
          <div className="flex1 flowHidden">
            <CyFormItem
              label="项目级别"
              name="grade"
              labelWidth={120}
              align="right"
              initialValue={'1'}
              required
              rules={Rule.required}
            >
              <EnumSelect placeholder="请选择" enumList={ProjectLevel} />
            </CyFormItem>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditBulkEngineer;
