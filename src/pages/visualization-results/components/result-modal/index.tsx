import React, { Dispatch, memo, SetStateAction, useEffect } from 'react';
import { Modal } from 'antd';
import CheckResultModal from '@/pages/project-management/all-project-new/components/check-result-modal';
import { getProjectInfo } from '@/services/project-management/all-project';
import { useControllableValue, useRequest } from 'ahooks';

interface Props {
  projectId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const ResultModal: React.FC<Props> = (props) => {

  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const { projectId } = props;
  
  const { data: projectInfo, run } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
  });

  useEffect(() => {
    state && run();
  }, [state])

  return (
    <Modal
      maskClosable={false}
      title="查看成果"
      width={745}
      destroyOnClose
      bodyStyle={{ padding: '0 0 20px 0', height: 'auto' }}
      visible={state as boolean}
      footer={null}
      onCancel={() => setState(false)}
    >
      <CheckResultModal
        visible={state}
        onChange={setState}
        projectInfo={{ ...projectInfo, projectId }}
        isResult={true}
      />
    </Modal>
  );
}

export default ResultModal;