import React, { FC, useEffect, useState } from 'react';
import { Menu, message, Modal, Table } from 'antd';
import Icon, { CopyOutlined, HeatMapOutlined, NodeIndexOutlined } from '@ant-design/icons';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import { useContainer } from '../../result-page/store';
import { useRequest } from 'ahooks';
import { GetMaterialListByProjectIdList } from '@/services/visualization-results/list-menu';
import { ProjectList } from '@/services/visualization-results/visualization-results';

interface MaterialDataType {
  description: string;
  itemNumber: number;
  materialId: string;
  name: string;
  pieceWeight: number;
  spec: string;
  state: string;
  type: string;
  unit: string;
  unitPrice: number;
  remark: string;
  code: string;
  supplySide: string;
}

const Track1 = () => (
  <svg
    t="1618986400215"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1074"
    width="13"
    height="13"
  >
    <path
      d="M816 624h-1 1zM1024 992c0 17.7-14.3 32-32 32H240.3v-0.6l-0.3 0.6h-1c-35.9 0-69.8-14-95.6-39.5-26-25.9-40.4-60.1-40.4-96.5s14.4-70.6 40.4-96.5c26-25.8 60.3-39.8 96.6-39.5h575c17.3 0 32-14.7 32-32 0-17.4-14.7-32-32-32H432l48-64h336c52.5 0.5 95 43.4 95 96s-42.5 95.5-95 96H239c-18.9 0-36.9 7.4-50.5 21-13.8 13.7-21.5 31.8-21.5 51s7.6 37.3 21.5 51c13.7 13.6 31.6 21 50.5 21h0.7l0.3 0.6v-0.6h752c17.7 0 32 14.3 32 32z"
      p-id="1075"
      fill="#505050"
    ></path>
    <path
      d="M240.3 1024h-0.3l0.3-0.6zM816 816h-1 1zM288.4 64.4c59.7 0 115.9 23.3 158.1 65.5C488.8 172.2 512 228.3 512 288c0 49.8-16.3 97.1-47 137l-0.3 0.4-0.3 0.4-176 236.4-181.1-243c-27.9-38.5-42.6-83.9-42.6-131.3 0-59.7 23.3-115.9 65.5-158.1 42.3-42.1 98.4-65.4 158.2-65.4m0-64C129.5 0.4 0.7 129.3 0.7 288.1c0 63.1 20.4 121.5 55 169.2l232.7 312.3 227.3-305.3c37.7-48.8 60.4-109.6 60.4-176.1C576 129.3 447.2 0.4 288.4 0.4z"
      p-id="1076"
      fill="#505050"
    ></path>
    <path
      d="M288 211.8c44.1 0 80 35.9 80 80s-35.9 80-80 80-80-35.9-80-80 35.9-80 80-80m0-64c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144z"
      p-id="1077"
      fill="#505050"
    ></path>
  </svg>
);

const Track2 = () => (
  <svg
    t="1618986577250"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1241"
    width="16"
    height="16"
  >
    <path
      d="M474.4 864.8l13.6 13.6 3.2 2.4c13.6 9.6 32 8.8 44-2.4l14.4-13.6c167.2-163.2 264.8-304 292-422.4 4-20 6.4-40.8 6.4-62.4C848 205.6 697.6 64 512 64S176 205.6 176 380c0 20.8 2.4 42.4 6.4 62.4 27.2 118.4 124.8 259.2 292 422.4zM512 253.6c74.4 0 134.4 56.8 134.4 126.4S586.4 506.4 512 506.4s-134.4-56.8-134.4-126.4S437.6 253.6 512 253.6z"
      p-id="1242"
      fill="#505050"
    ></path>
    <path
      d="M684.8 778.4c-39.2 41.6-77.6 85.6-128.8 131.2l-16.8 14.4c-14.4 11.2-36 12.8-51.2 2.4l-4-2.4-16-13.6c-51.2-45.6-90.4-88.8-128.8-131.2-125.6 16-211.2 48-211.2 85.6 0 52.8 172 96 384 96s384-43.2 384-96c0-38.4-85.6-70.4-211.2-86.4z"
      p-id="1243"
      fill="#505050"
    ></path>
  </svg>
);

const columns = [
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
const ListMenu: FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<
    {
      key: string;
      type: string;
      children: MaterialDataType[];
    }[]
  >();
  const { vState, toggleConfessionTrack, toggleObserveTrack, togglePositionMap } = useContainer();
  const { checkedProjectIdList } = vState;

  const { data: materialData, run: fetchMaterialList, loading } = useRequest(
    GetMaterialListByProjectIdList,
    {
      manual: true,
      onSuccess: () => {
        if (materialData.length) {
          /**
           * 获取type
           */
          const typeSet: Set<String> = new Set();
          materialData.forEach((v: MaterialDataType) => {
            typeSet.add(v.type);
          });
          const typeArr = [...typeSet];
          const parentArr: {
            key: string;
            type: string;
            children: MaterialDataType[];
          }[] = typeArr.map((value: String, index: number, array: String[]) => {
            return {
              key: value + Date.now().toString(),
              type: value,
              children: [],
            };
          });
          parentArr.forEach(
            (
              value: { key: string; type: String; children: MaterialDataType[] },
              index: number,
              array: { key: string; type: String }[],
            ) => {
              let data: MaterialDataType[] = [];
              materialData.forEach((v: MaterialDataType) => {
                if (v.type === value.type) {
                  data.push(v);
                }
              });
              value.children = data;
            },
          );

          console.log(parentArr);

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

  const onSelected = (menuInfo: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    if (dontNeedSelectKey.indexOf(menuInfo.key.toString()) === -1) {
      setSelectedKeys([menuInfo.key.toString()]);
    }
  };

  const onClick = (menuInfo: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    if (selectedKeys.indexOf(menuInfo.key.toString()) !== -1) {
      setSelectedKeys([]);
    }
  };

  return (
    <>
      <ProjectDetailInfo
        projectId={checkedProjectIdList?.length === 1 ? checkedProjectIdList[0].id : ''}
        visible={checkedProjectIdList?.length === 1 ? projectModalVisible : false}
        onChange={setProjectModalVisible}
      />

      <Menu
        style={{ width: 150, backgroundColor: 'rgba(233, 233, 235, 0.6)' }}
        selectedKeys={selectedKeys}
        onClick={onClick}
        onSelect={onSelected}
        mode="inline"
      >
        <Menu.Item key="1" onClick={() => setProjectModalVisible(true)} icon={<CopyOutlined />}>
          项目详情
        </Menu.Item>
        <Menu.Item key="2" onClick={() => togglePositionMap()} icon={<HeatMapOutlined />}>
          地图定位
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() =>
            fetchMaterialList(checkedProjectIdList?.map((v: ProjectList) => v.id) ?? [])
          }
          icon={<NodeIndexOutlined />}
        >
          材料表
        </Menu.Item>
        <Menu.Item key="4" onClick={() => toggleObserveTrack()} icon={<Icon component={Track1} />}>
          勘察轨迹
        </Menu.Item>
        <Menu.Item
          key="5"
          onClick={() => toggleConfessionTrack()}
          icon={<Icon component={Track2} />}
        >
          交底轨迹
        </Menu.Item>
      </Menu>

      <Modal
        title="材料表"
        centered
        visible={materialModalVisible}
        onOk={() => setMaterialModalVisible(false)}
        onCancel={() => setMaterialModalVisible(false)}
        width={1200}
      >
        <div style={{ height: '400px' }}>
          <Table
            columns={columns}
            pagination={false}
            dataSource={materialList}
            scroll={{ x: 1400, y: 350 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ListMenu;
