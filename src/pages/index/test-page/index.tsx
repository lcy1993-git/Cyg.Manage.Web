import FileUpload from "@/components/file-upload";
import {Button, Form} from "antd";
import React from "react";
import TableImportButton from "@/components/table-import-button";
import TableExportButton from "@/components/table-export-button";

const TestPage = () => {
    const [form] = Form.useForm();

    

    return (
        <Form form={form}>
            <Form.Item name="file">
                <FileUpload maxCount={1} />
            </Form.Item>
            {/* 导入 */}
            <TableImportButton importUrl="/Dictionary/Import" />
            {/* 导出 */}
            <TableExportButton exportUrl="/Dictionary/Export" />
        </Form>
    )
}

export default TestPage