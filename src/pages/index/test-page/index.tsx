
import { Form, Select, Tabs } from 'antd';
import React from 'react';

import { Input } from 'antd';
import GanttComponentView from '@/components/gantt-component-view';

const TestPage = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      
      <GanttComponentView />

    </Form>
  );
};

export default TestPage;
