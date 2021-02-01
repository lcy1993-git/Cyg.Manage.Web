import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./index.less"

interface FileUploadShowItemProps {
    name: string
    uid: string
    deleteEvent: (uid: string) => void
}

const FileUploadShowItem:React.FC<FileUploadShowItemProps> = (props) => {
    const {name,uid,deleteEvent} = props;

    const deleteFunction = () => {
        deleteEvent?.(uid);
    }

    return (
        <div className={styles.hasUploadFileShowItem}>
            <div className={styles.hasUploadFileShowItemNameContent}>
                <LinkOutlined className={styles.hasUploadFileShowItemNameIcon} />
                <span className={styles.hasUploadFileShowItemName}>
                    {name}
                </span>
            </div>
            <div className={styles.hasUploadFileShowItemControl}>
                {/* TODO 重命名功能 */}
                {/* <span className={styles.renameButton}>
                    <span className={styles.controlButtonIcon}>
                        <EditOutlined />
                    </span>
                    <span>
                        重命名
                    </span>
                </span> */}
                <span className={styles.deleteButton} onClick={() => deleteFunction()}>
                    <span className={styles.controlButtonIcon}>
                        <DeleteOutlined />
                    </span>
                    <span>
                        删除
                    </span>
                </span>
            </div>
        </div>
    )
}

export default FileUploadShowItem