import {
  fetchMaterialListByProjectIdList,
  MaterialDataType,
} from '@/services/visualization-results/list-menu';
import { useRequest } from 'ahooks';
import { message, Modal } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { MaterialTable } from '../material-table';

export interface MaterialModalProps {
  visible?: boolean;
  onOk: () => void;
  onCancel: () => void;
  checkedProjectIdList: string[];
}

const generateMaterialTreeList = (materialData: MaterialDataType[]): MaterialDataType[] => {
  /**
   * 获取type
   */
  const typeSet: Set<string> = new Set(
    materialData.map((v) => {
      return v.type;
    }),
  );
  /**
   * 先获取到所有的type
   */

  const typeArr = [...typeSet];
  //创建第一层结构
  const parentArr: MaterialDataType[] = typeArr.map((type) => {
    return {
      key: `type${Math.random()}`,
      type: type,
      children: undefined,
    };
  });
  parentArr.forEach((value) => {
    value.children = materialData.filter((materialItem) => {
      materialItem.key = Math.random().toLocaleString();
      return materialItem.type === value.type;
    });
  });

  return parentArr;
};
const MaterialModal: FC<MaterialModalProps> = (props) => {
  const { checkedProjectIdList, visible, onOk, onCancel } = props;
  const [materialList, setMaterialList] = useState<MaterialDataType[]>();
  const { data, loading, run } = useRequest(fetchMaterialListByProjectIdList, {
    manual: true,

    onSuccess: () => {
      /**
       * 材料的table树
       *  - 类型
       *    - 类型 ------------
       */

      if (data) {
        setMaterialList(generateMaterialTreeList(data));
      } else {
        setMaterialList([]);
      }
    },
    onError: () => {
      message.warning('获取数据失败');
    },
  });

  useEffect(() => {
    if (visible) {
      run(checkedProjectIdList);
    }
  }, [visible]);
  return (
    <Modal
      title="材料表"
      centered
      destroyOnClose
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={2000}
    >
      <MaterialTable data={materialList} loading={loading} />
    </Modal>
  );
};

export default MaterialModal;
