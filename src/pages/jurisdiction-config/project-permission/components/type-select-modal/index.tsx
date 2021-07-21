import { useControllableValue } from 'ahooks';
import { Col, Form, Modal, Row } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CyTip from '@/components/cy-tip';
import EnumSelect from '@/components/enum-select';
import {get} from '@/services/jurisdiction-config/company-manage'


interface TypeModalParams {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
}

enum categoryEnum {
  '公司' = 1,
  '部组',
  '公司用户',
}

const PermissionTypeModal: React.FC<TypeModalParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [categorySelected, setCategorySelected] = useState<number>();

  // const {data:companyData} = useRequest(()=>)

  const addProjectEntry = () => {};

  return (
    <>
      <Modal
        maskClosable={false}
        width="58%"
        centered
        title="添加-项目权限组"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        cancelText="取消"
        bodyStyle={{ padding: 0 }}
        onCancel={() => setState(false)}
        onOk={() => addProjectEntry()}
      >
        <CyTip>选择某对象，即包含了该对象以及该对象下属部组，公司用户的全部相关类型项目。</CyTip>
        <div style={{ padding: '20px' }}>
          <Row gutter={24}>
            <Col>
              <CyFormItem label="请选择对象类型" required align="right" labelWidth={111}>
                <EnumSelect
                  style={{ width: '300px' }}
                  enumList={categoryEnum}
                  onChange={(value: any) => setCategorySelected(value)}
                />
              </CyFormItem>
            </Col>
            <Col span={12}>
              <CyFormItem label="请选择对象" required align="right" labelWidth={111}>
                <UrlSelect style={{ width: '300px' }}></UrlSelect>
              </CyFormItem>
            </Col>
          </Row>
          <CyFormItem label="请选择项目类型" required align="right" labelWidth={111}>
            <UrlSelect style={{ width: '100%' }} mode="multiple"></UrlSelect>
          </CyFormItem>
        </div>
      </Modal>
    </>
  );
};

export default PermissionTypeModal;
