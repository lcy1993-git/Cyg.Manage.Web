import React, { SetStateAction, useState } from 'react';
import { Form, message, Modal } from 'antd';

import { useControllableValue, useRequest } from 'ahooks';
import SelectAddListForm from '../select-add-list-form';
import uuid from 'node-uuid';
import { Dispatch } from 'react';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
  visible: boolean;
}

const ExternalArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [form] = Form.useForm();
  const {} = props;

  // const { data: companyInfo, run: getCompanyInfoEvent } = useRequest(getCompanyName, {
  //   manual: true,
  // });

  const modalCloseEvent = () => {
    setState(false);
    form.resetFields();
  };

  return (
    <Modal
      title="外审安排"
      visible={state as boolean}
      maskClosable={false}
      width={750}
      destroyOnClose
      onOk={() => {}}
      onCancel={() => modalCloseEvent()}
    >
      <Form style={{ width: '100%' }} form={form}>
        <SelectAddListForm />
      </Form>
    </Modal>
  );
};

export default ExternalArrangeForm;
