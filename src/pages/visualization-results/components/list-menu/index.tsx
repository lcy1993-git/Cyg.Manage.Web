import React, { FC, useMemo, useState } from 'react';
import { Menu, message, Modal, Table } from 'antd';
import Icon, { CopyOutlined, HeatMapOutlined, NodeIndexOutlined } from '@ant-design/icons';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import { useContainer } from '../../result-page/mobx-store';
import { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import {
  fetchMaterialListByProjectIdList,
  fetchTrackTimeLine,
  MaterialDataType,
} from '@/services/visualization-results/list-menu';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import { Track2, Track1 } from '@/assets/list-menu-icon';

export const columns: ColumnsType<MaterialDataType> = [
  {
    title: '物料类型',
    width: 120,
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
  },
  {
    title: '物料名称',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '物料型号',
    width: 100,
    dataIndex: 'spec',
    key: 'spec',
  },

  {
    title: '物料编号',
    width: 100,
    dataIndex: 'materialId',
    key: 'materialId',
  },

  {
    title: '物料单位',
    width: 100,
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '数量',
    width: 100,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
  },
  {
    title: '物料编号',
    width: 100,
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '单价(元)',
    width: 100,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },
  {
    title: '单量',
    width: 100,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '描述',
    width: 100,
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '供给方',
    width: 100,
    dataIndex: 'supplySide',
    key: 'supplySide',
  },
  {
    title: '备注',
    width: 100,
    dataIndex: 'remark',
    key: 'remark',
  },
];

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

const dontNeedSelectKey = ['1', '2', '3'];
const ListMenu: FC = observer(() => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<MaterialDataType[]>();
  const store = useContainer();
  const { vState } = store;
  const { checkedProjectIdList } = vState;

  useMemo(() => {
    if (checkedProjectIdList.length === 0) {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
    }
  }, [checkedProjectIdList]);

  const { data: materialData, run: fetchMaterialList } = useRequest(
    fetchMaterialListByProjectIdList,
    {
      manual: true,
      onSuccess: () => {
        /**
         * 材料的table树
         *  - 类型
         *    - 类型 ------------
         */
        if (materialData?.length) {
          setMaterialList(generateMaterialTreeList(materialData));
          setMaterialModalVisible(true);
        } else {
          setMaterialModalVisible(false);
          message.warning('没有检索到数据');
        }
      },
      onError: () => {
        message.warning('获取数据失败');
      },
    },
  );

  const { data: timelineData, run: fetchTimeline } = useRequest(fetchTrackTimeLine, {
    manual: true,
    onSuccess: () => {
      if (timelineData?.surveyTimeLine.length === 0) {
        message.warning('没有数据');
      }
      store.setObeserveTrackTimeline(timelineData?.surveyTimeLine ?? []);
    },
    onError: () => {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
      message.warning('获取数据失败');
    },
  });

  const onSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    /**
     * 筛选出要高亮的menu，dontSelectkey就是不需要高亮的menu
     */
    if (dontNeedSelectKey.indexOf(key.toString()) === -1) {
      setSelectedKeys(selectedKeys?.map((v: React.Key) => v.toString()) ?? []);
    }

    switch (key.toString()) {
      case '1':
        onClickProjectDetailInfo();
        break;
      case '2':
        store.togglePositionMap();
        store.setOnPositionClickState();
        break;
      case '3':
        fetchMaterialList(checkedProjectIdList?.map((v: ProjectList) => v.id) ?? []);
        break;
      case '4':
        onClickObserveTrack();
        break;
      default:
        break;
    }
  };

  const onDeSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    setSelectedKeys(selectedKeys?.map((v: React.Key) => v.toString()) ?? []);

    switch (key.toString()) {
      case '4':
        store.toggleObserveTrack(false);
        break;
      case '5':
        store.toggleConfessionTrack(false);
        break;
    }
  };

  const onClickObserveTrack = () => {
    if (checkedProjectIdList.length === 1) {
      fetchTimeline(checkedProjectIdList[0].id);
      store.toggleObserveTrack(true);
    } else {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
      message.warning('请选择一个数据');
    }
  };

  const onClickProjectDetailInfo = () => {
    if (checkedProjectIdList?.length !== 1) {
      message.warning('请选择一个项目');
    } else {
      setProjectModalVisible(true);
    }
  };

  return (
    <>
      {checkedProjectIdList?.length === 1 && projectModalVisible ? (
        <ProjectDetailInfo
          projectId={checkedProjectIdList[0].id}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      ) : null}

      <Menu
        style={{ width: 150, backgroundColor: 'rgba(233, 233, 235, 0.6)' }}
        selectedKeys={selectedKeys}
        onSelect={(info: {
          key: React.Key;
          keyPath: React.Key[];
          item: React.ReactInstance;
          domEvent: React.MouseEvent<HTMLElement>;
          selectedKeys?: React.Key[];
        }) => onSelected(info.key, info.selectedKeys)}
        multiple={true}
        onDeselect={(info: {
          key: React.Key;
          keyPath: React.Key[];
          item: React.ReactInstance;
          domEvent: React.MouseEvent<HTMLElement>;
          selectedKeys?: React.Key[];
        }) => onDeSelected(info.key, info.selectedKeys)}
        mode="inline"
      >
        <Menu.Item key="1" icon={<CopyOutlined />}>
          项目详情
        </Menu.Item>
        <Menu.Item key="2" icon={<HeatMapOutlined />}>
          地图定位
        </Menu.Item>
        <Menu.Item key="3" icon={<NodeIndexOutlined />}>
          材料表
        </Menu.Item>
        <Menu.Item key="4">勘察轨迹</Menu.Item>
      </Menu>

      <Modal
        title="材料表"
        centered
        visible={materialModalVisible}
        onOk={() => setMaterialModalVisible(false)}
        onCancel={() => setMaterialModalVisible(false)}
        width={1500}
      >
        <Table
          columns={columns}
          rowKey="key"
          pagination={false}
          dataSource={materialList}
          scroll={{ x: 1400, y: 400 }}
        />
      </Modal>
    </>
  );
});

export default ListMenu;
