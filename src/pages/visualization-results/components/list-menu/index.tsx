import React, { FC, useMemo, useState } from 'react';
import { Menu, message, Modal, Switch, Table, Tooltip } from 'antd';
import styles from './index.less';
import {
  CommentOutlined,
  CopyOutlined,
  HeatMapOutlined,
  NodeIndexOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import { useContainer } from '../../result-page/mobx-store';
import CommentTable from '../comment-table';

import { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import {
  fetchMaterialListByProjectIdList,
  MaterialDataType,
} from '@/services/visualization-results/list-menu';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';

export const columns: ColumnsType<MaterialDataType> = [
  {
    title: '编号',
    width: 100,
    dataIndex: 'index',
    key: 'index',
    fixed: 'left',
    render: (text, record, idx) => (record.children ? idx + 1 : null),
  },
  {
    title: '物料类型',
    width: 200,
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
  },
  {
    title: '物料名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '物料型号',
    width: 500,
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'materialId',
    key: 'materialId',
  },

  {
    title: '物料单位',
    width: 80,
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '数量',
    width: 80,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
  },

  {
    title: '单价(元)',
    width: 80,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },
  {
    title: '单重(kg)',
    width: 80,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '物料 描述',
    width: 200,
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '供给方',
    width: 200,
    dataIndex: 'supplySide',
    key: 'supplySide',
  },
  {
    title: '备注',
    width: 200,
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

const ListMenu: FC = observer(() => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<MaterialDataType[]>();
  const [commentTableModalVisible, setCommentTableModalVisible] = useState<boolean>(false);
  const store = useContainer();
  const { vState } = store;
  const { checkedProjectIdList } = vState;

  useMemo(() => {
    if (checkedProjectIdList.length === 0) {
      setSelectedKeys(selectedKeys.filter((v: string) => v !== '4'));
    }
  }, [checkedProjectIdList]);

  const {
    data: materialListReponseData,
    run: fetchMaterialListRquest,
    loading: fetchMaterialListLoading,
  } = useRequest(fetchMaterialListByProjectIdList, {
    manual: true,
    onSuccess: () => {
      /**
       * 材料的table树
       *  - 类型
       *    - 类型 ------------
       */
      if (materialListReponseData?.length) {
        setMaterialList(generateMaterialTreeList(materialListReponseData));
      } else {
        message.warning('没有检索到数据');
      }
    },
    onError: () => {
      message.warning('获取数据失败');
    },
  });

  const onSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    switch (key.toString()) {
      case '1':
        onClickProjectDetailInfo();
        break;
      case '2':
        store.togglePositionMap();
        store.setOnPositionClickState();
        break;
      case '3':
        setMaterialModalVisible(true);
        fetchMaterialListRquest(checkedProjectIdList?.map((v: ProjectList) => v.id) ?? []);
        break;
      case '4':
        onClickCommentTable();
        break;
      default:
        break;
    }
  };

  const onDeSelected = (key: React.Key, selectedKeys?: React.Key[]) => {
    setSelectedKeys(selectedKeys?.map((v: React.Key) => v.toString()) ?? []);
  };

  const onClickCommentTable = () => {
    if (checkedProjectIdList?.length !== 1) {
      setProjectModalVisible(false);
      message.warning('请选择一个项目');
    } else {
      setCommentTableModalVisible(true);
    }
  };

  const onClickProjectDetailInfo = () => {
    if (checkedProjectIdList?.length !== 1) {
      message.warning('请选择一个项目');
      setProjectModalVisible(false);
    } else {
      setProjectModalVisible(true);
    }
  };

  return (
    <>
      {checkedProjectIdList?.length === 1 ? (
        <ProjectDetailInfo
          projectId={checkedProjectIdList[0].id}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      ) : null}

      <Menu
        style={{ width: 152, backgroundColor: 'rgba(233, 233, 235, 0.8)' }}
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
        {checkedProjectIdList?.length > 1 ? (
          <Menu.Item key="1" disabled>
            <Tooltip title="同时只能查看一个项目详情">
              <CopyOutlined style={{ color: 'red' }} />
              <span style={{ color: 'red' }}>项目详情</span>

              <QuestionCircleOutlined style={{ color: 'red', marginLeft: 8 }} />
            </Tooltip>
          </Menu.Item>
        ) : (
          <Menu.Item key="1" className={styles.menuItem}>
            <CopyOutlined />
            项目详情
          </Menu.Item>
        )}

        <Menu.Item key="2" icon={<HeatMapOutlined />}>
          地图定位
        </Menu.Item>
        <Menu.Item key="3" icon={<NodeIndexOutlined />}>
          材料表
        </Menu.Item>
        {checkedProjectIdList?.length > 1 ? (
          <Menu.Item key="4" disabled>
            <Tooltip title="同时只能查看一个评审">
              <CommentOutlined style={{ color: 'red' }} />
              <span style={{ color: 'red' }}>评审列表 </span>
              <QuestionCircleOutlined style={{ color: 'red', marginLeft: 4 }} />
            </Tooltip>
          </Menu.Item>
        ) : (
          <Menu.Item key="4" className={styles.menuItem}>
            <CommentOutlined />
            评审列表
          </Menu.Item>
        )}

        <div className={styles.observeTrack}>
          勘察轨迹
          <Switch
            style={{ marginLeft: 8 }}
            onChange={() => store.toggleObserveTrack()}
            size="small"
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </div>
      </Menu>

      <Modal
        title="材料表"
        centered
        visible={materialModalVisible}
        onOk={() => setMaterialModalVisible(false)}
        onCancel={() => setMaterialModalVisible(false)}
        width={2000}
      >
        <Table
          columns={columns}
          bordered
          size="middle"
          loading={fetchMaterialListLoading}
          rowKey="key"
          pagination={false}
          dataSource={materialList}
          scroll={{ x: 1400, y: 1000 }}
        />
      </Modal>

      <Modal
        title="审阅列表"
        centered
        visible={commentTableModalVisible}
        onOk={() => setCommentTableModalVisible(false)}
        onCancel={() => setCommentTableModalVisible(false)}
        width={1500}
      >
        {checkedProjectIdList.length > 0 ? (
          <CommentTable
            projectIds={[checkedProjectIdList[0].id]}
            engineerId={checkedProjectIdList[0].engineerId}
          />
        ) : null}
      </Modal>
    </>
  );
});

export default ListMenu;
