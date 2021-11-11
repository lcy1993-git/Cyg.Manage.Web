import React, { useEffect, useState } from 'react';
import EditFormTable from '@/components/edit-form-table';
import { Form, Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import EnumSelect from '@/components/enum-select';
import { useRequest, useUpdateEffect } from 'ahooks';
import { getSpecName, getMaterialSpecName } from '@/services/resource-config/component';
import uuid from 'node-uuid';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}

enum componentType {
  '物料',
  '组件',
}

const AddComponentDetail: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;
  const [type, setType] = useState<string>();
  const [selectName, setSelectName] = useState<string>('');
  const [specOptions, setSpecOptions] = useState<any>([]);
  const [spec, setSpec] = useState<any>([]);
  const [unit, setUnit] = useState<string>('');

  const { data: specData } = useRequest(
    () =>
      type === '0'
        ? getMaterialSpecName({ libId: resourceLibId, name: selectName })
        : getSpecName({ libId: resourceLibId, name: selectName }),
    {
      ready: !!selectName,
      refreshDeps: [selectName],
      onSuccess: () => {
        setSpecOptions(specData);
        setUnit(
          specData?.map((item: any) => {
            return item.unit;
          })[0],
        );
      },
    },
  );

  const onSpecChange = (value: string) => {
    if (value) {
      setSpec(value);
    } else {
      setSpec(undefined);
    }
  };

  useEffect(() => {
    setSpec(undefined);
  }, [type]);

  const key = type === '0' ? 'materialId' : 'componentId';
  const speckey = type === '0' ? 'spec' : 'componentSpec';
  const placeholder = type === '0' ? '请选择物料' : '请选择组件';

  console.log(unit);

  const columns = [
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>类型</span>
        </>
      ),
      dataIndex: 'type',
      index: 'type',
      width: 240,

      render: (index: number) => (
        <EnumSelect
          bordered={false}
          placeholder="请选择类型"
          enumList={componentType}
          onChange={(value) => {
            const formValues = addForm.getFieldValue('items');
            const thisValue = formValues[index];
            const changeFormValues = formValues.splice(index, 1, {
              ...thisValue,
              type: value,
              componentId: undefined,
              guige: undefined,
              unit: undefined,
            });
            addForm.setFieldsValue({ items: changeFormValues });
          }}
        />
      ),
    },

    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件名称</span>
        </>
      ),
      dataIndex: 'componentId',
      index: 'componentId',
      width: 240,
      render: () => {
        return (
          <CascaderUrlSelect
            urlHead={type === '0' ? 'Material' : type === '1' ? 'Component' : ''}
            libId={resourceLibId}
            setSelectName={setSelectName}
          />
        );
      },
    },
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件规格</span>
        </>
      ),
      dataIndex: 'guige',
      index: 'guige',
      width: 240,
      render: () => {
        return (
          <UrlSelect
            defaultData={specOptions}
            valuekey={key}
            titlekey={speckey}
            allowClear
            value={spec}
            bordered={false}
          />
        );
      },
    },

    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>数量</span>
        </>
      ),
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      width: 160,
      render: () => {
        return <Input type="number" min={1} placeholder="请输入数量（正整数）" bordered={false} />;
      },
      rules: [
        { required: true, message: '数量不能为空' },
        { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
      ],
    },
    {
      title: '单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 140,
      render: () => {
        return <Input bordered={false} disabled />;
      },
    },
  ];

  return <EditFormTable formName="items" columns={columns}></EditFormTable>;
};

export default AddComponentDetail;
