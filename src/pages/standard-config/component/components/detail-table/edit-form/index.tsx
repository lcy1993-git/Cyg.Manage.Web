import React, { useState } from 'react';
import { Col, Input, Row } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';
import EnumSelect from '@/components/enum-select';
import UrlSelect from '@/components/url-select';
import { useRequest, useUpdateEffect } from 'ahooks';
import { getMaterialSpecName, getSpecName } from '@/services/resource-config/component';

interface EditComponentDetailParams {
  resourceLibId: string;
  formData: any;
}

enum componentType {
  '物料',
  '组件',
}

const EditComponentDetail: React.FC<EditComponentDetailParams> = (props) => {
  const { resourceLibId, formData } = props;
  const [selectName, setSelectName] = useState<string>('');
  const [specOptions, setSpecOptions] = useState<any>([]);
  const [spec, setSpec] = useState<any>([]);
  const [type, setType] = useState<string>();

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
      },
    },
  );

  console.log(formData);

  useUpdateEffect(() => {
    setType(formData?.type);

    setSelectName(
      formData?.type === '0' ? formData?.materialId?.name : formData?.componentId?.name,
    );
  }, [formData]);

  const onSpecChange = (value: string) => {
    if (value) {
      setSpec(value);
    } else {
      setSpec(undefined);
    }
  };

  // useEffect(() => {
  //   setSpec(undefined);
  // }, [type]);

  const key = type === '0' ? 'materialId' : 'componentId';
  const speckey = type === '0' ? 'spec' : 'componentSpec';
  const placeholder = type === '0' ? '请选择物料' : '请选择组件';

  return (
    <>
      <Scrollbars autoHeight>
        <Row>
          <Col span={12}>
            <CyFormItem align="right" label="类型" name="type" required labelWidth={113}>
              <EnumSelect
                placeholder="请选择类型"
                enumList={componentType}
                value={type}
                onChange={(value: any) => setType(value)}
              />
            </CyFormItem>
          </Col>
          <Col span={12}>
            <CyFormItem
              align="right"
              required
              label="物料/组件名称"
              name="componentId"
              labelWidth={130}
            >
              <CascaderUrlSelect
                value={selectName}
                urlHead={type === '0' ? 'Material' : type === '1' ? 'Component' : ''}
                libId={resourceLibId}
              />
            </CyFormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <CyFormItem
              align="right"
              label="物料/组件规格"
              name="materialId"
              labelWidth={113}
              required
              dependencies={['componentId']}
            >
              <UrlSelect
                defaultData={specOptions}
                valuekey={key}
                titlekey={speckey}
                allowClear
                value={spec}
                placeholder={`${placeholder}规格`}
                // className={styles.selectItem}
                onChange={(value) => onSpecChange(value as string)}
              />
            </CyFormItem>
          </Col>
          <Col span={12}>
            <CyFormItem
              align="right"
              label="数量"
              name="itemNumber"
              labelWidth={130}
              required
              rules={[
                { required: true, message: '数量不能为空' },
                { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
              ]}
            >
              <Input type="number" min={1} />
            </CyFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <CyFormItem align="right" label="单位" name="unit" labelWidth={113}>
              <Input disabled />
            </CyFormItem>
          </Col>
        </Row>
      </Scrollbars>
    </>
  );
};

export default EditComponentDetail;
