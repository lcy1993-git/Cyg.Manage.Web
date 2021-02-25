import React, { useState } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import styles from './index.less';
import FileUpLoad from '@/components/file-upload';
import { Input, Form, message, Row, Col } from 'antd';
import { commonUpload } from '@/services/common';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

interface CurrentDataParams {
  id?: string;
  provinceName?: string;
  province?: string;
  companyId?: string;
}
interface ImportWareHouseParams {
  currentData: CurrentDataParams;
}

const ImportWareHouse: React.FC<ImportWareHouseParams> = (props) => {
  const { currentData } = props;
  console.log(currentData);

  const [assestsForm] = Form.useForm();
  const [importWareHouseForm] = Form.useForm();
  const [assestsUploadLoading, setAssestsUploadLoading] = useState<boolean>(false);

  const uploadAssests = () => {
    assestsForm.validateFields().then(async (values) => {
      const { assestsFile } = values;

      await commonUpload('/Upload/StaticFile', assestsFile, 'file', 'upload');
      message.success('上传成功');
      assestsForm.resetFields();
    });
  };

  const uploadJurisdictionFile = () => {
    //TODO  不知道上传的接口和导出的接口
  };

  return (
    <Form form={importWareHouseForm}>
      <Row gutter={24}>
        <Col>
          <CyFormItem labelWidth={80} label="区域" name="province">
            <Input defaultValue={currentData.provinceName} value={currentData.province} disabled />
          </CyFormItem>
        </Col>
        <Col>
          <CyFormItem labelWidth={120} label="所属供电公司" name="companyId">
            <UrlSelect
              requestSource="resource"
              url="/WareHouse/GetWareHouseNodeByArea"
              titleKey="text"
              valueKey="id"
              placeholder="请选择供电公司"
              extraParams={{ area: currentData.province }}
            />
          </CyFormItem>
        </Col>
      </Row>

      <CyFormItem
        labelWidth={80}
        noStyle
        label="上传"
        name="jurisdictionFile"
        rules={[{ required: true, message: '请至少上传一个文件' }]}
      >
        <FileUpLoad maxCount={1} />
      </CyFormItem>
    </Form>
  );
};

export default ImportWareHouse;
