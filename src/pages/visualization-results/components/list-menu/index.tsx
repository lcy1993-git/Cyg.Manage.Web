import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info'
import { downloadMapPositon } from '@/services/visualization-results/list-menu'
import { fetchCommentCountById } from '@/services/visualization-results/side-tree'
import { ProjectList } from '@/services/visualization-results/visualization-results'
import {
  CommentOutlined,
  CopyOutlined,
  ExportOutlined,
  HeatMapOutlined,
  NodeIndexOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Menu, message, Switch, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { useContainer } from '../../result-page/mobx-store'
import CommentModal from '../comment-modal'
import ExportMapPositionModal from '../export-map-position-modal'
import MaterialModal from '../material-modal'
import styles from './index.less'

const ListMenu: FC = observer(() => {
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false)
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false)
  const [exportMapPositionModalVisible, setexportMapPositionModalVisible] = useState<boolean>(false)
  const [exportMapPositionLoading, setexportMapPositionLoading] = useState<boolean>(false)
  const [commentTableModalVisible, setCommentTableModalVisible] = useState<boolean>(false)
  const store = useContainer()
  const { vState } = store
  const { checkedProjectIdList } = vState
  const { data: commentCountResponseData, run: fetchCommentCountRquest } = useRequest(
    () => fetchCommentCountById(checkedProjectIdList[0].id),
    {
      manual: true,
      onSuccess: () => {
        if (!commentCountResponseData?.totalQty) {
          message.warn('当前项目不存在审阅消息')
        } else {
          setCommentTableModalVisible(true)
        }
      },
    }
  )

  const { data: mapPosition, run: downloadMapPositonRequest } = useRequest(downloadMapPositon, {
    manual: true,
    onSuccess: () => {
      const a = document.createElement('a')
      a.download = '项目坐标.zip'
      const blob = new Blob([mapPosition], { type: 'application/zip;charset=utf-8' })
      // text指需要下载的文本或字符串内容
      a.href = window.URL.createObjectURL(blob)
      // 会生成一个类似blob:http://localhost:8080/d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
      document.body.appendChild(a)
      a.click()
      a.remove()
      setexportMapPositionModalVisible(false)
      setexportMapPositionLoading(false)
    },
    onError: () => {
      message.warn('导出失败')
    },
  })

  const onCilickPositionMap = () => {
    store.togglePositionMap()
    store.setOnPositionClickState()
  }

  const onClickMaterialTable = () => {
    setMaterialModalVisible(true)
  }

  const onClickCommentTable = () => {
    if (checkedProjectIdList?.length) {
      fetchCommentCountRquest()
    } else {
      message.warn('请选择一个项目')
    }
  }

  const onClickProjectDetailInfo = () => {
    if (checkedProjectIdList?.length !== 1) {
      message.warning('请选择一个项目')
      setProjectModalVisible(false)
    } else {
      setProjectModalVisible(true)
    }
  }

  const onClickExportProjectMapPosition = () => {
    if (checkedProjectIdList?.length === 0) {
      message.warning('请先选择项目')
      setexportMapPositionModalVisible(false)
    } else {
      setexportMapPositionModalVisible(true)
    }
  }

  const onOkWithExportMapPosition = () => {
    downloadMapPositonRequest(checkedProjectIdList.map((item) => item.id))
    setexportMapPositionLoading(true)
  }

  const menuListProcessor = {
    projectDetail: onClickProjectDetailInfo,
    positionMap: onCilickPositionMap,
    materialTable: onClickMaterialTable,
    commentTable: onClickCommentTable,
    exportProjectMapPosition: onClickExportProjectMapPosition,
  }

  return (
    <>
      {checkedProjectIdList?.length === 1 ? (
        <ProjectDetailInfo
          projectId={checkedProjectIdList[0].id}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
          isResult={true}
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
        <Menu.Item key="exportProjectMapPosition" className={styles.menuItem}>
          <ExportOutlined />
          导出项目坐标
        </Menu.Item>
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
            onChange={(checked) => store.toggleObserveTrack(checked)}
            size="small"
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </div>
      </Menu>

      <MaterialModal
        checkedProjectIdList={checkedProjectIdList?.map((v: ProjectList) => v.id)}
        visible={materialModalVisible}
        onCancel={() => setMaterialModalVisible(false)}
        onOk={() => setMaterialModalVisible(false)}
      />

      <CommentModal
        checkedProjectIdList={checkedProjectIdList}
        visible={commentTableModalVisible}
        onCancel={() => setCommentTableModalVisible(false)}
        onOk={() => setCommentTableModalVisible(false)}
      />

      <ExportMapPositionModal
        confirmLoading={exportMapPositionLoading}
        visible={exportMapPositionModalVisible}
        onCancel={() => setexportMapPositionModalVisible(false)}
        onOk={onOkWithExportMapPosition}
      />
    </>
  )
})

export default ListMenu
