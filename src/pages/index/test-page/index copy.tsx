import FileUpload from '@/components/file-upload';
import { Button, Form, Select, Tabs } from 'antd';
import React from 'react';
import TableImportButton from '@/components/table-import-button';
import TableExportButton from '@/components/table-export-button';
import ReadonlyItem from '@/components/readonly-item';
import ReplyComponent from '@/components/reply-component';
import TableStatus from '@/components/table-status';
import FileUploadOnline from '@/components/file-upload-online';
import EditFormTable from '@/components/edit-form-table';
import { Input } from 'antd';
import GanttComponentView from '@/components/gantt-component-view';

const { TabPane } = Tabs;

const testJson = {
  Accept: 'application/json',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEzMDI5MjI3NzYwNTk4NjMwNDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNTk4NjMwNDEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDb21wYW55IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9jb21wYW55IjoiMTMwMjkyMjAwNzQyODQ4OTIxNiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvaXNzdXBlcmFkbWluIjoiRmFsc2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2NsaWVudGlwIjoiMTAuNi45LjIzMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwMjEvMi8zIDE0OjUxOjAwIiwibmJmIjoxNjEyMjQ4NjYwLCJleHAiOjE2MTIzMzUwNjAsImlzcyI6ImN5Z0AyMDE5IiwiYXVkIjoiY3lnQDIwMTkifQ.OBKGGqa0vDYn9MqEn2yb93WWlWc6KyeMFCzESMaanKc',
  'Content-Length': '596',
  'Content-Type': 'application/json; charset=utf-8',
  Expect: '100-continue',
  Host: '10.6.1.36:8015',
  'X-Request-Id': '1356510666121211904',
};

const TestPage = () => {
  const [form] = Form.useForm();

  const getFormValue = () => {
    form.validateFields().then(async (value) => {});
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      index: 'name',
      rules: [{ required: true, message: '该值必填' }],
      render: () => {
        return <Input />;
      },
    },
    {
      title: '下拉选择',
      dataIndex: 'select',
      index: 'slect',
      width: 280,
      render: () => {
        return <Select></Select>;
      },
    },
  ];

  return (
    <Form form={form}>
      <Form.Item name="file">
        <FileUpload maxCount={1} />
      </Form.Item>
      {/* 导入 */}
      <TableImportButton importUrl="/Dictionary/Import" />
      {/* 导出 */}
      <TableExportButton exportUrl="/Dictionary/Export" />
      <ReadonlyItem label="反馈用户2">1355027394511482881</ReadonlyItem>
      <ReadonlyItem label="反馈用户">1355027394511482881</ReadonlyItem>
      <ReadonlyItem label="反馈用户">1355027394511482881</ReadonlyItem>
      <ReadonlyItem label="反馈用户">1355027394511482881</ReadonlyItem>

      <Tabs className="normalTabs" tabBarGutter={25}>
        <TabPane key="1" tab="基本信息">
          12
        </TabPane>
        <TabPane tab="内容" key="2">
          13
        </TabPane>
        <TabPane tab="请求头" key="3">
          14
        </TabPane>
      </Tabs>
      {/* json数据展示 */}
      <pre>{JSON.stringify(testJson, null, 2)}</pre>

      <span className="tipInfo">2020-01-12</span>

      <ReplyComponent name="黄卓" time="2020-02-02 10:20:24">
        反馈功能希望美化界面
      </ReplyComponent>

      <TableStatus>普通管理员</TableStatus>

      <TableStatus color="orange">普通管理员</TableStatus>

      <TableStatus color="greenOne">普通管理员</TableStatus>

      <TableStatus color="greenTwo">普通管理员</TableStatus>

      <TableStatus color="greenThree">普通管理员</TableStatus>

      <TableStatus color="greenFour">普通管理员</TableStatus>

      <TableStatus color="greenFive">普通管理员</TableStatus>

      <Form.Item name="fileId">
        <FileUploadOnline action="/Upload/StaticFile" maxCount={1} />
      </Form.Item>

      <EditFormTable formName="project" columns={columns}></EditFormTable>

      <GanttComponentView />

      <Button onClick={() => getFormValue()}>测试</Button>
    </Form>
  );
};

export default TestPage;
