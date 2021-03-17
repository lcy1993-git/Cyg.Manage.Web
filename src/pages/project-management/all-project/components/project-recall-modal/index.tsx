import EmptyTip from '@/components/empty-tip';
import { getHasShareDetailData, recallShare } from '@/services/project-management/all-project';
import { useControllableValue, useRequest } from 'ahooks';
import { Button, message, Modal, Table } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './index.less';

interface ProjectRecallModalProps {
  projectId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
}

const ProjectRecallModal: React.FC<ProjectRecallModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);

  const [tableSelectArray, setTableSelectArray] = useState<any[]>([]);

  const { projectId, changeFinishEvent } = props;

  const { data: shareDetailData = [], run: getShareDetailData } = useRequest(
    () => getHasShareDetailData(projectId),
    { manual: true },
  );

  const recallEvent = async () => {
    if (tableSelectArray.length === 0) {
      message.error('请选择一个目标');
      return;
    }
    try {
      setRequestLoading(true);
      await recallShare(tableSelectArray);
      message.success('撤回共享成功');
      setState(false);
      changeFinishEvent?.();
    } catch (msg) {
      console.error(msg);
    } finally {
      setRequestLoading(false);
    }
  };

  const tableSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setTableSelectArray(selectedRows.map((item) => item['id']));
    },
  };

  const tableColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '序号',
      width: 80,
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'companyName',
      index: 'companyName',
      title: '公司名称',
    },
  ];

  useEffect(() => {
    if (state) {
      getShareDetailData();
    }
  }, [state]);

  return (
    <Modal
      title="撤回共享"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => recallEvent()}>
          保存
        </Button>,
      ]}
      onOk={() => recallEvent()}
      onCancel={() => setState(false)}
    >
      <div className={styles.hasShareModal}>
        <Table
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          dataSource={shareDetailData}
          bordered={true}
          rowKey={'id'}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            columnWidth: '38px',
            selectedRowKeys: tableSelectArray,
            ...tableSelection,
          }}
          columns={tableColumns}
        ></Table>
      </div>
    </Modal>
  );
};

export default ProjectRecallModal;
