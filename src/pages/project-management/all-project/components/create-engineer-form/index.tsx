import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { DatePicker, Input, Cascader } from 'antd';
import EnumSelect from '@/components/enum-select';
import { FormImportantLevel, ProjectLevel } from '@/services/project-management/all-project';

import Rule from './engineer-form-rule';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';

import city from '@/assets/local-data/area';
import moment from 'moment';

interface CreateEngineerForm {
  exportDataChange?: (exportData: any) => void;
  areaId?: string;
  libId?: string;
  form?: any;
  canChange?: boolean;
  minStart?: number;
  maxEnd?: number;
}

const CreateEngineerForm: React.FC<CreateEngineerForm> = (props) => {
  const {
    exportDataChange,
    areaId: province,
    libId: inputLibId,
    form,
    canChange = true,
    minStart,
    maxEnd,
  } = props;

  const [areaId, setAreaId] = useState<string>('');
  const [libId, setLibId] = useState<string>('');

  const disableDate = (current: any) => {
    return current < moment('2010-01-01') || current > moment('2051-01-01');
  };

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLib/GetList?status=1',
    requestSource: 'resource',
    titleKey: 'libName',
    valueKey: 'id',
  });
  const { data: inventoryOverviewSelectData = [] } = useGetSelectData(
    {
      url: `/Inventory/GetListByResourceLibId?libId=${libId}`,
      requestSource: 'resource',
    },
    { ready: !!libId, refreshDeps: [libId] },
  );
  const { data: warehouseSelectData = [] } = useGetSelectData(
    {
      url: '/WareHouse/GetWareHouseListByArea',
      extraParams: { area: areaId },
      requestSource: 'resource',
      method: 'post',
      postType: 'query',
    },
    { ready: !!areaId, refreshDeps: [areaId] },
  );

  const { data: companySelectData = [] } = useGetSelectData(
    {
      url: `/ElectricityCompany/GetListByAreaId?areaId=${areaId}`,
      // extraParams: { area: areaId },
      titleKey: 'text',
      valueKey: 'text',
    },
    { ready: !!areaId, refreshDeps: [areaId] },
  );

  const mapHandleCityData = (data: any) => {
    return {
      label: data.text,
      value: data.id,
      children: data.children
        ? [
            { label: '无', value: `${data.id}_null`, children: undefined },
            ...data.children.map(mapHandleCityData),
          ]
        : undefined,
    };
  };

  const afterHandleData = useMemo(() => {
    return city.map(mapHandleCityData);
  }, [JSON.stringify(city)]);

  const valueChangeEvenet = useCallback(
    (prevValues: any, curValues: any) => {
      if (prevValues.province !== curValues.province) {
        const [currentAreaId = ''] = curValues.province;
        setAreaId(currentAreaId);
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        });
        // 因为发生了改变，所以之前选择的应该重置
        if (form && canChange) {
          form.setFieldsValue({
            warehouseId: undefined,
          });
          form.setFieldsValue({
            company: undefined,
          });
        }
      }
      if (prevValues.libId !== curValues.libId) {
        setLibId(curValues.libId);
        if (form && canChange) {
          form.setFieldsValue({
            inventoryOverviewId: undefined,
          });
        }
      }
      if (prevValues.company !== curValues.company) {
        const [currentAreaId = ''] = curValues.province;
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        });
      }
      return false;
    },
    [canChange],
  );

  useEffect(() => {
    if (province) {
      setAreaId(province);
    }
    if (inputLibId) {
      setLibId(inputLibId);
    }
  }, [province, inputLibId]);

  return (
    <>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="工程名称"
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
            label="区域"
            name="province"
            labelWidth={120}
            align="right"
            required
            rules={Rule.area}
          >
            <Cascader options={afterHandleData} />
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
            rules={Rule.lib}
          >
            <DataSelect placeholder="请选择" options={libSelectData} />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="协议库存"
            name="inventoryOverviewId"
            labelWidth={120}
            align="right"
            required
            rules={Rule.inventory}
          >
            <DataSelect
              options={
                inventoryOverviewSelectData.length !== 0
                  ? inventoryOverviewSelectData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择资源库"
            />
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
            rules={Rule.warehouse}
          >
            <DataSelect
              options={
                warehouseSelectData.length !== 0
                  ? warehouseSelectData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择区域"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            shouldUpdate={valueChangeEvenet}
            label="编制人"
            name="compiler"
            labelWidth={120}
            align="right"
            required
            rules={Rule.compiler}
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
            rules={Rule.complieTime}
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
            rules={Rule.organization}
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
            rules={[
              { required: true, message: '工程开始时间不能为空' },
              () => ({
                validator(_, value) {
                  if (
                    minStart
                      ? moment(new Date(value).getTime()).isBefore(moment(minStart)) ||
                        moment(new Date(value).getTime()).isSame(moment(minStart))
                      : true
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('"工程开始时间"不得晚于"项目开始时间"');
                },
              }),
            ]}
          >
            <DatePicker disabledDate={disableDate} />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="工程结束时间"
            name="endTime"
            labelWidth={120}
            align="right"
            required
            dependencies={['startTime']}
            rules={[
              { required: true, message: '工程结束时间不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log(value);

                  if (
                    moment(moment(new Date(value)).format('YYYY-MM-DD')).isAfter(
                      moment(new Date(getFieldValue('startTime')?.format('YYYY-MM-DD'))),
                    ) ||
                    !value ||
                    !getFieldValue('startTime')
                  ) {
                    if (
                      maxEnd
                        ? moment(new Date(value).getTime()).isAfter(moment(maxEnd)) ||
                          moment(new Date(value).getTime()).isSame(moment(maxEnd))
                        : true
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject('"工程结束时间"不得早于"项目结束时间"');
                  }
                  return Promise.reject('"工程结束时间"不得早于"工程开始时间"');
                },
              }),
            ]}
          >
            <DatePicker disabledDate={disableDate} />
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
            rules={Rule.company}
          >
            <DataSelect options={companySelectData} placeholder="请先选择区域" />
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
            rules={Rule.importance}
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
            rules={Rule.plannedYear}
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
            rules={Rule.grade}
          >
            <EnumSelect placeholder="请选择" enumList={ProjectLevel} />
          </CyFormItem>
        </div>
      </div>
    </>
  );
};

export default CreateEngineerForm;
