import CyFormItem from '@/components/cy-form-item';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import { newUploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Input, Form, message, Row, Col, Modal, Button } from 'antd';
import UrlSelect from '@/components/url-select';
import rule from '../rules';
import { reject } from 'lodash';

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
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [versionName, setVersionName] = useState<string>('');
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const [inventoryName, setInventoryName] = useState<string>('');
  const { requestSource, changeFinishEvent } = props;
  const [form] = Form.useForm();

  const saveInventoryEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        setRequestLoading(true);

        return newUploadLineStressSag(
          file,
          { province, resourceLibId, versionName, inventoryName },
          requestSource,
          '/Inventory/SaveImport',
        );
      })
      .then(
        () => {
          setTimeout(() => {
            setState(false);
          }, 1000);
          return Promise.resolve();
        },
        () => {
          return Promise.reject('上传失败');
        },
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();

        setRequestLoading(false);
      });
  };

  const onSave = () => {
    form.validateFields().then(() => {
      setUploadFileTrue();
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="780px"
      title="导入"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => onSave()} loading={requestLoading}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <Row gutter={24}>
          <Col>
            <CyFormItem
              labelWidth={100}
              align="right"
              label="协议库存名称"
              name="invName"
              required
              rules={rule.invName}
            >
              <Input
                style={{ width: '220px' }}
                placeholder="请输入协议库存名称"
                onChange={(e) => setInventoryName(e.target.value)}
              />
            </CyFormItem>
          </Col>
          <Col>
            <CyFormItem
              labelWidth={100}
              align="right"
              label="版本"
              name="version"
              required
              rules={rule.version}
            >
              <Input
                style={{ width: '220px' }}
                placeholder="请输入协议库存版本"
                onChange={(e) => setVersionName(e.target.value)}
              />
            </CyFormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <CyFormItem
              labelWidth={100}
              align="right"
              label="区域"
              name="province"
              required
              rules={rule.province}
            >
              <UrlSelect
                style={{ width: '220px' }}
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
            <CyFormItem
              labelWidth={100}
              align="right"
              label="资源库"
              name="reousourceLib"
              required
              rules={rule.lib}
            >
              <UrlSelect
                style={{ width: '220px' }}
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
        </Row>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="导入"
          name="file"
          style={{ width: '565px' }}
          required
          rules={rule.file}
        >
          <FileUpload trigger={triggerUploadFile} uploadFileFn={saveInventoryEvent} maxCount={1} />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportInventory;
