import React, { useState } from "react";
import { Button, ButtonProps, Modal, Form } from "antd"
import { ExportOutlined } from "@ant-design/icons";
import CyFormItem from "../cy-form-item";
import FileUpload from "../file-upload";

interface TableImportButtonProps extends ButtonProps {
    importUrl: string
    extraParams?: object
    modalTitle?: string
}

const TableImportButton: React.FC<TableImportButtonProps> = (props) => {
    const { importUrl = "", modalTitle = "导入", extraParams, ...rest } = props;

    const [importModalVisible, setImportModalVisible] = useState(false);
    const [form] = Form.useForm();

    const importEvent = () => {
        form.resetFields();
        setImportModalVisible(true);
    }

    const sureImport = () => {

    }

    return (
        <div>
            <Button {...rest} onClick={() => importEvent()}>
                <ExportOutlined />
                <span>导入</span>
            </Button>
            <Modal
                title={modalTitle} 
                visible={importModalVisible}
                cancelText="取消"
                okText="确认"
                onOk={() => sureImport()}
                onCancel={() => setImportModalVisible(false)}>
                <Form form={form}>
                    <CyFormItem label={"导入"} required>
                        <FileUpload />
                    </CyFormItem>
                </Form>
            </Modal>
        </div>
    )
}

export default TableImportButton