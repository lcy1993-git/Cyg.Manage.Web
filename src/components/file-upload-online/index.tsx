
import { CloudUploadOutlined } from "@ant-design/icons";
import { message, UploadProps,Upload } from "antd";
import React, { useState } from "react"
import FileUploadShowItem, { UploadStatusType } from "../file-upload-show-item";
import { baseUrl } from "@/services/common"

import styles from "./index.less"
import { ReactElement } from "react";
import { UploadFile } from "antd/lib/upload/interface";

const { Dragger } = Upload;

interface FileUploadOnlineProps extends UploadProps {
    uploadUrlType?: "project" | "common" | "upload"
    className?: string
    onChange?: (value: any) => {}
    maxSize?: number
    maxCount?: number
}

const FileUploadOnline: React.FC<FileUploadOnlineProps> = (props) => {
    const { action, maxSize = 16, onChange, maxCount, uploadUrlType = "upload", className = "", ...rest } = props;

    const [fileList, setFileList] = useState<any[]>([]);
    const beforeUploadEvent = (file: any) => {
        const isBeyoundSize = file.size / 1024 / 1024 < maxSize;
        if (!isBeyoundSize) {
            message.error(`${file.name}大小超出限制${maxSize}MB，请修改后重新上传`);
            return isBeyoundSize;
        }
        return true
    }

    const uploadChangeEvent = (info: any) => {
        if (info.file.status === 'done') {
            // 如果maxCount 是1的时候，那么就要随时把上传的替换成最新的哪一个
            if (maxCount && maxCount == 1) {
                const newArray: any[] = [];
                newArray.push(info.file);
                setFileList(newArray)
                getNeedIdArray(newArray)
                return
            }
            setFileList(info.fileList);
            getNeedIdArray(info.fileList)
        }

    }

    const getNeedIdArray = (fileArray: any) => {
        const idArray = fileArray.filter((item: any) => item.response && item.response.code === 200).map((item:any) => item.response.traceId);
        onChange?.(idArray)
    }

    const uploadItemRender = (originNode: ReactElement, file: UploadFile, fileList?: object[]) => {

        let fileStatus = undefined;

        if (!file.response) {
            fileStatus = "error"
        }

        if (file.response.code !== 200) {
            fileStatus = "error"
        }

        return (
            <FileUploadShowItem status={fileStatus as UploadStatusType} name={file.name} uid={file.uid} deleteEvent={deleteUploadItem} />
        )
    }

    const params = {
        ...rest,
        headers: {
            "Authorization": localStorage.getItem("Authorization") ?? ""
        },
        action: `${baseUrl[uploadUrlType]}${action}`,
        fileList: fileList,
        itemRender: uploadItemRender,
        beforeUpload: beforeUploadEvent,
        onChange: uploadChangeEvent,
    };

    const deleteUploadItem = (uid: string) => {
        const copyFileList = [...fileList];
        const thisDataIndex = copyFileList.findIndex((item: any) => item.uid === uid);
        if (thisDataIndex > -1) {
            copyFileList.splice(thisDataIndex, 1);
            setFileList(copyFileList)
            getNeedIdArray(copyFileList)
        }
    }

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
        </div>
    )
}

export default FileUploadOnline