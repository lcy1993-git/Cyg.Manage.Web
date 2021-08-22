import CyTip from '@/components/cy-tip';
import { useControllableValue, useRequest } from 'ahooks';
import { Divider, Form, message, Modal, Radio, TreeSelect } from 'antd';
import React, { Dispatch, useMemo, useState } from 'react';
import { SetStateAction } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { addCollectionEngineers, getFavorites } from '@/services/project-management/favorite-list';

// import styles from './index.less';

interface ExportPowerModalParams {
  checkedData: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent: () => void;
}

const AddFavoriteModal: React.FC<ExportPowerModalParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [favId, setFavId] = useState<string>('');
  const [treeData, setTreeData] = useState<any[]>([]);
  const { checkedData, finishEvent } = props;

  console.log(checkedData);

  const engineerIds = checkedData.map((item: any) => item.projectInfo.id);
  console.log(engineerIds);

  const { data = [], run } = useRequest(() => getFavorites(), {
    onSuccess: () => {
      setTreeData(data);
    },
  });

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      key: data.id,
      children: data.children?.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData);
  }, [JSON.stringify(treeData)]);

  const addToFavEvent = async () => {
    await addCollectionEngineers({
      id: favId,
      engineerIds: engineerIds,
    });
    message.success('操作成功');
    setState(false);
    finishEvent?.();
  };

  console.log(favId);

  return (
    <Modal
      maskClosable={false}
      title="添加至收藏夹"
      width={755}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => addToFavEvent()}
      cancelText="取消"
      okText="确认"
      bodyStyle={{ height: 180, padding: 0 }}
    >
      <CyTip>您已选中{engineerIds.length}个工程，将添加至所选收藏夹。</CyTip>
      <div style={{ padding: '30px' }}>
        <CyFormItem required label="请选择收藏夹" labelWidth={98}>
          <TreeSelect
            treeData={handleData}
            treeDefaultExpandAll
            placeholder="请选择收藏夹"
            onChange={(value: any) => setFavId(value)}
          />
        </CyFormItem>
      </div>
    </Modal>
  );
};

export default AddFavoriteModal;
