import EmptyTip from "@/components/empty-tip";
import { createResult, downloadFile, getResultTreeData } from "@/services/project-management/all-project";
import { getUploadUrl } from "@/services/resource-config/drawing";
import { useControllableValue, useRequest } from "ahooks";
import { Button, Modal, Spin, Tree, message } from "antd"
import React, { Dispatch, SetStateAction, useState } from "react"

import styles from "./index.less"


interface CheckResultModalProps {
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent: () => void
    projectInfo: any
}

const { DirectoryTree } = Tree;

const CheckResultModal: React.FC<CheckResultModalProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const { changeFinishEvent, projectInfo } = props;
    const [requestLoading, setRequestLoading] = useState(false)

    const onCheck = (checkedKeysValue: React.Key[]) => {

        setCheckedKeys(checkedKeysValue);
    };

    const { data: treeData = [], loading, run } = useRequest(() => getResultTreeData(projectInfo.projectId), { ready: !!projectInfo.projectId, refreshDeps: [projectInfo.projectId] })

    const closeEvent = () => {
        setState(false)
        changeFinishEvent?.()
    }

    const mapTreeData = (data: any) => {
        return {
            title: data.name,
            value: data.path,
            key: data.path,
            children: data.children ? data.children.map(mapTreeData) : [],
        };
    };

    const refresh = () => {
        message.success("刷新成功");
        run()
    }

    const createFile = async () => {
        if (checkedKeys.length === 0) {
            message.error("请至少选择一个文件进行下载");
            return
        }
        try {
            setRequestLoading(true);
            const path = await createResult({
                projectId: projectInfo.projectId,
                paths: checkedKeys
            })
            const res = await downloadFile({
                path: path,
            })

            let blob = new Blob([res], {
                type: 'application/zip'
            });
            let finalyFileName = `导出成果.zip`;
            // for IE
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
            } else {
                // for Non-IE
                let objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.href = objectUrl;
                link.setAttribute("download", finalyFileName);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setRequestLoading(false);
        }

        message.success("生成成功");
    }



    return (
        <Modal title="查看成果" width={750} visible={state as boolean} destroyOnClose footer={null} onCancel={() => closeEvent()}>
            <div className={`${styles.resultButton} flex`}>
                <div className="flex1">
                    <span className={styles.titleIcon}></span>
                    <span className={styles.helpTitle}>项目名称: </span>
                    <span>
                        {projectInfo.projectName}
                    </span>
                </div>
                <div className="flex1">
                    <span className={styles.titleIcon}></span>
                    <span className={styles.helpTitle}>当前阶段: </span>
                    <span>
                        {projectInfo.projectStatus}
                    </span>
                </div>
                <div className={styles.resultButtonContent}>
                    <Button className="mr7" onClick={() => refresh()}>
                        刷新
                    </Button>
                    <Button type="primary" onClick={() => createFile()}>
                        生成
                    </Button>
                </div>
            </div>
            <div className={styles.treeTableContent}>
                <Spin spinning={loading}>
                    {
                        treeData.length > 0 &&
                        <div className={styles.treeTable}>
                            <DirectoryTree
                                checkable
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                defaultExpandAll={true}
                                treeData={treeData.map(mapTreeData)}
                            />
                        </div>
                    }
                    {
                        treeData.length === 0 &&
                        <EmptyTip description="暂无消息" />
                    }
                </Spin>
            </div>
        </Modal>
    )
}

export default CheckResultModal