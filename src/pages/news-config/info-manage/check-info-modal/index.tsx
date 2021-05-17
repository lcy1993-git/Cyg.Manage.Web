

import { useControllableValue, useRequest } from 'ahooks';
import { Button, Modal, Spin, message, Tabs } from 'antd';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
    getNewsItemDetail,
} from '@/services/news-config/info-manage';
import styles from './index.less';
import ReadonlyItem from '@/components/readonly-item';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';

interface CheckInfoModalProps {
    visible: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
    newsId: string
}

const CheckInfoModal: React.FC<CheckInfoModalProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
    const { newsId } = props;

    const { data: newsInfo, run, loading } = useRequest(() => getNewsItemDetail(newsId), {
        ready: !!newsId,
        refreshDeps: [newsId],
    });

    console.log(newsInfo)

    useEffect(() => {
        if (state) {
            run();
        }
    }, [state]);

    const userShowInfo = newsInfo?.users.map((item) => {
        return <CyTag key={uuid.v1()} className="mr7 mb7">{item.text}</CyTag>
    })

    const clientCategorysInfo = newsInfo?.clientCategorys.map((item) => {
        return <CyTag key={uuid.v1()} className="mr7 mb7">{item.text}</CyTag>
    })

    return (
        <Modal
            maskClosable={false}
            title="查看消息"
            width="80%"
            bodyStyle={{ overflowX: "auto" }}
            visible={state as boolean}
            destroyOnClose
            footer={null}
            onCancel={() => setState(false)}
        >
            <Spin spinning={loading} tip="正在加载...">
                <ReadonlyItem label="标题">
                    {newsInfo?.title}
                </ReadonlyItem>
                <ReadonlyItem label="状态">
                    {newsInfo?.isEnable ? "启用" : "禁用"}
                </ReadonlyItem>
                <ReadonlyItem label="对象">
                    {userShowInfo}
                </ReadonlyItem>
                <ReadonlyItem label="端口">
                    {clientCategorysInfo}
                </ReadonlyItem>
                <div style={{ width: "100%" }}>
                    <ReadonlyItem label="内容">
                        {
                            newsInfo?.content &&
                            <div dangerouslySetInnerHTML={{ __html: newsInfo?.content! }}>

                            </div>
                        }
                    </ReadonlyItem>
                </div>
            </Spin>
        </Modal>
    );
};

export default CheckInfoModal;
