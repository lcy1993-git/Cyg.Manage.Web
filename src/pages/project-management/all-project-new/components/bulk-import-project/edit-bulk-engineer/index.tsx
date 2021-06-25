import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Cascader, DatePicker, Input, Modal, Form } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import DataSelect from '@/components/data-select';
import EnumSelect from '@/components/enum-select';
import { FormImportantLevel, ProjectLevel } from '@/services/project-management/all-project';
import city from '@/assets/local-data/area';
import moment from 'moment';
import { useControllableValue, useRequest } from 'ahooks';
import { useState, useMemo } from 'react';
import { useGetSelectData } from '@/utils/hooks';
import { getCommonSelectData } from '@/services/common';
import rule from './engineer-form-rule';
interface EditBulkEngineerProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent: (engineerInfo: any) => void;
  engineerInfo: any;
}

const EditBulkEngineer: React.FC<EditBulkEngineerProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [areaChange, setAreaChange] = useState<boolean>(false);
  const [libChange, setLibChange] = useState<boolean>(false);
  const [companyChangeFlag, setCompanyChangeFlag] = useState<boolean>(false);

  const [inventoryOverviewSelectData, setInventoryOverviewSelectData] = useState<any[]>([]);
  const [warehouseSelectData, setWarehouseSelectData] = useState<any[]>([]);
  const [companySelectData, setCompanySelectData] = useState<any[]>([]);
  const [departmentSelectData, setDepartmentSelectData] = useState<any[]>([]);

  const [provinceValue, setProvinceValue] = useState<any[]>([]);
  const [libId, setLibId] = useState<string>('');
  const [inventoryOverviewId, setInventoryOverviewId] = useState<string | undefined>('');
  const [warehouseId, setWarehouseId] = useState<string | undefined>('');
  const [company, setCompany] = useState<string | undefined>('');

  const [form] = Form.useForm();
  const { engineerInfo, finishEvent } = props;

  const saveCurrentEngineer = () => {
    form.validateFields().then((values) => {
      const [province, city, area] = provinceValue;
      const engineerSaveInfo = {
        ...engineerInfo,
        engineer: {
          ...engineerInfo.engineer,
          ...values,
          libId,
          inventoryOverviewId,
          warehouseId,
          company,
          province: isNaN(province) ? '' : province,
          city: isNaN(city) ? '' : city,
          area: isNaN(area) ? '' : area,
        },
        areaChange,
        libChange,
        companyChange: companyChangeFlag,
        selectData: {
          ...engineerInfo.selectData,
          inventoryOverviewSelectData,
          warehouseSelectData,
          companySelectData,
          departmentSelectData,
        },
      };
      finishEvent(engineerSaveInfo);
    });
    setState(false);
  };

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLib/GetList?status=1',
    requestSource: 'resource',
    titleKey: 'libName',
    valueKey: 'id',
  });

  const { run: getInventoryOverviewSelectData } = useRequest(getCommonSelectData, { manual: true });

  const { run: getWarehouseSelectData } = useRequest(getCommonSelectData, { manual: true });
  const { run: getCompanySelectData } = useRequest(getCommonSelectData, { manual: true });
  const { run: getDepartmentSelectData } = useRequest(getCommonSelectData, { manual: true });

  const closeModalEvent = () => {
    setState(false);
  };

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

  useEffect(() => {
    const { engineer, selectData } = engineerInfo;

    let provinceValue = [
      engineer?.province,
      engineer?.city ? engineer?.city : `${engineer?.province}_null`,
      engineer?.area ? engineer?.area : engineer?.city ? `${engineer?.city}_null` : undefined,
    ];

    if (!engineer.province) {
      provinceValue = [];
    }

    form.setFieldsValue({
      ...engineer,
      compileTime: engineer?.compileTime ? moment(engineer?.compileTime) : null,
      startTime: engineer?.startTime ? moment(engineer?.startTime) : null,
      endTime: engineer?.endTime ? moment(engineer?.endTime) : null,
      importance: String(engineer?.importance),
      grade: String(engineer?.grade),
      inventoryOverviewId: engineer?.inventoryOverviewId ? engineer?.inventoryOverviewId : 'none',
      warehouseId: engineer?.warehouseId ? engineer?.warehouseId : 'none',
    });

    setInventoryOverviewSelectData(selectData.inventoryOverviewSelectData);
    setWarehouseSelectData(selectData.warehouseSelectData);
    setCompanySelectData(selectData.companySelectData);
    setDepartmentSelectData(selectData.departmentSelectData);

    setLibId(engineer.libId);
    setProvinceValue(provinceValue);
    setInventoryOverviewId(engineer.inventoryOverviewId);
    setWarehouseId(engineer.warehouseId);
    setCompany(engineer.company);
  }, [JSON.stringify(engineerInfo)]);

  const areaChangeEvent = async (value: any) => {
    setProvinceValue(value);
    const [province] = value;

    const warehouseSelectResData = await getWarehouseSelectData({
      url: '/WareHouse/GetWareHouseListByArea',
      method: 'post',
      postType: 'query',
      params: { area: province },
      requestSource: 'resource',
    });

    const companySelectResData = await getCompanySelectData({
      url: '/ElectricityCompany/GetListByAreaId',
      method: 'get',
      params: { areaId: province },
    });

    const handleWarehouseSelectData = warehouseSelectResData?.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleCompanySelectData = companySelectResData?.map((item: any) => {
      return {
        label: item.text,
        value: item.text,
      };
    });
    setCompany(undefined);
    setWarehouseId(undefined);
    setAreaChange(true);
    setWarehouseSelectData(handleWarehouseSelectData);
    setCompanySelectData(handleCompanySelectData);
  };

  const libChangeEvent = async (value: any) => {
    setLibId(value);
    const inventoryOverviewSelectResData = await getInventoryOverviewSelectData({
      url: '/Inventory/GetListByResourceLibId',
      params: { libId: value },
      requestSource: 'resource',
    });

    const handleInventoryOverviewSelectData = inventoryOverviewSelectResData
      ? inventoryOverviewSelectResData?.map((item: any) => {
          return {
            label: item.text,
            value: item.value,
          };
        })
      : [{ label: '无', value: 'none' }];
    setLibChange(true);
    setInventoryOverviewId(undefined);
    setInventoryOverviewSelectData(handleInventoryOverviewSelectData);
  };

  const inventoryOverviewChange = (value: any) => {
    setInventoryOverviewId(value);
  };

  const warehouseIdChange = (value: any) => {
    setWarehouseId(value);
  };

  const companyChange = async (value: any) => {
    setCompany(value);

    const [province] = provinceValue;
    const departmentSelectData = await getDepartmentSelectData({
      url: '/ElectricityCompany/GetPowerSupplys',
      method: 'post',
      params: { areaId: province, company: value },
      requestSource: 'project',
    });

    const handleDepartmentSelectData = departmentSelectData?.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    setCompanyChangeFlag(true);
    setDepartmentSelectData(handleDepartmentSelectData);
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="编辑工程"
        width="45%"
        visible={state as boolean}
        onOk={() => saveCurrentEngineer()}
        onCancel={() => closeModalEvent()}
      >
        <Form form={form}>
          <div className="flex">
            <div className="flex1 flowHidden">
              <CyFormItem
                label="工程名称"
                name="name"
                labelWidth={120}
                align="right"
                required
                rules={rule.name}
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
                rules={rule.required}
              >
                <div>
                  <Cascader
                    style={{ width: '100%' }}
                    allowClear={false}
                    value={provinceValue}
                    onChange={(value) => areaChangeEvent(value)}
                    options={afterHandleData}
                  />
                </div>
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
                rules={rule.required}
              >
                <div>
                  <DataSelect
                    style={{ width: '100%' }}
                    value={libId}
                    onChange={(value) => libChangeEvent(value)}
                    options={libSelectData}
                    placeholder="-资源库-"
                  />
                </div>
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="协议库存"
                name="inventoryOverviewId"
                labelWidth={120}
                align="right"
                required
                rules={rule.required}
              >
                <div>
                  <DataSelect
                    style={{ width: '100%' }}
                    value={inventoryOverviewId}
                    onChange={(value) => inventoryOverviewChange(value)}
                    options={
                      inventoryOverviewSelectData?.length !== 0
                        ? inventoryOverviewSelectData
                        : [{ label: '无', value: 'none' }]
                    }
                    placeholder="请先选择资源库"
                  />
                </div>
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
                rules={rule.required}
              >
                <div>
                  <DataSelect
                    style={{ width: '100%' }}
                    value={warehouseId}
                    onChange={(value) => warehouseIdChange(value)}
                    options={
                      warehouseSelectData !== undefined
                        ? warehouseSelectData
                        : [{ label: '无', value: 'none' }]
                    }
                    placeholder="请先选择区域"
                  />
                </div>
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="编制人"
                name="compiler"
                labelWidth={120}
                align="right"
                required
                rules={rule.compiler}
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
                rules={rule.required}
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
                rules={rule.organization}
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
                rules={[{ required: true, message: '工程开始时间不能为空' }]}
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
                dependencies={['startTime']}
                rules={[
                  { required: true, message: '工程结束时间不能为空' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        new Date(value).getTime() >
                          new Date(getFieldValue('startTime')).getTime() ||
                        !value ||
                        !getFieldValue('startTime')
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject('"工程结束时间"不得早于"工程开始时间"');
                    },
                  }),
                ]}
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
                rules={rule.required}
              >
                <div>
                  <DataSelect
                    style={{ width: '100%' }}
                    value={company}
                    onChange={(value) => companyChange(value)}
                    options={companySelectData}
                    placeholder="请先选择区域"
                  />
                </div>
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
                rules={rule.required}
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
                rules={rule.required}
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
                rules={rule.required}
              >
                <EnumSelect placeholder="请选择" enumList={ProjectLevel} />
              </CyFormItem>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditBulkEngineer;
