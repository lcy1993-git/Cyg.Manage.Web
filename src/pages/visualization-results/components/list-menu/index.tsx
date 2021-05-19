import React, { FC, useState } from 'react';
import { Menu, message, Modal, Switch, Tooltip } from 'antd';
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
import { useRequest } from 'ahooks';
import {
  fetchMaterialListByProjectIdList,
  MaterialDataType,
} from '@/services/visualization-results/list-menu';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import { MaterialTable } from '../material-table';

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
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<MaterialDataType[]>();
  const [commentTableModalVisible, setCommentTableModalVisible] = useState<boolean>(false);
  const store = useContainer();
  const { vState } = store;
  const { checkedProjectIdList } = vState;

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

  const onCilickPositionMap = () => {
    store.togglePositionMap();
    store.setOnPositionClickState();
  };

  const onClickMaterialTable = () => {
    setMaterialModalVisible(true);
    fetchMaterialListRquest(checkedProjectIdList?.map((v: ProjectList) => v.id) ?? []);
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

  const menuListProcessor = {
    projectDetail: onClickProjectDetailInfo,
    positionMap: onCilickPositionMap,
    materialTable: onClickMaterialTable,
    commentTable: onClickCommentTable,
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
        selectedKeys={[]}
        onSelect={(info) => menuListProcessor[info.key.toString()]()}
        multiple={true}
        mode="inline"
      >
        {checkedProjectIdList?.length > 1 ? (
          <Menu.Item key="projectDetail" disabled>
            <Tooltip title="多选状态下无法查看项目详情">
              <CopyOutlined style={{ color: 'red' }} />
              <span style={{ color: 'red' }}>项目详情</span>

              <QuestionCircleOutlined style={{ color: 'red', marginLeft: 8 }} />
            </Tooltip>
          </Menu.Item>
        ) : (
          <Menu.Item key="projectDetail" className={styles.menuItem}>
            <CopyOutlined />
            项目详情
          </Menu.Item>
        )}

        <Menu.Item key="positionMap" icon={<HeatMapOutlined />}>
          地图定位
        </Menu.Item>
        <Menu.Item key="materialTable" icon={<NodeIndexOutlined />}>
          材料表
        </Menu.Item>
        {checkedProjectIdList?.length > 1 ? (
          <Menu.Item key="commentTable" disabled>
            <Tooltip title="多选状态下无法查看审阅消息">
              <CommentOutlined style={{ color: 'red' }} />
              <span style={{ color: 'red' }}>审阅消息</span>
              <QuestionCircleOutlined style={{ color: 'red', marginLeft: 4 }} />
            </Tooltip>
          </Menu.Item>
        ) : (
          <Menu.Item key="commentTable" className={styles.menuItem}>
            <CommentOutlined />
            审阅消息
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
        <MaterialTable data={materialList} loading={fetchMaterialListLoading} />
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
            projectId={checkedProjectIdList[0].id}
            engineerId={checkedProjectIdList[0].engineerId}
          />
        ) : null}
      </Modal>
    </>
  );
});

export default ListMenu;
