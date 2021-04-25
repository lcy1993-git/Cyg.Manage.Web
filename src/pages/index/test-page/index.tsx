import CyFormItem from '@/components/cy-form-item';
import ClickInputNumber from '@/components/clickInput-number';
import { Button, Form } from 'antd';
import React from 'react';

const TestPage = () => {
  const [form] = Form.useForm();

  const test = () => {
    form.validateFields().then((value) => {
      console.log(value);
    });
  };

  return (
    <div style={{ width: '1200px', height: '960px' }}>
      <Form form={form}>
        <CyFormItem name="number" initialValue={5}>
          <ClickInputNumber minNumber={0} />
        </CyFormItem>
      </Form>
      <Button onClick={() => test()}>测试</Button>
    </div>
  );
};

export default TestPage;
