import React, { useState } from "react";
import { Upload, UploadProps, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import styles from "./index.less";
import FileUploadShowItem from "../file-upload-show-item";
/**
 *  组件功能设计需求： 
 *  1. 公司需要的upload功能简单封装。 
 *  2. 让使用的人可以用formItem直接获取到数据进行保存
 *  @param
 *  @param
 * */

const { Dragger } = Upload;

interface FileUploadProps extends UploadProps {
    onChange?: (value: any) => {}
    maxSize?: number
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
    const { onChange,maxSize = 16 } = props;

    const [fileList, setFileList] = useState<any[]>([]);

    const beforeUploadEvent = (file: any) => {
        const isBeyoundSize = file.size / 1024 / 1024 < maxSize;
        if (!isBeyoundSize) {
            message.error(`${file.name}大小超出限制${maxSize}MB，请修改后重新上传`);
            return isBeyoundSize;
        }
        
        const copyFileList = [...fileList];
        copyFileList.push(file);
        // 文件大小检验
        setFileList(copyFileList)
        onChange?.(copyFileList)
        
        return false
    }

    const params = {
        ...props,
        beforeUpload: beforeUploadEvent,
        showUploadList: false
    };

    const deleteUploadItem = (uid: string) => {
        const copyFileList = [...fileList];
        const thisDataIndex = copyFileList.findIndex((item: any) => item.uid === uid);
        if(thisDataIndex > -1) {
            copyFileList.splice(thisDataIndex,1);
            setFileList(copyFileList)
            onChange?.(copyFileList)
        }
    }

    const hasUploadFileShow = fileList.map((file) => {
        return (
            <FileUploadShowItem deleteEvent={deleteUploadItem} uid={file.uid} name={file.name} key={file.uid} />
        )
    })

    return (
        <div className={styles.fileUploadContent}>
            <Dragger {...params}>
                <div>
                    <div className={styles.fileUploadTip}>
                        <CloudUploadOutlined className={styles.fileUploadIcon} />
                        <span>添加文件或拖放文件上传</span>
                    </div>
                </div>
            </Dragger>
            <div className={styles.hasUploadFile}>
                {hasUploadFileShow}
            </div>
        </div>
    )
}

export default FileUpload