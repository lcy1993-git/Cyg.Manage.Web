import CyFormItem from '@/components/cy-form-item';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Input, Form, message, Row, Col, Modal, Button } from 'antd';
import UrlSelect from '@/components/url-select';

// interface CurrentDataParams {
//   id?: string;
//   provinceName?: string;
//   province?: string;
//   companyId?: string;
// }

interface ImportWareHouseProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
  province: string;
  provinceName: string;
  overviewId: string;
}

const ImportWareHouse: React.FC<ImportWareHouseProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [companyId, setCompanyId] = useState<string>('');
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const {
    province = '',
    provinceName = '',
    overviewId = '',
    requestSource,
    changeFinishEvent,
  } = props;
  const [form] = Form.useForm();

  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        return uploadLineStressSag(
          file,
          { province, companyId, overviewId },
          requestSource,
          '/WareHouse/SaveImport',
        );
      })
      .then(
        () => {
          return Promise.resolve();
        },
        (res) => {
          const { code, isSuccess, message: msg } = res;
          if (message) {
            message.warn(msg);
          }
          return Promise.reject('导入失败');
        },
      )
      .finally(() => {
        setUploadFileFalse();
        changeFinishEvent?.();
      });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="780px"
      title="导入利库"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => setState(false)}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <Row gutter={24} style={{ minWidth: 800 }}>
          <Col>
            <CyFormItem labelWidth={80} label="区域" name="province">
              <Input defaultValue={provinceName} disabled />
            </CyFormItem>
          </Col>
          <Col>
            <CyFormItem labelWidth={120} label="所属供电公司" name="companyId" required>
              <UrlSelect
                style={{ width: '342px' }}
                url="/ElectricityCompany/GetListByAreaId"
                titlekey="text"
                valuekey="text"
                placeholder="请选择供电公司"
                extraParams={{ areaId: province }}
                allowClear
                onChange={(value: any) => setCompanyId(value)}
              />
            </CyFormItem>
          </Col>
        </Row>

        <CyFormItem labelWidth={80} label="导入" name="file" required>
          <FileUpload
            accept=".xlsx"
            uploadFileBtn
            trigger={triggerUploadFile}
            uploadFileFn={saveLineStreesSagEvent}
            maxCount={1}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportWareHouse;
