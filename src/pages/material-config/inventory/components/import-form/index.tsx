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
          { province, versionName, inventoryName },
          requestSource,
          '/Inventory/SaveImport',
        );
      })
      .then(
        (res) => {
          message.success('导入成功');
          return Promise.resolve();
        },
        (res) => {
          const { code, isSuccess, message: msg } = res;
          if (msg) {
            message.warn(msg);
          }
          return Promise.reject('导入失败');
        },
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();

        setRequestLoading(false);
      });
  };

  const closeEvent = () => {
    setState(false);
    changeFinishEvent?.();
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="600px"
      title="新建"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => closeEvent()} loading={requestLoading}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          labelWidth={100}
          align="right"
          label="协议库存名称"
          name="invName"
          required
          rules={rule.invName}
        >
          <Input
            placeholder="请输入协议库存名称"
            onChange={(e) => setInventoryName(e.target.value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="版本"
          name="version"
          required
          rules={rule.version}
        >
          <Input
            placeholder="请输入协议库存版本"
            onChange={(e) => setVersionName(e.target.value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="区域"
          name="province"
          required
          rules={rule.province}
        >
          <UrlSelect
            allowClear
            showSearch
            url="/Area/GetList?pId=-1"
            titleKey="text"
            valueKey="value"
            placeholder="请选择"
            onChange={(value: any) => setProvince(value)}
          />
        </CyFormItem>

        <CyFormItem
          labelWidth={100}
          align="right"
          label="导入"
          name="file"
          required
          rules={rule.file}
        >
          <FileUpload
            uploadFileBtn
            trigger={triggerUploadFile}
            uploadFileFn={saveInventoryEvent}
            maxCount={1}
            accept=".xlsx"
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportInventory;
