import FileUpload from "@/components/file-upload";
import {Button, Form} from "antd";
import React from "react";
import TableImportButton from "@/components/table-import-button";
import TableExportButton from "@/components/table-export-button";
import ReadonlyItem from "@/components/readonly-item";

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
            <ReadonlyItem label="反馈用户2">
                1355027394511482881
            </ReadonlyItem>
            <ReadonlyItem label="反馈用户">
                1355027394511482881
            </ReadonlyItem>
            <ReadonlyItem label="反馈用户">
                1355027394511482881
            </ReadonlyItem>
            <ReadonlyItem label="反馈用户">
                1355027394511482881
            </ReadonlyItem>
            

        </Form>
    )
}

export default TestPage