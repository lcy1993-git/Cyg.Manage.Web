import FileUpload from "@/components/file-upload";
import {Button, Form} from "antd";
import React from "react";
import {testUpload} from "@/services/common"
import TableImportButton from "@/components/table-import-button";

const TestPage = () => {
    const [form] = Form.useForm();

    const submitTest = () => {
        form.validateFields().then(async(values) => {
            const {file} = values;

            await testUpload(file.fileList ?? [])
        })
    }

    return (
        <Form form={form}>
            <Form.Item name="file">
                <FileUpload maxCount={1} />
            </Form.Item>
            <Button onClick={submitTest}>
                 测试
            </Button>
            <TableImportButton importUrl="" />
        </Form>
    )
}

export default TestPage