import React, { FC, useEffect, useState } from 'react';
import { Menu, message, Modal, Table } from 'antd';
import Icon, { CopyOutlined, HeatMapOutlined, NodeIndexOutlined } from '@ant-design/icons';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import { useContainer } from '../../result-page/mobx-store';
import { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import {
  GetMaterialListByProjectIdList,
  GetTrackTimeLine,
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

const dontNeedSelectKey = ['1', '2', '3'];
const ListMenu: FC = observer(() => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<MaterialDataType[]>();

  const store = useContainer();
  const { vState } = store;
  const { checkedProjectIdList } = vState;

  useEffect(() => {
    if (checkedProjectIdList.length === 0) {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
    }
  }, [checkedProjectIdList]);

  const { data: materialData, run: fetchMaterialList } = useRequest(
    GetMaterialListByProjectIdList,
    {
      manual: true,
      onSuccess: () => {
        /**
         * 材料的table树
         *  - 类型
         *    - 类型 ------------
         */
        if (materialData?.length) {
          /**
           * 获取type
           */
          const typeSet: Set<string> = new Set();
          /**
           * 先获取到所有的type
           */
          materialData.forEach((v: MaterialDataType) => {
            typeSet.add(v.type);
          });
          const typeArr = [...typeSet];
          //创建第一层结构
          const parentArr: MaterialDataType[] = typeArr.map((type: string) => {
            return {
              key: `type${Math.random()}`,
              type: type,
              children: undefined,
            };
          });
          parentArr.forEach((value: MaterialDataType) => {
            value.children = materialData.filter((materialItem: MaterialDataType) => {
              if (materialItem.type === value.type) {
                materialItem.key = Math.random().toLocaleString();
                return materialItem;
              }
            });
          });

          setMaterialList(parentArr);
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

  const { data: timelineData, run: fetchTimeline } = useRequest(GetTrackTimeLine, {
    manual: true,
    onSuccess: () => {
      if (timelineData.surveyTimeLine.length === 0) {
        message.warning('没有数据');
      }
      store.setObeserveTrackTimeline(timelineData.surveyTimeLine);
    },
    onError: () => {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
      message.warning('获取数据失败');
    },
  });

  const onSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    console.log(key, selectedKeys);

    /**
     * 筛选出要高亮的menu，dontSelectkey就是不需要高亮的menu
     */
    if (dontNeedSelectKey.indexOf(key.toString()) === -1) {
      console.log(123);

      setSelectedKeys(selectedKeys?.map((v: React.Key) => v.toString()) ?? []);
    }

    if (key.toString() === '1') {
      onClickProjectDetailInfo();
    } else if (key.toString() === '2') {
      store.togglePositionMap();
      store.setOnPositionClickState();
    } else if (key.toString() === '3') {
      fetchMaterialList(checkedProjectIdList?.map((v: ProjectList) => v.id) ?? []);
    } else if (key.toString() === '4') {
      onClickObserveTrack();
    } else {
      store.toggleConfessionTrack(true);
    }
  };

  const onDeSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    setSelectedKeys(selectedKeys?.map((v: React.Key) => v.toString()) ?? []);
    if (key.toString() === '5') {
      store.toggleConfessionTrack(false);
    }
    if (key.toString() === '4') {
      store.toggleObserveTrack(false);
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
        <Menu.Item key="4" icon={<Icon component={Track1} />}>
          勘察轨迹
        </Menu.Item>
        <Menu.Item key="5" icon={<Icon component={Track2} />}>
          交底轨迹
        </Menu.Item>
      </Menu>

      <Modal
        title="材料表"
        centered
        visible={materialModalVisible}
        onOk={() => setMaterialModalVisible(false)}
        onCancel={() => setMaterialModalVisible(false)}
        width={1500}
      >
        <div>
          <Table
            columns={columns}
            rowKey="key"
            pagination={false}
            dataSource={materialList}
            scroll={{ x: 1400, y: 400 }}
          />
        </div>
      </Modal>
    </>
  );
});

export default ListMenu;
