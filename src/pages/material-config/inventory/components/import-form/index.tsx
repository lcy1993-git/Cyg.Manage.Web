import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useControllableValue } from 'ahooks';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Input, Form, message, Row, Col, Modal, Button } from 'antd';
import UrlSelect from '@/components/url-select';

interface ImportInventoryProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const ImportInventory: React.FC<ImportInventoryProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [versionName, setVersionName] = useState<string>('');
  const { requestSource, changeFinishEvent } = props;
  const [form] = Form.useForm();

  const saveInventoryEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      await uploadLineStressSag(
        file,
        { province, resourceLibId, versionName },
        requestSource,
        '/Inventory/SaveImport',
      );
      message.success('导入成功');
      setState(false);
      changeFinishEvent?.();
    });
  };

  return (
    <Modal
      destroyOnClose
      width="780px"
      title="导入"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => saveInventoryEvent()}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <Row gutter={24}>
          <Col>
            <CyFormItem labelWidth={50} label="区域" name="province">
              <UrlSelect
                style={{ width: '160px' }}
                allowClear
                showSearch
                url="/Area/GetList?pId=-1"
                titleKey="text"
                valueKey="value"
                placeholder="请选择"
                onChange={(value: any) => setProvince(value)}
              />
            </CyFormItem>
          </Col>
          <Col>
            <CyFormItem labelWidth={70} label="资源库" name="reousourceLib">
              <UrlSelect
                style={{ width: '160px' }}
                allowClear
                showSearch
                requestSource="resource"
                url="/ResourceLib/GetList"
                titleKey="libName"
                valueKey="id"
                placeholder="请选择"
                onChange={(value: any) => setResourceLibId(value)}
              />
            </CyFormItem>
          </Col>

          <Col>
            <CyFormItem labelWidth={50} label="版本" name="version">
              <Input
                style={{ width: '160px' }}
                placeholder="--请输入版本--"
                onChange={(e) => setVersionName(e.target.value)}
              />
            </CyFormItem>
          </Col>
        </Row>

        <CyFormItem labelWidth={50} label="导入" name="file" required>
          <FileUpload maxCount={1} />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportInventory;
